import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createVariantSchema, variantQuerySchema } from "@/lib/validations/product";
import { withPermission } from "@/lib/auth/permissions";

function getId(request: NextRequest): string {
    const match = request.nextUrl.pathname.match(/\/products\/([^/]+)\/variants/);
    return match?.[1] ?? "";
}

export const GET = withPermission(async (request: NextRequest) => {
    const productId = getId(request);
    const { searchParams } = request.nextUrl;
    const query = variantQuerySchema.parse(Object.fromEntries(searchParams));

    const where: Record<string, unknown> = { productId };
    if (query.search) {
        where.OR = [
            { name: { contains: query.search, mode: "insensitive" } },
            { sku: { contains: query.search, mode: "insensitive" } },
        ];
    }

    const [variants, total] = await Promise.all([
        prisma.productVariant.findMany({
            where,
            orderBy: { [query.sortBy]: query.sortOrder },
            skip: (query.page - 1) * query.pageSize,
            take: query.pageSize,
        }),
        prisma.productVariant.count({ where }),
    ]);

    return NextResponse.json({
        data: variants,
        meta: {
            page: query.page,
            pageSize: query.pageSize,
            total,
            totalPages: Math.ceil(total / query.pageSize),
        },
    });
}, "products", "view");

export const POST = withPermission(async (request: NextRequest, context) => {
    const productId = getId(request);
    const body = await request.json();
    const data = createVariantSchema.parse({ ...body, productId });

    const variant = await prisma.productVariant.create({
        data: {
            productId: data.productId,
            sku: data.sku,
            name: data.name,
            priceDelta: data.priceDelta,
            stock: data.stock,
            lowStockThreshold: data.lowStockThreshold,
            weightDelta: data.weightDelta,
            isActive: data.isActive,
        },
    });

    await prisma.auditLogEntry.create({
        data: {
            actorId: context.userId,
            action: "variant.create",
            entityType: "ProductVariant",
            entityId: variant.id,
            after: JSON.parse(JSON.stringify(variant)),
        },
    });

    return NextResponse.json({ data: variant }, { status: 201 });
}, "products", "create");
