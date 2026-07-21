import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";
import { dateRangeSchema } from "@/lib/validations/analytics";

export const GET = withPermission(async (request: NextRequest) => {
    const { searchParams } = request.nextUrl;
    const params = dateRangeSchema.parse(Object.fromEntries(searchParams));

    const now = new Date();
    let dateFrom: Date;
    let dateTo = new Date(now);
    dateTo.setHours(23, 59, 59, 999);

    if (params.period === "today") {
        dateFrom = new Date(now);
        dateFrom.setHours(0, 0, 0, 0);
    } else if (params.period === "7d") {
        dateFrom = new Date(now);
        dateFrom.setDate(dateFrom.getDate() - 6);
        dateFrom.setHours(0, 0, 0, 0);
    } else if (params.period === "30d") {
        dateFrom = new Date(now);
        dateFrom.setDate(dateFrom.getDate() - 29);
        dateFrom.setHours(0, 0, 0, 0);
    } else if (params.period === "90d") {
        dateFrom = new Date(now);
        dateFrom.setDate(dateFrom.getDate() - 89);
        dateFrom.setHours(0, 0, 0, 0);
    } else {
        dateFrom = params.dateFrom ? new Date(params.dateFrom) : new Date(now);
        dateTo = params.dateTo ? new Date(params.dateTo) : dateTo;
        if (isNaN(dateFrom.getTime())) dateFrom = new Date(now);
        if (isNaN(dateTo.getTime())) dateTo = new Date(now);
    }

    const daysDiff = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const periodStart = new Date(dateFrom);
    periodStart.setHours(0, 0, 0, 0);
    const periodEnd = new Date(dateTo);
    periodEnd.setHours(23, 59, 59, 999);

    const prevStart = new Date(periodStart);
    prevStart.setDate(prevStart.getDate() - daysDiff);
    const prevEnd = new Date(periodStart);
    prevEnd.setDate(prevEnd.getDate() - 1);
    prevEnd.setHours(23, 59, 59, 999);

    const [currentOrders, previousOrders] = await Promise.all([
        prisma.order.findMany({
            where: {
                createdAt: { gte: periodStart, lte: periodEnd },
                NOT: { status: { in: ["cancelled", "refunded"] } },
            },
            select: { total: true, createdAt: true },
        }),
        prisma.order.findMany({
            where: {
                createdAt: { gte: prevStart, lte: prevEnd },
                NOT: { status: { in: ["cancelled", "refunded"] } },
            },
            select: { total: true, createdAt: true },
        }),
    ]);

    function groupByDay(orders: { total: number; createdAt: Date }[], start: Date, end: Date) {
        const map = new Map<string, number>();
        const cursor = new Date(start);
        while (cursor <= end) {
            map.set(cursor.toISOString().slice(0, 10), 0);
            cursor.setDate(cursor.getDate() + 1);
        }
        for (const o of orders) {
            const key = o.createdAt.toISOString().slice(0, 10);
            map.set(key, (map.get(key) ?? 0) + o.total);
        }
        return Array.from(map.entries()).map(([date, revenue]) => ({ date, revenue }));
    }

    const revenue = groupByDay(currentOrders, periodStart, periodEnd);
    const previousRevenue = groupByDay(previousOrders, prevStart, prevEnd);

    const currentTotal = currentOrders.reduce((s, o) => s + o.total, 0);
    const previousTotal = previousOrders.reduce((s, o) => s + o.total, 0);
    const change = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : null;

    return NextResponse.json({
        data: { revenue, previousRevenue, total: currentTotal, previousTotal, change },
    });
}, "orders", "view");
