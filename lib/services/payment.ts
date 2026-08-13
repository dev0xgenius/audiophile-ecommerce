import { prisma } from "@/lib/prisma";
import { createAdapter } from "@/lib/psp/factory";
import type { PaymentIntentRequest, RefundRequest } from "@/lib/psp/types";
import type { Prisma } from "@/generated/prisma/client";

export async function selectPSP(currency = "USD", region?: string) {
    const connections = await prisma.pSPConnection.findMany({
        where: { isEnabled: true },
        orderBy: { priorityOrder: "asc" },
    });

    const matchCurrency = (c: typeof connections[0]) =>
        c.restrictedCurrencies.length === 0 || c.restrictedCurrencies.includes(currency);

    const matchRegion = (c: typeof connections[0]) =>
        !region || c.restrictedRegions.length === 0 || c.restrictedRegions.includes(region);

    return (
        connections.find((c) => matchCurrency(c) && matchRegion(c) && c.isDefault) ??
        connections.find((c) => matchCurrency(c) && matchRegion(c)) ??
        connections.find((c) => matchCurrency(c)) ??
        connections[0] ??
        null
    );
}

export async function createPayment(orderId: string, pspConnectionId: string, callbackUrl?: string) {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { customer: true, items: true },
    });

    if (!order) throw new Error("Order not found");

    const psp = await prisma.pSPConnection.findUnique({ where: { id: pspConnectionId } });
    if (!psp) throw new Error("PSP connection not found");

    const adapter = createAdapter(psp.provider, JSON.stringify(psp.credentials));

    const intentReq: PaymentIntentRequest = {
        amount: order.total,
        currency: order.currency,
        description: `Order #${order.id.slice(-8)}`,
        metadata: { orderId: order.id },
        customerEmail: order.customer?.email ?? undefined,
        callbackUrl,
    };

    const intent = await adapter.createPaymentIntent(intentReq);

    const payment = await prisma.payment.create({
        data: {
            orderId,
            pspConnectionId,
            provider: psp.provider,
            pspPaymentIntentId: intent.pspPaymentIntentId,
            amount: order.total,
            currency: order.currency,
            status: "pending",
            metadata: { accessCode: intent.clientSecret } as Prisma.InputJsonValue,
        },
    });

    return { payment, authorizationUrl: intent.clientSecret, reference: intent.pspPaymentIntentId };
}

export async function processRefund(
    paymentId: string,
    amount?: number,
    reason?: string,
    initiatedById?: string
) {
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { psp: true },
    });

    if (!payment) throw new Error("Payment not found");
    if (!payment.psp) throw new Error("PSP connection not found");

    const adapter = createAdapter(payment.psp.provider, JSON.stringify(payment.psp.credentials));

    const refundReq: RefundRequest = {
        pspPaymentIntentId: payment.pspPaymentIntentId!,
        amount: amount ?? payment.amount,
        reason,
    };

    const refundResult = await adapter.refundPayment(refundReq);

    const refund = await prisma.refund.create({
        data: {
            paymentId,
            pspRefundId: refundResult.pspRefundId,
            amount: amount ?? payment.amount,
            currency: payment.currency,
            reason,
            status: refundResult.status === "success" ? "succeeded" : "pending",
            initiatedById,
        },
    });

    await prisma.payment.update({
        where: { id: paymentId },
        data: { status: amount && amount < payment.amount ? "partially_refunded" : "refunded" },
    });

    return refund;
}
