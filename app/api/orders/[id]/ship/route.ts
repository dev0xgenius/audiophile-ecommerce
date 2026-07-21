import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createShipmentSchema } from "@/lib/validations/order";
import { withPermission } from "@/lib/auth/permissions";

function getId(request: NextRequest): string {
    return request.nextUrl.pathname.split("/orders/")[1]?.split("/")[0] ?? "";
}

export const POST = withPermission(async (request: NextRequest, context) => {
    const orderId = getId(request);
    const body = await request.json();
    const data = createShipmentSchema.parse(body);

    const shipment = await prisma.shipment.findUnique({
        where: { id: data.shipmentId },
        include: { order: { select: { id: true, status: true } } },
    });

    if (!shipment || shipment.orderId !== orderId) {
        return NextResponse.json(
            { error: "Shipment not found for this order", code: "NOT_FOUND" },
            { status: 404 },
        );
    }

    const [updated] = await prisma.$transaction(async (tx) => {
        const s = await tx.shipment.update({
            where: { id: data.shipmentId },
            data: { shippedAt: new Date() },
        });

        const allShipments = await tx.shipment.findMany({
            where: { orderId, shippedAt: { not: null } },
        });

        if (shipment.order.status !== "shipped") {
            const totalShipments = await tx.shipment.count({ where: { orderId } });
            if (allShipments.length >= totalShipments) {
                await tx.order.update({
                    where: { id: orderId },
                    data: { status: "shipped" },
                });
                await tx.orderStatusHistory.create({
                    data: {
                        orderId,
                        fromStatus: shipment.order.status,
                        toStatus: "shipped",
                        actorId: context.userId,
                        note: "All items shipped",
                    },
                });
            }
        }

        await tx.auditLogEntry.create({
            data: {
                actorId: context.userId,
                action: "order.ship",
                entityType: "order",
                entityId: orderId,
                after: { shipmentId: data.shipmentId, shippedAt: new Date().toISOString() },
            },
        });

        return [s];
    });

    return NextResponse.json({ data: updated });
}, "orders", "edit");
