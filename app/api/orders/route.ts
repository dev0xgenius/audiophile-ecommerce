import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderQuerySchema } from "@/lib/validations/order";
import { withPermission } from "@/lib/auth/permissions";
import type { Prisma } from "@/generated/prisma/client";

export const GET = withPermission(async (request: NextRequest) => {
    const { searchParams } = request.nextUrl;
    const params = orderQuerySchema.parse(Object.fromEntries(searchParams));

    const where: Prisma.OrderWhereInput = {};

    if (params.search) {
        where.OR = [
            { id: { contains: params.search, mode: "insensitive" } },
        ];
    }

    if (params.status) {
        where.status = params.status;
    }

    if (params.customerId) {
        where.customerId = params.customerId;
    }

    if (params.dateFrom || params.dateTo) {
        where.createdAt = {};
        if (params.dateFrom) where.createdAt.gte = new Date(params.dateFrom);
        if (params.dateTo) where.createdAt.lte = new Date(params.dateTo);
    }

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            include: {
                customer: {
                    select: { id: true, name: true, email: true },
                },
                items: {
                    include: {
                        variant: {
                            select: { id: true, name: true, sku: true },
                        },
                    },
                },
                payments: {
                    select: { id: true, status: true, amount: true, provider: true },
                },
            },
            orderBy: { [params.sortBy]: params.sortOrder },
            skip: (params.page - 1) * params.pageSize,
            take: params.pageSize,
        }),
        prisma.order.count({ where }),
    ]);

    return NextResponse.json({
        data: orders,
        meta: {
            page: params.page,
            pageSize: params.pageSize,
            total,
            totalPages: Math.ceil(total / params.pageSize),
        },
    });
}, "orders", "view");
