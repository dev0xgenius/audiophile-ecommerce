import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateRoleSchema } from "@/lib/validations/user";
import { withPermission } from "@/lib/auth/permissions";

function getId(request: NextRequest) {
    const segments = request.nextUrl.pathname.split("/");
    return segments[segments.length - 1];
}

export const GET = withPermission(async (request: NextRequest) => {
    const id = getId(request);
    const role = await prisma.role.findUnique({
        where: { id },
        include: { permissions: { include: { permission: true } } },
    });
    if (!role) return NextResponse.json({ error: "Role not found" }, { status: 404 });
    return NextResponse.json({ data: role });
}, "roles", "view");

export const PUT = withPermission(async (request: NextRequest) => {
    const id = getId(request);
    const body = await request.json();
    const data = updateRoleSchema.parse(body);

    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) return NextResponse.json({ error: "Role not found" }, { status: 404 });
    if (role.isSystem) return NextResponse.json({ error: "Cannot edit system roles" }, { status: 403 });

    await prisma.role.update({
        where: { id },
        data: {
            name: data.name,
            description: data.description,
            permissions: data.permissionIds
                ? {
                    deleteMany: {},
                    create: data.permissionIds.map((permissionId) => ({ permissionId })),
                  }
                : undefined,
        },
    });

    await prisma.auditLogEntry.create({
        data: { action: "role.update", entityType: "role", entityId: id },
    });

    return NextResponse.json({ data: { id } });
}, "roles", "edit");

export const DELETE = withPermission(async (request: NextRequest) => {
    const id = getId(request);
    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) return NextResponse.json({ error: "Role not found" }, { status: 404 });
    if (role.isSystem) return NextResponse.json({ error: "Cannot delete system roles" }, { status: 403 });

    await prisma.role.delete({ where: { id } });

    await prisma.auditLogEntry.create({
        data: { action: "role.delete", entityType: "role", entityId: id, before: { name: role.name } },
    });

    return NextResponse.json({ data: { id } });
}, "roles", "delete");
