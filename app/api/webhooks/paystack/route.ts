import { NextRequest, NextResponse } from "next/server";
import type { WebhookEvent } from "@/lib/psp/types";

async function processEvent(
    event: WebhookEvent,
    signature: string,
    _payload: string
) {
    const { prisma } = await import("@/lib/prisma");
    const { reserveStock, releaseStock } = await import("@/lib/services/stock");
    const { sendOrderConfirmationEmail } = await import("@/lib/mail");

    // Idempotency: check if this event was already processed
    const existing = await prisma.webhookEvent.findFirst({
        where: { pspEventId: event.pspEventId, status: "processed" },
    });
    if (existing) return { handled: true, skipped: true };

    // Create the webhook event record
    const webhookRecord = await prisma.webhookEvent.create({
        data: {
            provider: event.provider,
            pspEventId: event.pspEventId,
            eventType: event.type,
            rawBody: JSON.parse(JSON.stringify(event.raw)),
            headers: { "x-paystack-signature": signature },
            status: "received",
        },
    });

    const data = event.raw.data as Record<string, unknown> | undefined;
    const metadata = data?.metadata as Record<string, unknown> | undefined;
    const orderId = metadata?.orderId as string | undefined;

    if (!orderId) {
        await prisma.webhookEvent.update({
            where: { id: webhookRecord.id },
            data: { status: "failed", errorMessage: "No orderId in webhook metadata" },
        });
        return { handled: false, error: "No orderId in metadata" };
    }

    try {
        if (event.type === "charge.success") {
            const reference = data?.reference as string | undefined;

            // Update order status
            await prisma.order.update({
                where: { id: orderId },
                data: { status: "paid" },
            });

            // Create or update payment record
            const existingPayment = await prisma.payment.findFirst({
                where: { orderId, pspPaymentIntentId: reference },
            });

            if (!existingPayment) {
                const order = await prisma.order.findUnique({
                    where: { id: orderId },
                    select: { total: true, currency: true },
                });

                await prisma.payment.create({
                    data: {
                        orderId,
                        provider: event.provider,
                        pspPaymentIntentId: reference ?? event.pspEventId,
                        amount: order?.total ?? 0,
                        currency: order?.currency ?? "USD",
                        status: "succeeded",
                    },
                });
            } else {
                await prisma.payment.update({
                    where: { id: existingPayment.id },
                    data: { status: "succeeded" },
                });
            }

            // Reserve stock
            await reserveStock(orderId);

            // Log status history
            await prisma.orderStatusHistory.create({
                data: {
                    orderId,
                    fromStatus: "pending_payment",
                    toStatus: "paid",
                    note: "Payment confirmed via Paystack webhook",
                },
            });

            // Send confirmation email
            const orderForEmail = await prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    customer: true,
                    items: { include: { variant: true } },
                },
            });

            if (orderForEmail?.customer?.email) {
                sendOrderConfirmationEmail({
                    email: orderForEmail.customer.email,
                    orderId: orderForEmail.id,
                    customerName: orderForEmail.customer.name,
                    items: orderForEmail.items.map((item) => ({
                        name: item.variant?.name ?? "Unknown",
                        quantity: item.quantity,
                        price: item.unitPrice,
                    })),
                    total: orderForEmail.total,
                });
            }
        } else if (event.type === "charge.failed") {
            // Update order status
            await prisma.order.update({
                where: { id: orderId },
                data: { status: "cancelled" },
            });

            // Release stock
            await releaseStock(orderId);

            // Log status history
            await prisma.orderStatusHistory.create({
                data: {
                    orderId,
                    fromStatus: "pending_payment",
                    toStatus: "cancelled",
                    note: "Payment failed via Paystack webhook",
                },
            });
        }

        // Mark webhook as processed
        await prisma.webhookEvent.update({
            where: { id: webhookRecord.id },
            data: { status: "processed", processedAt: new Date() },
        });

        return { handled: true };
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        await prisma.webhookEvent.update({
            where: { id: webhookRecord.id },
            data: { status: "failed", errorMessage },
        });
        return { handled: false, error: errorMessage };
    }
}

export const POST = async (request: NextRequest) => {
    const signature = request.headers.get("x-paystack-signature");
    if (!signature) {
        return NextResponse.json(
            { error: "Missing x-paystack-signature header" },
            { status: 400 },
        );
    }

    const payload = await request.text();

    try {
        const { PaystackAdapter } = await import("@/lib/psp/paystack");
        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) throw new Error("PAYSTACK_SECRET_KEY is not set");

        const adapter = new PaystackAdapter(secretKey);
        const event = await adapter.parseWebhook(payload, signature);

        const result = await processEvent(event, signature, payload);

        return NextResponse.json(result);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Webhook processing failed";
        return NextResponse.json(
            { error: message },
            { status: 400 },
        );
    }
};
