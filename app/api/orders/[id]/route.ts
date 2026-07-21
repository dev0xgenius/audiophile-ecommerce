import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";

export const GET = withPermission(async (request: NextRequest) => {
    const id = request.nextUrl.pathname.split("/").pop()!;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            customer: {
                select: { id: true, name: true, email: true, phone: true },
            },
            items: {
                include: {
                    variant: {
                        select: { id: true, name: true, sku: true, productId: true },
                    },
                },
            },
            statusHistory: {
                include: {
                    actor: { select: { id: true, name: true } },
                },
                orderBy: { timestamp: "desc" },
            },
            payments: {
                include: {
                    psp: { select: { id: true, label: true, provider: true } },
                    refunds: { orderBy: { createdAt: "desc" } },
                },
                orderBy: { createdAt: "desc" },
            },
            returns: {
                include: { actor: { select: { id: true, name: true } } },
                orderBy: { createdAt: "desc" },
            },
            shipments: {
                include: {
                    items: {
                        include: {
                            lineItem: {
                                select: { id: true, quantity: true },
                            },
                        },
                    },
                },
                orderBy: { shippedAt: "asc" },
            },
        },
    });

    if (!order) {
        return NextResponse.json(
            { error: "Order not found", code: "NOT_FOUND" },
            { status: 404 },
        );
    }

    return NextResponse.json({ data: order });
}, "orders", "view");
