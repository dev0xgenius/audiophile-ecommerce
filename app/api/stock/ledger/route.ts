import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";

export const GET = withPermission(async (request: NextRequest) => {
    const { searchParams } = request.nextUrl;
    const variantId = searchParams.get("variantId");
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize")) || 20));

    if (!variantId) {
        return NextResponse.json(
            { error: "variantId query parameter is required", code: "MISSING_PARAM" },
            { status: 400 },
        );
    }

    const where = { variantId };

    const [entries, total] = await Promise.all([
        prisma.stockLedgerEntry.findMany({
            where,
            include: {
                actor: { select: { id: true, name: true } },
            },
            orderBy: { timestamp: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.stockLedgerEntry.count({ where }),
    ]);

    return NextResponse.json({
        data: entries,
        meta: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        },
    });
}, "inventory", "view");
