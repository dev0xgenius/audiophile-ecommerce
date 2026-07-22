import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";
import { isValidTransition } from "@/lib/validations/order";
import { z } from "zod";
import type { OrderStatus } from "@/generated/prisma/client";

const batchSchema = z.object({
    orderIds: z.array(z.string().min(1)).min(1),
    action: z.enum(["status", "refund"]),
    status: z.string().optional(),
});

export const PUT = withPermission(async (request: NextRequest, context) => {
    const body = await request.json();
    const data = batchSchema.parse(body);

    if (data.action === "status" && data.status) {
        const results: { orderId: string; status: string; error?: string }[] = [];

        for (const orderId of data.orderIds) {
            try {
                const order = await prisma.order.findUnique({ where: { id: orderId } });
                if (!order) {
                    results.push({ orderId, status: "error", error: "Not found" });
                    continue;
                }
                if (!isValidTransition(order.status, data.status)) {
                    results.push({ orderId, status: "error", error: `Invalid transition from ${order.status} to ${data.status}` });
                    continue;
                }

                await prisma.$transaction([
                    prisma.order.update({ where: { id: orderId }, data: { status: data.status as OrderStatus } }),
                    prisma.orderStatusHistory.create({
                        data: { orderId, fromStatus: order.status, toStatus: data.status, actorId: context.userId, note: "Bulk update" },
                    }),
                    prisma.auditLogEntry.create({
                        data: { actorId: context.userId, action: "order.bulk_status_change", entityType: "order", entityId: orderId, before: { status: order.status }, after: { status: data.status } },
                    }),
                ]);

                results.push({ orderId, status: data.status });
            } catch (e) {
                results.push({ orderId, status: "error", error: (e as Error).message });
            }
        }

        return NextResponse.json({ data: results });
    }

    if (data.action === "refund") {
        const results: { orderId: string; status: string; error?: string }[] = [];

        for (const orderId of data.orderIds) {
            try {
                // Find a successful payment
                const payment = await prisma.payment.findFirst({
                    where: { orderId, status: { in: ["succeeded", "paid"] } },
                });
                if (!payment) {
                    results.push({ orderId, status: "error", error: "No successful payment" });
                    continue;
                }

                // Create refund via processRefund
                const { processRefund } = await import("@/lib/services/payment");
                await processRefund(payment.id, undefined, "Bulk refund", context.userId);

                await prisma.auditLogEntry.create({
                    data: { actorId: context.userId, action: "order.bulk_refund", entityType: "order", entityId: orderId },
                });

                results.push({ orderId, status: "refunded" });
            } catch (e) {
                results.push({ orderId, status: "error", error: (e as Error).message });
            }
        }

        return NextResponse.json({ data: results });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}, "orders", "edit");
