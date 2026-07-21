import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stockAdjustSchema } from "@/lib/validations/stock";
import { withPermission } from "@/lib/auth/permissions";

export const POST = withPermission(async (request: NextRequest, context) => {
    const body = await request.json();
    const data = stockAdjustSchema.parse(body);

    const variant = await prisma.productVariant.findUnique({
        where: { id: data.variantId },
    });

    if (!variant) {
        return NextResponse.json(
            { error: "Variant not found", code: "NOT_FOUND" },
            { status: 404 },
        );
    }

    const beforeQuantity = variant.stock;
    const afterQuantity = beforeQuantity + data.delta;

    if (afterQuantity < 0) {
        return NextResponse.json(
            { error: "Insufficient stock", code: "INSUFFICIENT_STOCK" },
            { status: 400 },
        );
    }

    const [updated] = await prisma.$transaction([
        prisma.productVariant.update({
            where: { id: data.variantId },
            data: { stock: afterQuantity },
        }),
        prisma.stockLedgerEntry.create({
            data: {
                variantId: data.variantId,
                delta: data.delta,
                reason: data.reason,
                reasonDetail: data.reasonDetail,
                actorId: context.userId,
                beforeQuantity,
                afterQuantity,
            },
        }),
        prisma.auditLogEntry.create({
            data: {
                actorId: context.userId,
                action: "stock.adjust",
                entityType: "ProductVariant",
                entityId: data.variantId,
                before: { stock: beforeQuantity },
                after: { stock: afterQuantity, reason: data.reason },
            },
        }),
    ]);

    return NextResponse.json({ data: updated });
}, "inventory", "edit");
