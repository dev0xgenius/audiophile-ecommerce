import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProductSchema, productQuerySchema } from "@/lib/validations/product";
import { withPermission } from "@/lib/auth/permissions";

export const GET = withPermission(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const query = productQuerySchema.parse(Object.fromEntries(searchParams));

    const where: Record<string, unknown> = {};

    if (query.search) {
        where.OR = [
            { name: { contains: query.search, mode: "insensitive" } },
            { sku: { contains: query.search, mode: "insensitive" } },
            { brand: { contains: query.search, mode: "insensitive" } },
        ];
    }

    if (query.status) where.status = query.status;
    if (query.categoryId) where.categoryId = query.categoryId;

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: {
                category: { select: { id: true, name: true, slug: true } },
                variants: { select: { id: true, sku: true, name: true, stock: true, priceDelta: true } },
                media: { where: { isPrimary: true }, include: { mediaAsset: { select: { url: true, altText: true } } } },
            },
            orderBy: { [query.sortBy]: query.sortOrder },
            skip: (query.page - 1) * query.pageSize,
            take: query.pageSize,
        }),
        prisma.product.count({ where }),
    ]);

    return NextResponse.json({
        data: products,
        pagination: {
            page: query.page,
            pageSize: query.pageSize,
            total,
            totalPages: Math.ceil(total / query.pageSize),
        },
    });
}, "products", "view");

export const POST = withPermission(async (request: NextRequest, context) => {
    const body = await request.json();
    const data = createProductSchema.parse(body);

    const product = await prisma.product.create({
        data: {
            name: data.name,
            slug: data.slug,
            sku: data.sku,
            brand: data.brand,
            description: data.description,
            specifications: JSON.parse(JSON.stringify(data.specifications ?? null)),
            basePrice: data.basePrice,
            costPrice: data.costPrice,
            taxClass: data.taxClass,
            weight: data.weight,
            dimensions: JSON.parse(JSON.stringify(data.dimensions ?? null)),
            status: data.status,
            categoryId: data.categoryId,
            supplierId: data.supplierId,
        },
        include: {
            category: { select: { id: true, name: true, slug: true } },
            variants: true,
        },
    });

    await prisma.auditLogEntry.create({
        data: {
            actorId: context.userId,
            action: "product.create",
            entityType: "product",
            entityId: product.id,
            after: { name: product.name, slug: product.slug, status: product.status },
        },
    });

    return NextResponse.json({ data: product }, { status: 201 });
}, "products", "create");
