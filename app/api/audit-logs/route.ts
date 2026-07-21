import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";
import { z } from "zod";

const auditLogQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(20),
    entityType: z.string().optional(),
    entityId: z.string().optional(),
    action: z.string().optional(),
    actorId: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    search: z.string().optional(),
});

export const GET = withPermission(async (request: NextRequest) => {
    const { searchParams } = request.nextUrl;
    const query = auditLogQuerySchema.parse(Object.fromEntries(searchParams));

    const where: Record<string, unknown> = {};

    if (query.entityType) where.entityType = query.entityType;
    if (query.entityId) where.entityId = query.entityId;
    if (query.action) where.action = { contains: query.action, mode: "insensitive" };
    if (query.actorId) where.actorId = query.actorId;

    if (query.dateFrom || query.dateTo) {
        where.timestamp = {};
        if (query.dateFrom) (where.timestamp as Record<string, unknown>).gte = new Date(query.dateFrom);
        if (query.dateTo) (where.timestamp as Record<string, unknown>).lte = new Date(query.dateTo);
    }

    if (query.search) {
        where.OR = [
            { entityType: { contains: query.search, mode: "insensitive" } },
            { entityId: { contains: query.search, mode: "insensitive" } },
            { action: { contains: query.search, mode: "insensitive" } },
        ];
    }

    const [entries, total] = await Promise.all([
        prisma.auditLogEntry.findMany({
            where,
            include: {
                actor: { select: { id: true, name: true, email: true } },
            },
            orderBy: { timestamp: "desc" },
            skip: (query.page - 1) * query.pageSize,
            take: query.pageSize,
        }),
        prisma.auditLogEntry.count({ where }),
    ]);

    return NextResponse.json({
        data: entries,
        meta: {
            page: query.page,
            pageSize: query.pageSize,
            total,
            totalPages: Math.ceil(total / query.pageSize),
        },
    });
}, "audit", "view");
