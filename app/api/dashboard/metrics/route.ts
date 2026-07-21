import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";

export const GET = withPermission(async () => {
    const [orders, products, customers] = await Promise.all([
        prisma.order.findMany({
            select: { id: true, status: true, total: true, createdAt: true },
            take: 1000,
        }),
        prisma.product.count({ where: { status: "active" } }),
        prisma.customer.count(),
    ]);

    const totalRevenue = orders
        .filter((o) => o.status !== "cancelled" && o.status !== "refunded")
        .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter(
        (o) => o.status === "pending_payment" || o.status === "paid" || o.status === "processing",
    ).length;

    const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            status: true,
            total: true,
            createdAt: true,
            customer: { select: { name: true } },
        },
    });

    return NextResponse.json({
        data: {
            totalRevenue,
            orderCount: orders.length,
            pendingOrders,
            activeProducts: products,
            customerCount: customers,
            recentOrders: recentOrders.map((o) => ({
                id: o.id,
                orderNumber: parseInt(o.id.slice(-4), 16) || 1000,
                customerName: o.customer?.name ?? "Guest",
                status: o.status,
                total: o.total,
                createdAt: o.createdAt,
            })),
        },
    });
}, "orders", "view");
