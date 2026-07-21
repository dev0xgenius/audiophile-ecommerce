import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateUserSchema } from "@/lib/validations/user";
import { withPermission } from "@/lib/auth/permissions";

function getId(request: NextRequest) {
    const segments = request.nextUrl.pathname.split("/");
    return segments[segments.length - 1];
}

export const GET = withPermission(async (request: NextRequest) => {
    const id = getId(request);
    const user = await prisma.user.findUnique({
        where: { id },
        include: { roles: { include: { role: true } } },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ data: user });
}, "users", "view");

export const PUT = withPermission(async (request: NextRequest) => {
    const id = getId(request);
    const body = await request.json();
    const data = updateUserSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await prisma.user.update({
        where: { id },
        data: {
            name: data.name,
            email: data.email,
            isActive: data.isActive,
        },
    });

    if (data.roleIds) {
        await prisma.userRole.deleteMany({ where: { userId: id } });
        await prisma.userRole.createMany({
            data: data.roleIds.map((roleId) => ({ userId: id, roleId })),
        });
    }

    await prisma.auditLogEntry.create({
        data: {
            action: "user.update",
            entityType: "user",
            entityId: id,
            before: { name: existing.name, email: existing.email, isActive: existing.isActive },
            after: { name: data.name, email: data.email, isActive: data.isActive },
        },
    });

    return NextResponse.json({ data: { id } });
}, "users", "edit");

export const DELETE = withPermission(async (request: NextRequest) => {
    const id = getId(request);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await prisma.user.update({ where: { id }, data: { isActive: false } });

    await prisma.auditLogEntry.create({
        data: { action: "user.deactivate", entityType: "user", entityId: id },
    });

    return NextResponse.json({ data: { id, isActive: false } });
}, "users", "delete");
