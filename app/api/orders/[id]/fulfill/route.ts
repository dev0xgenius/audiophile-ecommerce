import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createFulfillmentSchema } from "@/lib/validations/order";
import { withPermission } from "@/lib/auth/permissions";

function getId(request: NextRequest): string {
    return request.nextUrl.pathname.split("/orders/")[1]?.split("/")[0] ?? "";
}

export const POST = withPermission(async (request: NextRequest, context) => {
    const id = getId(request);

    const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
    });

    if (!order) {
        return NextResponse.json(
            { error: "Order not found", code: "NOT_FOUND" },
            { status: 404 },
        );
    }

    if (order.status !== "paid" && order.status !== "processing") {
        return NextResponse.json(
            { error: "Order must be in paid or processing status", code: "INVALID_TRANSITION" },
            { status: 400 },
        );
    }

    const body = await request.json();
    const data = createFulfillmentSchema.parse(body);

    const shipment = await prisma.$transaction(async (tx) => {
        const s = await tx.shipment.create({
            data: {
                orderId: id,
                trackingNumber: data.trackingNumber,
                carrier: data.carrier,
                items: {
                    create: data.items.map((item) => ({
                        lineItemId: item.lineItemId,
                        quantity: item.quantity,
                    })),
                },
            },
            include: { items: true },
        });

        if (order.status === "paid") {
            await tx.order.update({
                where: { id },
                data: { status: "processing" },
            });
            await tx.orderStatusHistory.create({
                data: {
                    orderId: id,
                    fromStatus: "paid",
                    toStatus: "processing",
                    actorId: context.userId,
                    note: "Fulfillment started",
                },
            });
        }

        await tx.auditLogEntry.create({
            data: {
                actorId: context.userId,
                action: "order.fulfill",
                entityType: "order",
                entityId: id,
                after: { shipmentId: s.id, carrier: s.carrier, trackingNumber: s.trackingNumber, items: data.items },
            },
        });

        return s;
    });

    return NextResponse.json({ data: shipment }, { status: 201 });
}, "orders", "edit");
