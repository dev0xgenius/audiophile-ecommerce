import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";
import { topProductsQuerySchema } from "@/lib/validations/analytics";

export const GET = withPermission(async (request: NextRequest) => {
    const { searchParams } = request.nextUrl;
    const params = topProductsQuerySchema.parse(Object.fromEntries(searchParams));

    const now = new Date();
    let dateFrom: Date;
    const dateTo = new Date(now);
    dateTo.setHours(23, 59, 59, 999);

    if (params.period === "today") {
        dateFrom = new Date(now);
        dateFrom.setHours(0, 0, 0, 0);
    } else if (params.period === "7d") {
        dateFrom = new Date(now);
        dateFrom.setDate(dateFrom.getDate() - 6);
        dateFrom.setHours(0, 0, 0, 0);
    } else if (params.period === "30d") {
        dateFrom = new Date(now);
        dateFrom.setDate(dateFrom.getDate() - 29);
        dateFrom.setHours(0, 0, 0, 0);
    } else if (params.period === "90d") {
        dateFrom = new Date(now);
        dateFrom.setDate(dateFrom.getDate() - 89);
        dateFrom.setHours(0, 0, 0, 0);
    } else {
        dateFrom = params.dateFrom ? new Date(params.dateFrom) : new Date(now);
        if (isNaN(dateFrom.getTime())) dateFrom = new Date(now);
    }

    const lineItems = await prisma.orderLineItem.findMany({
        where: {
            order: {
                createdAt: { gte: dateFrom, lte: dateTo },
                NOT: { status: { in: ["cancelled", "refunded"] } },
            },
        },
        select: {
            quantity: true,
            lineTotal: true,
            variant: {
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            category: { select: { id: true, name: true } },
                        },
                    },
                },
            },
        },
    });

    const productMap = new Map<string, { productId: string; productName: string; variantName: string; quantitySold: number; revenue: number }>();
    const categoryMap = new Map<string, { categoryId: string; categoryName: string; quantitySold: number; revenue: number }>();

    for (const item of lineItems) {
        const v = item.variant;
        if (!v) continue;

        const pKey = v.product.id;
        const existing = productMap.get(pKey);
        if (existing) {
            existing.quantitySold += item.quantity;
            existing.revenue += item.lineTotal;
        } else {
            productMap.set(pKey, {
                productId: v.product.id,
                productName: v.product.name,
                variantName: v.name,
                quantitySold: item.quantity,
                revenue: item.lineTotal,
            });
        }

        const cat = v.product.category;
        if (cat) {
            const cKey = cat.id;
            const cExisting = categoryMap.get(cKey);
            if (cExisting) {
                cExisting.quantitySold += item.quantity;
                cExisting.revenue += item.lineTotal;
            } else {
                categoryMap.set(cKey, {
                    categoryId: cat.id,
                    categoryName: cat.name,
                    quantitySold: item.quantity,
                    revenue: item.lineTotal,
                });
            }
        }
    }

    const topProducts = Array.from(productMap.values())
        .sort((a, b) => b.quantitySold - a.quantitySold)
        .slice(0, params.limit);

    const topCategories = Array.from(categoryMap.values())
        .sort((a, b) => b.quantitySold - a.quantitySold)
        .slice(0, params.limit);

    return NextResponse.json({ data: { products: topProducts, categories: topCategories } });
}, "orders", "view");
