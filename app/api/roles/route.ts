import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRoleSchema } from "@/lib/validations/user";
import { withPermission } from "@/lib/auth/permissions";

export const GET = withPermission(async () => {
    const roles = await prisma.role.findMany({
        include: {
            permissions: {
                include: { permission: { select: { id: true, resource: true, action: true, description: true } } },
            },
            _count: { select: { users: true } },
        },
        orderBy: { name: "asc" },
    });

    return NextResponse.json({ data: roles });
}, "roles", "view");

export const POST = withPermission(async (request: NextRequest) => {
    const body = await request.json();
    const data = createRoleSchema.parse(body);

    const existing = await prisma.role.findUnique({ where: { name: data.name } });
    if (existing) {
        return NextResponse.json({ error: "Role already exists" }, { status: 409 });
    }

    const role = await prisma.role.create({
        data: {
            name: data.name,
            description: data.description,
            permissions: data.permissionIds
                ? { create: data.permissionIds.map((permissionId) => ({ permissionId })) }
                : undefined,
        },
        include: {
            permissions: { include: { permission: true } },
        },
    });

    await prisma.auditLogEntry.create({
        data: { action: "role.create", entityType: "role", entityId: role.id, after: { name: role.name } },
    });

    return NextResponse.json({ data: role }, { status: 201 });
}, "roles", "create");
