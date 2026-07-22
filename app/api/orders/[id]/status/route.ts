import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { statusTransitionSchema, isValidTransition } from "@/lib/validations/order";
import { withPermission } from "@/lib/auth/permissions";

export const PUT = withPermission(async (request: NextRequest, context) => {
    const id = request.nextUrl.pathname.split("/orders/")[1]?.split("/")[0] ?? "";
    const { userId } = context;
    const body = await request.json();
    const data = statusTransitionSchema.parse(body);

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
        return NextResponse.json(
            { error: "Order not found", code: "NOT_FOUND" },
            { status: 404 },
        );
    }

    if (!isValidTransition(order.status, data.status)) {
        return NextResponse.json(
            {
                error: `Invalid status transition from ${order.status} to ${data.status}`,
                code: "INVALID_TRANSITION",
            },
            { status: 400 },
        );
    }

    const [updated] = await prisma.$transaction([
        prisma.order.update({
            where: { id },
            data: { status: data.status },
        }),
        prisma.orderStatusHistory.create({
            data: {
                orderId: id,
                fromStatus: order.status,
                toStatus: data.status,
                actorId: userId,
                note: data.note,
            },
        }),
        prisma.auditLogEntry.create({
            data: {
                actorId: userId,
                action: "order.status_change",
                entityType: "order",
                entityId: id,
                before: { status: order.status },
                after: { status: data.status, note: data.note },
            },
        }),
    ]);

    return NextResponse.json({ data: updated });
}, "orders", "edit");
