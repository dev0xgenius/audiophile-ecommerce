import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";
import { z } from "zod";

const returnQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(20),
    orderId: z.string().optional(),
    status: z.string().optional(),
});

const createReturnSchema = z.object({
    orderId: z.string().min(1),
    reason: z.string().min(1),
    refundAmount: z.number().min(0).default(0),
});

export const GET = withPermission(async (request: NextRequest) => {
    const { searchParams } = request.nextUrl;
    const query = returnQuerySchema.parse(Object.fromEntries(searchParams));

    const where: Record<string, unknown> = {};
    if (query.orderId) where.orderId = query.orderId;
    if (query.status) where.status = query.status;

    const [returns, total] = await Promise.all([
        prisma.return.findMany({
            where,
            include: {
                order: { select: { id: true, status: true, total: true } },
                actor: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "desc" },
            skip: (query.page - 1) * query.pageSize,
            take: query.pageSize,
        }),
        prisma.return.count({ where }),
    ]);

    return NextResponse.json({
        data: returns,
        meta: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) },
    });
}, "orders", "view");

export const POST = withPermission(async (request: NextRequest, context) => {
    const body = await request.json();
    const data = createReturnSchema.parse(body);

    const order = await prisma.order.findUnique({ where: { id: data.orderId } });
    if (!order) {
        return NextResponse.json({ error: "Order not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const ret = await prisma.return.create({
        data: {
            orderId: data.orderId,
            reason: data.reason,
            refundAmount: data.refundAmount,
            status: "requested",
            actorId: context.userId,
        },
    });

    await prisma.auditLogEntry.create({
        data: {
            actorId: context.userId,
            action: "return.create",
            entityType: "return",
            entityId: ret.id,
            after: { orderId: data.orderId, reason: data.reason, refundAmount: data.refundAmount },
        },
    });

    return NextResponse.json({ data: ret }, { status: 201 });
}, "orders", "edit");
