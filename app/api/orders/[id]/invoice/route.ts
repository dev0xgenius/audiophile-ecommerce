import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";
import { jsPDF } from "jspdf";
import { applyPlugin } from "jspdf-autotable";
applyPlugin(jsPDF);

function getId(request: NextRequest) {
    const segments = request.nextUrl.pathname.split("/");
    return segments[segments.length - 3];
}

export const GET = withPermission(async (request: NextRequest) => {
    const id = getId(request);

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            customer: { select: { name: true, email: true, phone: true } },
            items: {
                include: { variant: { select: { name: true, sku: true, priceDelta: true } } },
            },
            payments: { select: { provider: true, pspPaymentIntentId: true, status: true } },
        },
    });

    if (!order) {
        return NextResponse.json({ error: "Order not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(20);
    doc.text("INVOICE", pageWidth / 2, 30, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Invoice #: ${order.id.slice(-8).toUpperCase()}`, 20, 45);
    doc.text(`Date: ${order.createdAt.toISOString().slice(0, 10)}`, 20, 50);

    doc.text("Bill To:", 20, 60);
    doc.text(order.customer?.name ?? "Guest", 20, 65);
    doc.text(order.customer?.email ?? "", 20, 70);

    const tableBody = order.items.map((item) => [
        item.variant?.sku ?? "",
        item.variant?.name ?? "Unknown",
        String(item.quantity),
        `$${item.unitPrice.toFixed(2)}`,
        `$${item.lineTotal.toFixed(2)}`,
    ]);

    doc.autoTable({
        startY: 80,
        head: [["SKU", "Item", "Qty", "Unit Price", "Total"]],
        body: tableBody,
        theme: "striped",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [45, 45, 45] },
    });

    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
    doc.text(`Subtotal: $${order.subtotal.toFixed(2)}`, pageWidth - 20, finalY, { align: "right" });
    doc.text(`Shipping: $${order.shippingCost.toFixed(2)}`, pageWidth - 20, finalY + 5, { align: "right" });
    if (order.discountAmount > 0) {
        doc.text(`Discount: -$${order.discountAmount.toFixed(2)}`, pageWidth - 20, finalY + 10, { align: "right" });
    }
    doc.text(`Tax: $${order.taxAmount.toFixed(2)}`, pageWidth - 20, finalY + 15, { align: "right" });
    doc.setFontSize(12);
    doc.text(`Total: $${order.total.toFixed(2)}`, pageWidth - 20, finalY + 25, { align: "right" });

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
    return new NextResponse(pdfBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=invoice-${id}.pdf`,
        },
    });
}, "orders", "view");
