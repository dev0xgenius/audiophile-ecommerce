import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";
import { updateSupplierSchema } from "@/lib/validations/supplier";

function getId(request: NextRequest) {
    const segments = request.nextUrl.pathname.split("/");
    return segments[segments.length - 1];
}

export const PUT = withPermission(async (request: NextRequest, context) => {
    const id = getId(request);
    const body = await request.json();
    const data = updateSupplierSchema.parse(body);

    const existing = await prisma.supplier.findUnique({ where: { id } });
    if (!existing) {
        return NextResponse.json({ error: "Supplier not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const supplier = await prisma.supplier.update({ where: { id }, data });

    await prisma.auditLogEntry.create({
        data: {
            action: "supplier.update",
            entityType: "Supplier",
            entityId: id,
            actorId: context.userId,
        },
    });

    return NextResponse.json({ data: supplier });
}, "products", "edit");
