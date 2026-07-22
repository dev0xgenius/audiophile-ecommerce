import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";
import { processRefund } from "@/lib/services/payment";
import { z } from "zod";

function getId(request: NextRequest): string {
    const segments = request.nextUrl.pathname.split("/orders/")[1]?.split("/")[0] ?? "";
    return segments;
}

const refundOrderSchema = z.object({
    amount: z.number().min(0.01).optional(),
    reason: z.string().optional(),
});

export const POST = withPermission(async (request: NextRequest, context) => {
    const orderId = getId(request);
    const body = await request.json();
    const data = refundOrderSchema.parse(body);

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { payments: { where: { status: "succeeded" }, take: 1 } },
    });

    if (!order) {
        return NextResponse.json({ error: "Order not found", code: "NOT_FOUND" }, { status: 404 });
    }

    if (order.status === "refunded" || order.status === "cancelled") {
        return NextResponse.json({ error: "Order cannot be refunded", code: "INVALID_STATE" }, { status: 400 });
    }

    const payment = order.payments[0];
    if (!payment) {
        return NextResponse.json({ error: "No successful payment found for this order", code: "NO_PAYMENT" }, { status: 400 });
    }

    const refund = await processRefund(payment.id, data.amount, data.reason, context.userId);

    await prisma.order.update({
        where: { id: orderId },
        data: { status: data.amount && data.amount < payment.amount ? "partially_refunded" : "refunded" },
    });

    await prisma.auditLogEntry.create({
        data: {
            actorId: context.userId,
            action: "order.refund",
            entityType: "order",
            entityId: orderId,
            after: { refundId: refund.id, amount: data.amount ?? payment.amount, reason: data.reason },
        },
    });

    return NextResponse.json({ data: refund }, { status: 201 });
}, "orders", "edit");
