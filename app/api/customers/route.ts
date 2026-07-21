import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { customerQuerySchema } from "@/lib/validations/customer";
import { withPermission } from "@/lib/auth/permissions";

export const GET = withPermission(async (request: NextRequest) => {
    const { searchParams } = request.nextUrl;
    const params = customerQuerySchema.parse(Object.fromEntries(searchParams));

    const where: Record<string, unknown> = {};

    if (params.search) {
        where.OR = [
            { name: { contains: params.search, mode: "insensitive" } },
            { email: { contains: params.search, mode: "insensitive" } },
        ];
    }

    const [customers, total] = await Promise.all([
        prisma.customer.findMany({
            where,
            include: {
                _count: { select: { orders: true } },
                orders: {
                    select: { total: true },
                },
            },
            orderBy: { [params.sortBy]: params.sortOrder },
            skip: (params.page - 1) * params.pageSize,
            take: params.pageSize,
        }),
        prisma.customer.count({ where }),
    ]);

    const data = customers.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        flags: c.flags,
        orderCount: c._count.orders,
        totalSpent: c.orders.reduce((sum, o) => sum + o.total, 0),
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
    }));

    return NextResponse.json({
        data,
        meta: {
            page: params.page,
            pageSize: params.pageSize,
            total,
            totalPages: Math.ceil(total / params.pageSize),
        },
    });
}, "customers", "view");
