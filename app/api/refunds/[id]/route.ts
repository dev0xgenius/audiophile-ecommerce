import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";
import { z } from "zod";

const updateRefundSchema = z.object({
    status: z.enum(["pending", "succeeded", "failed"]),
    reason: z.string().optional(),
});

export const GET = withPermission(async (request: NextRequest) => {
    const id = request.nextUrl.pathname.split("/refunds/")[1]?.split("/")[0] ?? "";

    const refund = await prisma.refund.findUnique({
        where: { id },
        include: {
            payment: { select: { id: true, amount: true, provider: true, pspPaymentIntentId: true } },
            initiator: { select: { id: true, name: true } },
        },
    });

    if (!refund) {
        return NextResponse.json({ error: "Refund not found", code: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({ data: refund });
}, "payments", "view");

export const PUT = withPermission(async (request: NextRequest, context) => {
    const id = request.nextUrl.pathname.split("/refunds/")[1]?.split("/")[0] ?? "";
    const body = await request.json();
    const data = updateRefundSchema.parse(body);

    const refund = await prisma.refund.findUnique({ where: { id } });
    if (!refund) {
        return NextResponse.json({ error: "Refund not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const updated = await prisma.refund.update({
        where: { id },
        data: { status: data.status, reason: data.reason ?? refund.reason },
    });

    await prisma.auditLogEntry.create({
        data: {
            actorId: context.userId,
            action: "refund.update",
            entityType: "refund",
            entityId: id,
            before: { status: refund.status },
            after: { status: data.status },
        },
    });

    return NextResponse.json({ data: updated });
}, "payments", "edit");
