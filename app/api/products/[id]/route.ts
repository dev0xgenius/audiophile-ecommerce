import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateProductSchema } from "@/lib/validations/product";
import { withPermission } from "@/lib/auth/permissions";

function getId(request: NextRequest) {
    const segments = request.nextUrl.pathname.split("/");
    return segments[segments.length - 1];
}

export const GET = withPermission(async (request: NextRequest, _context) => {
    const id = getId(request);

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: { select: { id: true, name: true, slug: true } },
            supplier: { select: { id: true, name: true } },
            variants: true,
            media: { include: { mediaAsset: true }, orderBy: { displayOrder: "asc" } },
        },
    });

    if (!product) {
        return NextResponse.json(
            { error: "Product not found", code: "NOT_FOUND" },
            { status: 404 },
        );
    }

    return NextResponse.json({ data: product });
}, "products", "view");

export const PUT = withPermission(async (request: NextRequest, context) => {
    const id = getId(request);
    const body = await request.json();
    const data = updateProductSchema.parse(body);

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
        return NextResponse.json(
            { error: "Product not found", code: "NOT_FOUND" },
            { status: 404 },
        );
    }

    const product = await prisma.product.update({
        where: { id },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.slug !== undefined && { slug: data.slug }),
            ...(data.sku !== undefined && { sku: data.sku }),
            ...(data.brand !== undefined && { brand: data.brand }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.specifications !== undefined && { specifications: JSON.parse(JSON.stringify(data.specifications)) }),
            ...(data.basePrice !== undefined && { basePrice: data.basePrice }),
            ...(data.costPrice !== undefined && { costPrice: data.costPrice }),
            ...(data.taxClass !== undefined && { taxClass: data.taxClass }),
            ...(data.weight !== undefined && { weight: data.weight }),
            ...(data.dimensions !== undefined && { dimensions: JSON.parse(JSON.stringify(data.dimensions)) }),
            ...(data.status !== undefined && { status: data.status }),
            ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
            ...(data.supplierId !== undefined && { supplierId: data.supplierId }),
        },
        include: {
            category: { select: { id: true, name: true, slug: true } },
            variants: true,
        },
    });

    await prisma.auditLogEntry.create({
        data: {
            actorId: context.userId,
            action: "product.update",
            entityType: "product",
            entityId: id,
            before: { name: existing.name, status: existing.status },
            after: { name: product.name, status: product.status },
        },
    });

    return NextResponse.json({ data: product });
}, "products", "edit");

export const DELETE = withPermission(async (request: NextRequest, context) => {
    const id = getId(request);

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
        return NextResponse.json(
            { error: "Product not found", code: "NOT_FOUND" },
            { status: 404 },
        );
    }

    await prisma.product.update({
        where: { id },
        data: { status: "archived" },
    });

    await prisma.auditLogEntry.create({
        data: {
            actorId: context.userId,
            action: "product.archive",
            entityType: "product",
            entityId: id,
            before: { status: existing.status },
            after: { status: "archived" },
        },
    });

    return NextResponse.json({ data: { id, status: "archived" } });
}, "products", "delete");
