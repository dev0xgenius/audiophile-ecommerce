import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";
import { createSupplierSchema, supplierQuerySchema } from "@/lib/validations/supplier";

export const GET = withPermission(async (request: NextRequest) => {
    const { searchParams } = request.nextUrl;
    const params = supplierQuerySchema.parse(Object.fromEntries(searchParams));

    const where: Record<string, unknown> = {};
    if (params.search) {
        where.OR = [
            { name: { contains: params.search, mode: "insensitive" } },
            { contactName: { contains: params.search, mode: "insensitive" } },
            { email: { contains: params.search, mode: "insensitive" } },
        ];
    }

    const [suppliers, total] = await Promise.all([
        prisma.supplier.findMany({
            where,
            skip: (params.page - 1) * params.pageSize,
            take: params.pageSize,
            orderBy: { [params.sortBy]: params.sortOrder },
            include: {
                _count: { select: { products: true } },
            },
        }),
        prisma.supplier.count({ where }),
    ]);

    return NextResponse.json({ data: suppliers, total, page: params.page, pageSize: params.pageSize });
}, "products", "view");

export const POST = withPermission(async (request: NextRequest, context) => {
    const body = await request.json();
    const data = createSupplierSchema.parse(body);

    const supplier = await prisma.supplier.create({ data });

    await prisma.auditLogEntry.create({
        data: {
            action: "supplier.create",
            entityType: "Supplier",
            entityId: supplier.id,
            actorId: context.userId,
        },
    });

    return NextResponse.json({ data: supplier }, { status: 201 });
}, "products", "create");
