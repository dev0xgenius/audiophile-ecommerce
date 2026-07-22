import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations/checkout";
import { selectPSP, createPayment } from "@/lib/services/payment";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const parsed = checkoutSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const { items, customer: customerInput, shipping, notes } = parsed.data;

        // Validate variants exist and have sufficient stock
        const variantIds = items.map((i) => i.variantId);
        const variants = await prisma.productVariant.findMany({
            where: { id: { in: variantIds }, isActive: true },
            include: { product: { select: { name: true } } },
        });

        const variantMap = new Map(variants.map((v) => [v.id, v]));

        for (const item of items) {
            const variant = variantMap.get(item.variantId);
            if (!variant) {
                return NextResponse.json(
                    { error: `Variant not found: ${item.variantId}` },
                    { status: 404 },
                );
            }
            if (variant.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for ${variant.name}` },
                    { status: 409 },
                );
            }
        }

        // Find or create customer
        let customer = await prisma.customer.findUnique({
            where: { email: customerInput.email },
        });

        if (!customer) {
            customer = await prisma.customer.create({
                data: {
                    name: customerInput.name,
                    email: customerInput.email,
                    phone: customerInput.phone,
                },
            });
        }

        // Create shipping address if provided
        if (shipping) {
            await prisma.address.create({
                data: {
                    customerId: customer.id,
                    type: "shipping",
                    line1: shipping.line1,
                    line2: shipping.line2,
                    city: shipping.city,
                    state: shipping.state,
                    postalCode: shipping.postalCode,
                    country: shipping.country,
                    isDefault: true,
                },
            });
        }

        // Get base prices from DB
        const productIds = [...new Set(variants.map(v => v.productId))];
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, basePrice: true },
        });
        const productPriceMap = new Map(products.map(p => [p.id, p.basePrice]));

        const reCalculatedItems = items.map((item) => {
            const variant = variantMap.get(item.variantId)!;
            const basePrice = productPriceMap.get(variant.productId) ?? 0;
            const unitPrice = basePrice + variant.priceDelta;
            const lineTotal = unitPrice * item.quantity;
            return { variantId: item.variantId, quantity: item.quantity, unitPrice, lineTotal };
        });

        const subtotal = reCalculatedItems.reduce((sum, i) => sum + i.lineTotal, 0);
        const shippingCost = subtotal >= 5000 ? 0 : 50;
        const taxRate = 0.08;
        const taxAmount = Math.round((subtotal + shippingCost) * taxRate * 100) / 100;
        const total = Math.round((subtotal + shippingCost + taxAmount) * 100) / 100;

        // Create order
        const order = await prisma.order.create({
            data: {
                customerId: customer.id,
                status: "pending_payment",
                subtotal,
                shippingCost,
                taxAmount,
                total,
                currency: "USD",
                notes,
                source: "customer",
                createdByCustomer: true,
                items: {
                    create: reCalculatedItems.map((i) => ({
                        variantId: i.variantId,
                        quantity: i.quantity,
                        unitPrice: i.unitPrice,
                        lineTotal: i.lineTotal,
                    })),
                },
                statusHistory: {
                    create: {
                        fromStatus: null,
                        toStatus: "pending_payment",
                        note: "Order placed via storefront",
                    },
                },
            },
            include: {
                items: true,
                customer: true,
            },
        });

        // Select PSP and create payment
        const pspConnection = await selectPSP(order.currency);
        if (!pspConnection) {
            // No PSP configured — create manual payment
            await prisma.payment.create({
                data: {
                    orderId: order.id,
                    provider: "manual",
                    amount: order.total,
                    currency: order.currency,
                    status: "pending",
                },
            });

            return NextResponse.json({
                orderId: order.id,
                authorizationUrl: null,
                reference: null,
                payment: "manual",
            });
        }

        const origin = new URL(request.url).origin;
        const callbackUrl = `${origin}/order/confirmation`;
        const { authorizationUrl, reference } = await createPayment(order.id, pspConnection.id, callbackUrl);

        return NextResponse.json({
            orderId: order.id,
            authorizationUrl,
            reference,
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Checkout failed";
        console.error("Checkout error:", err);
        return NextResponse.json({ error: message }, { status: 500 });
    }
};
