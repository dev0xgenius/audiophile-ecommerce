import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";
import { z } from "zod";

const updateReturnSchema = z.object({
    status: z.enum(["requested", "approved", "rejected", "restocked"]),
    restocked: z.boolean().optional(),
});

export const GET = withPermission(async (request: NextRequest) => {
    const id = request.nextUrl.pathname.split("/returns/")[1]?.split("/")[0] ?? "";

    const ret = await prisma.return.findUnique({
        where: { id },
        include: {
            order: { select: { id: true, status: true, total: true } },
            actor: { select: { id: true, name: true } },
        },
    });

    if (!ret) {
        return NextResponse.json({ error: "Return not found", code: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({ data: ret });
}, "orders", "view");

export const PUT = withPermission(async (request: NextRequest, context) => {
    const id = request.nextUrl.pathname.split("/returns/")[1]?.split("/")[0] ?? "";
    const body = await request.json();
    const data = updateReturnSchema.parse(body);

    const ret = await prisma.return.findUnique({ where: { id } });
    if (!ret) {
        return NextResponse.json({ error: "Return not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const updated = await prisma.return.update({
        where: { id },
        data: {
            status: data.status,
            restocked: data.restocked ?? ret.restocked,
            actorId: context.userId,
        },
    });

    await prisma.auditLogEntry.create({
        data: {
            actorId: context.userId,
            action: "return.update",
            entityType: "return",
            entityId: id,
            before: { status: ret.status, restocked: ret.restocked },
            after: { status: data.status, restocked: data.restocked },
        },
    });

    return NextResponse.json({ data: updated });
}, "orders", "edit");
