import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";
import { createBundleSchema, bundleQuerySchema } from "@/lib/validations/bundle";

export const GET = withPermission(async (request: NextRequest) => {
    const { searchParams } = request.nextUrl;
    const params = bundleQuerySchema.parse(Object.fromEntries(searchParams));

    const [bundles, total] = await Promise.all([
        prisma.bundle.findMany({
            skip: (params.page - 1) * params.pageSize,
            take: params.pageSize,
            orderBy: { [params.sortBy]: params.sortOrder },
            include: {
                product: { select: { id: true, name: true } },
                component: { select: { id: true, name: true, sku: true } },
            },
        }),
        prisma.bundle.count(),
    ]);

    return NextResponse.json({ data: bundles, total, page: params.page, pageSize: params.pageSize });
}, "products", "view");

export const POST = withPermission(async (request: NextRequest, context) => {
    const body = await request.json();
    const data = createBundleSchema.parse(body);

    const existing = await prisma.bundle.findUnique({
        where: { productId_componentVariantId: { productId: data.productId, componentVariantId: data.componentVariantId } },
    });
    if (existing) {
        return NextResponse.json(
            { error: "This product+variant bundle already exists", code: "DUPLICATE_BUNDLE" },
            { status: 409 },
        );
    }

    const bundle = await prisma.bundle.create({ data });

    await prisma.auditLogEntry.create({
        data: {
            action: "bundle.create",
            entityType: "Bundle",
            entityId: bundle.id,
            actorId: context.userId,
        },
    });

    return NextResponse.json({ data: bundle }, { status: 201 });
}, "products", "create");
