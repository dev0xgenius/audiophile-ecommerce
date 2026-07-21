import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createUserSchema, userQuerySchema } from "@/lib/validations/user";
import { withPermission } from "@/lib/auth/permissions";

export const GET = withPermission(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const query = userQuerySchema.parse(Object.fromEntries(searchParams));

    const where: Record<string, unknown> = {};
    if (query.search) {
        where.OR = [
            { name: { contains: query.search, mode: "insensitive" } },
            { email: { contains: query.search, mode: "insensitive" } },
        ];
    }
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            include: {
                roles: { include: { role: { select: { id: true, name: true } } } },
            },
            orderBy: { createdAt: "desc" },
            skip: (query.page - 1) * query.pageSize,
            take: query.pageSize,
        }),
        prisma.user.count({ where }),
    ]);

    return NextResponse.json({
        data: users,
        pagination: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) },
    });
}, "users", "view");

export const POST = withPermission(async (request: NextRequest) => {
    const body = await request.json();
    const data = createUserSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            isActive: data.isActive,
            roles: data.roleIds
                ? { create: data.roleIds.map((roleId) => ({ roleId })) }
                : undefined,
        },
        include: { roles: { include: { role: { select: { id: true, name: true } } } } },
    });

    await prisma.auditLogEntry.create({
        data: {
            action: "user.create",
            entityType: "user",
            entityId: user.id,
            after: { name: user.name, email: user.email },
        },
    });

    return NextResponse.json({ data: user }, { status: 201 });
}, "users", "create");
