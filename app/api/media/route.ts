import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mediaQuerySchema } from "@/lib/validations/media";
import { withPermission } from "@/lib/auth/permissions";

export const GET = withPermission(async (request: NextRequest) => {
    const { searchParams } = request.nextUrl;
    const params = mediaQuerySchema.parse(Object.fromEntries(searchParams));

    const where: Record<string, unknown> = {};

    if (params.search) {
        where.filename = { contains: params.search, mode: "insensitive" };
    }

    if (params.tag) {
        where.tags = { has: params.tag };
    }

    if (params.folder) {
        where.folder = params.folder;
    }

    if (params.dateFrom || params.dateTo) {
        where.createdAt = {};
        if (params.dateFrom) (where.createdAt as Record<string, Date>).gte = new Date(params.dateFrom);
        if (params.dateTo) (where.createdAt as Record<string, Date>).lte = new Date(params.dateTo);
    }

    const [assets, total] = await Promise.all([
        prisma.mediaAsset.findMany({
            where,
            include: {
                uploadedBy: { select: { id: true, name: true } },
            },
            orderBy: { [params.sortBy]: params.sortOrder },
            skip: (params.page - 1) * params.pageSize,
            take: params.pageSize,
        }),
        prisma.mediaAsset.count({ where }),
    ]);

    return NextResponse.json({
        data: assets,
        meta: {
            page: params.page,
            pageSize: params.pageSize,
            total,
            totalPages: Math.ceil(total / params.pageSize),
        },
    });
}, "gallery", "view");
