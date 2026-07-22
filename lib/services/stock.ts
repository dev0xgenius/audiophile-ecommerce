import { prisma } from "@/lib/prisma";

export async function reserveStock(orderId: string): Promise<void> {
    const items = await prisma.orderLineItem.findMany({
        where: { orderId, variantId: { not: null } },
        select: { variantId: true, quantity: true },
    });

    if (items.length === 0) return;

    await prisma.$transaction(async (tx) => {
        for (const item of items) {
            const variant = await tx.productVariant.findUnique({
                where: { id: item.variantId! },
                select: { stock: true },
            });
            if (!variant) continue;

            await tx.productVariant.update({
                where: { id: item.variantId! },
                data: { stock: { decrement: item.quantity } },
            });

            await tx.stockLedgerEntry.create({
                data: {
                    variantId: item.variantId!,
                    delta: -item.quantity,
                    reason: "sale",
                    referenceType: "order",
                    referenceId: orderId,
                    beforeQuantity: variant.stock,
                    afterQuantity: variant.stock - item.quantity,
                },
            });
        }
    });
}

export async function releaseStock(orderId: string): Promise<void> {
    const items = await prisma.orderLineItem.findMany({
        where: { orderId, variantId: { not: null } },
        select: { variantId: true, quantity: true },
    });

    if (items.length === 0) return;

    await prisma.$transaction(async (tx) => {
        for (const item of items) {
            const variant = await tx.productVariant.findUnique({
                where: { id: item.variantId! },
                select: { stock: true },
            });
            if (!variant) continue;

            await tx.productVariant.update({
                where: { id: item.variantId! },
                data: { stock: { increment: item.quantity } },
            });

            await tx.stockLedgerEntry.create({
                data: {
                    variantId: item.variantId!,
                    delta: item.quantity,
                    reason: "correction",
                    reasonDetail: "Payment failed / Order cancelled",
                    referenceType: "order",
                    referenceId: orderId,
                    beforeQuantity: variant.stock,
                    afterQuantity: variant.stock + item.quantity,
                },
            });
        }
    });
}

export async function adjustStock(
    variantId: string,
    delta: number,
    reason: string,
    actorId?: string,
    reasonDetail?: string,
) {
    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) throw new Error("Variant not found");

    const beforeQuantity = variant.stock;
    const afterQuantity = beforeQuantity + delta;

    if (afterQuantity < 0) throw new Error("Insufficient stock");

    const [updated] = await prisma.$transaction([
        prisma.productVariant.update({
            where: { id: variantId },
            data: { stock: afterQuantity },
        }),
        prisma.stockLedgerEntry.create({
            data: {
                variantId,
                delta,
                reason: reason as "restock" | "sale" | "adjustment" | "return" | "damaged" | "correction",
                reasonDetail,
                actorId,
                beforeQuantity,
                afterQuantity,
            },
        }),
    ]);

    return updated;
}
