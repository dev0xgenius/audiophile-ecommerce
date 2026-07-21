import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";
import { z } from "zod";

const refundQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(20),
    paymentId: z.string().optional(),
    status: z.string().optional(),
});

export const GET = withPermission(async (request: NextRequest) => {
    const { searchParams } = request.nextUrl;
    const query = refundQuerySchema.parse(Object.fromEntries(searchParams));

    const where: Record<string, unknown> = {};
    if (query.paymentId) where.paymentId = query.paymentId;
    if (query.status) where.status = query.status;

    const [refunds, total] = await Promise.all([
        prisma.refund.findMany({
            where,
            include: {
                payment: { select: { id: true, amount: true, provider: true } },
                initiator: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "desc" },
            skip: (query.page - 1) * query.pageSize,
            take: query.pageSize,
        }),
        prisma.refund.count({ where }),
    ]);

    return NextResponse.json({
        data: refunds,
        meta: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) },
    });
}, "payments", "view");
