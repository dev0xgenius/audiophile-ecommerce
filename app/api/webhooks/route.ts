import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { webhookQuerySchema } from "@/lib/validations/webhook";
import { withPermission } from "@/lib/auth/permissions";

export const GET = withPermission(async (request: NextRequest) => {
    const { searchParams } = request.nextUrl;
    const params = webhookQuerySchema.parse(Object.fromEntries(searchParams));

    const where: Record<string, unknown> = {};

    if (params.status) where.status = params.status;
    if (params.provider) where.provider = params.provider;

    if (params.dateFrom || params.dateTo) {
        where.createdAt = {};
        if (params.dateFrom) (where.createdAt as Record<string, Date>).gte = new Date(params.dateFrom);
        if (params.dateTo) (where.createdAt as Record<string, Date>).lte = new Date(params.dateTo);
    }

    const [events, total] = await Promise.all([
        prisma.webhookEvent.findMany({
            where,
            orderBy: { [params.sortBy]: params.sortOrder },
            skip: (params.page - 1) * params.pageSize,
            take: params.pageSize,
        }),
        prisma.webhookEvent.count({ where }),
    ]);

    return NextResponse.json({
        data: events,
        meta: {
            page: params.page,
            pageSize: params.pageSize,
            total,
            totalPages: Math.ceil(total / params.pageSize),
        },
    });
}, "payments", "view");
