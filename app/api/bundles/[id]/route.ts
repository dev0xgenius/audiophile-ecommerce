import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";
import { updateBundleSchema } from "@/lib/validations/bundle";

function getId(request: NextRequest) {
    const segments = request.nextUrl.pathname.split("/");
    return segments[segments.length - 1];
}

export const PUT = withPermission(async (request: NextRequest, context) => {
    const id = getId(request);
    const body = await request.json();
    const data = updateBundleSchema.parse(body);

    const existing = await prisma.bundle.findUnique({ where: { id } });
    if (!existing) {
        return NextResponse.json({ error: "Bundle not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const bundle = await prisma.bundle.update({ where: { id }, data });

    await prisma.auditLogEntry.create({
        data: {
            action: "bundle.update",
            entityType: "Bundle",
            entityId: id,
            actorId: context.userId,
        },
    });

    return NextResponse.json({ data: bundle });
}, "products", "edit");

export const DELETE = withPermission(async (request: NextRequest, context) => {
    const id = getId(request);

    const existing = await prisma.bundle.findUnique({ where: { id } });
    if (!existing) {
        return NextResponse.json({ error: "Bundle not found", code: "NOT_FOUND" }, { status: 404 });
    }

    await prisma.bundle.delete({ where: { id } });

    await prisma.auditLogEntry.create({
        data: {
            action: "bundle.delete",
            entityType: "Bundle",
            entityId: id,
            actorId: context.userId,
        },
    });

    return NextResponse.json({ success: true });
}, "products", "delete");
