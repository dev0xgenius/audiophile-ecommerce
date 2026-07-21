import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";

export const GET = withPermission(async (request: NextRequest, { userId, permissions }) => {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
        return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const payments = await prisma.payment.findMany({
        where: { orderId },
        orderBy: { createdAt: "desc" },
        include: {
            refunds: {
                orderBy: { createdAt: "desc" },
            },
        },
    });

    return NextResponse.json({ data: payments });
}, "payments", "view");
