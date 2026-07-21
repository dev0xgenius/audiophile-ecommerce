import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";

export const GET = withPermission(async () => {
    const [lowStock, pendingPayments, unfulfilled, recentWebhookErrors] = await Promise.all([
        prisma.product.findMany({
            where: { status: "active" },
            select: { id: true, name: true },
            take: 10,
        }),
        prisma.order.findMany({
            where: { status: "pending_payment" },
            select: { id: true, total: true, createdAt: true },
            orderBy: { createdAt: "desc" },
            take: 5,
        }),
        prisma.order.findMany({
            where: {
                status: { in: ["paid", "processing"] },
                createdAt: { lte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
            },
            select: { id: true, status: true, total: true, createdAt: true },
            orderBy: { createdAt: "asc" },
            take: 5,
        }),
        prisma.webhookEvent.findMany({
            where: { status: "failed" },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: { id: true, eventType: true, errorMessage: true, createdAt: true },
        }),
    ]);

    return NextResponse.json({
        data: {
            lowStockCount: lowStock.length,
            pendingPaymentCount: pendingPayments.length,
            unfulfilledCount: unfulfilled.length,
            webhookErrorCount: recentWebhookErrors.length,
            items: [
                ...lowStock.map((p) => ({
                    type: "low_stock" as const,
                    label: `${p.name} is low on stock`,
                    link: `/dashboard/products?id=${p.id}`,
                })),
                ...pendingPayments.map((o) => ({
                    type: "pending_payment" as const,
                    label: `Order #${o.id.slice(-6)} — $${o.total.toLocaleString()} unpaid`,
                    link: `/dashboard/orders?id=${o.id}`,
                })),
                ...unfulfilled.map((o) => ({
                    type: "unfulfilled" as const,
                    label: `Order #${o.id.slice(-6)} stuck in ${o.status}`,
                    link: `/dashboard/orders?id=${o.id}`,
                })),
                ...recentWebhookErrors.map((w) => ({
                    type: "webhook_error" as const,
                    label: `Webhook ${w.eventType} failed: ${w.errorMessage ?? "unknown"}`,
                    link: "#",
                })),
            ].slice(0, 10),
        },
    });
}, "orders", "view");
