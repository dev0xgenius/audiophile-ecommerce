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
            customer: { select: { name: true, email: true } },
            items: {
                include: { variant: { select: { name: true, sku: true } } },
            },
        },
    });

    if (!order) {
        return NextResponse.json({ error: "Order not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(20);
    doc.text("PACKING SLIP", pageWidth / 2, 30, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Order #: ${order.id.slice(-8).toUpperCase()}`, 20, 45);
    doc.text(`Date: ${order.createdAt.toISOString().slice(0, 10)}`, 20, 50);
    doc.text(`Customer: ${order.customer?.name ?? "Guest"}`, 20, 55);

    const tableBody = order.items.map((item) => [
        item.variant?.sku ?? "",
        item.variant?.name ?? "Unknown",
        String(item.quantity),
    ]);

    doc.autoTable({
        startY: 70,
        head: [["SKU", "Item", "Qty"]],
        body: tableBody,
        theme: "striped",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [45, 45, 45] },
    });

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
    return new NextResponse(pdfBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=packing-slip-${id}.pdf`,
        },
    });
}, "orders", "view");
