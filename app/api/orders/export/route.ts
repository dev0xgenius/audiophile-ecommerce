import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";
import { orderQuerySchema } from "@/lib/validations/order";
import type { Prisma } from "@/generated/prisma/client";

export const GET = withPermission(async (request: NextRequest) => {
    const { searchParams } = request.nextUrl;
    const format = searchParams.get("format") ?? "csv";
    const params = orderQuerySchema.parse(Object.fromEntries(searchParams));

    const where: Prisma.OrderWhereInput = {};
    if (params.status) where.status = params.status;
    if (params.search) {
        where.OR = [{ id: { contains: params.search, mode: "insensitive" } }];
    }
    if (params.dateFrom || params.dateTo) {
        where.createdAt = {};
        if (params.dateFrom) where.createdAt.gte = new Date(params.dateFrom);
        if (params.dateTo) where.createdAt.lte = new Date(params.dateTo);
    }

    const orders = await prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            customer: { select: { name: true, email: true } },
            items: { include: { variant: { select: { name: true, sku: true } } } },
        },
    });

    if (format === "csv") {
        const header = "Order ID,Customer,Email,Status,Items,Total,Date\n";
        const rows = orders.map((o) => {
            const itemNames = o.items.map((i) => `${i.variant?.name ?? "Unknown"} x${i.quantity}`).join("; ");
            return `${o.id},"${o.customer?.name ?? "Guest"}","${o.customer?.email ?? ""}",${o.status},"${itemNames}",${o.total},${o.createdAt.toISOString().slice(0, 10)}`;
        }).join("\n");

        return new NextResponse(header + rows, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": "attachment; filename=orders-export.csv",
            },
        });
    }

    return NextResponse.json({ error: "Unsupported format", code: "INVALID_FORMAT" }, { status: 400 });
}, "orders", "view");
