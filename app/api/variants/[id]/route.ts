import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateVariantSchema } from "@/lib/validations/product";
import { withPermission } from "@/lib/auth/permissions";

function getId(request: NextRequest): string {
    return request.nextUrl.pathname.split("/variants/")[1]?.split("/")[0] ?? "";
}

export const PUT = withPermission(async (request: NextRequest, context) => {
    const id = getId(request);
    const body = await request.json();
    const data = updateVariantSchema.parse(body);

    const existing = await prisma.productVariant.findUnique({ where: { id } });
    if (!existing) {
        return NextResponse.json(
            { error: "Variant not found", code: "NOT_FOUND" },
            { status: 404 },
        );
    }

    const variant = await prisma.productVariant.update({
        where: { id },
        data,
    });

    await prisma.auditLogEntry.create({
        data: {
            actorId: context.userId,
            action: "variant.update",
            entityType: "ProductVariant",
            entityId: id,
            before: JSON.parse(JSON.stringify(existing)),
            after: JSON.parse(JSON.stringify(variant)),
        },
    });

    return NextResponse.json({ data: variant });
}, "products", "edit");

export const DELETE = withPermission(async (request: NextRequest, context) => {
    const id = getId(request);

    const existing = await prisma.productVariant.findUnique({ where: { id } });
    if (!existing) {
        return NextResponse.json(
            { error: "Variant not found", code: "NOT_FOUND" },
            { status: 404 },
        );
    }

    const variant = await prisma.productVariant.update({
        where: { id },
        data: { isActive: false },
    });

    await prisma.auditLogEntry.create({
        data: {
            actorId: context.userId,
            action: "variant.delete",
            entityType: "ProductVariant",
            entityId: id,
            before: JSON.parse(JSON.stringify(existing)),
            after: JSON.parse(JSON.stringify(variant)),
        },
    });

    return NextResponse.json({ data: variant });
}, "products", "delete");
