import { prisma } from "@/lib/prisma";
import { rankRecommendationCandidates } from "@/lib/recommendation-ranking";

const QUALIFYING_ORDER_STATUSES = [
    "paid",
    "processing",
    "shipped",
    "delivered",
] satisfies Array<"paid" | "processing" | "shipped" | "delivered">;

interface MediaAssetLike {
    url: string;
    folder: string | null;
    variants: unknown;
}

export interface StorefrontRecommendation {
    id: string;
    name: string;
    slug: string;
    categorySlug: string;
    images: {
        mobile: string;
        tablet: string;
        desktop: string;
    };
}

interface RecommendationInput {
    productId: string;
    categoryId: string | null;
    limit?: number;
}

function getAssetSrc(asset: MediaAssetLike | null | undefined): string {
    if (!asset) return "";

    const variants = asset.variants as Record<
        string,
        { webp?: string; original?: string }
    > | null;

    return (
        variants?.desktop?.webp ??
        variants?.desktop?.original ??
        asset.url
    );
}

export async function getProductRecommendations({
    productId,
    categoryId,
    limit = 3,
}: RecommendationInput): Promise<StorefrontRecommendation[]> {
    if (limit <= 0) return [];

    const [candidates, coPurchasedOrders, salesByVariant] = await Promise.all([
        prisma.product.findMany({
            where: {
                id: { not: productId },
                status: "active",
                categoryId: { not: null },
                variants: {
                    some: {
                        isActive: true,
                        stock: { gt: 0 },
                    },
                },
            },
            select: {
                id: true,
                name: true,
                slug: true,
                categoryId: true,
                category: { select: { slug: true } },
                variants: {
                    select: { id: true },
                },
            },
        }),
        prisma.order.findMany({
            where: {
                status: { in: QUALIFYING_ORDER_STATUSES },
                items: {
                    some: {
                        variant: { is: { productId } },
                    },
                },
            },
            select: {
                items: {
                    select: {
                        variant: { select: { productId: true } },
                    },
                },
            },
        }),
        prisma.orderLineItem.groupBy({
            by: ["variantId"],
            where: {
                variantId: { not: null },
                order: {
                    status: { in: QUALIFYING_ORDER_STATUSES },
                },
            },
            _sum: { quantity: true },
        }),
    ]);

    const coPurchaseCounts = new Map<string, number>();
    for (const order of coPurchasedOrders) {
        const productIds = new Set(
            order.items
                .map((item) => item.variant?.productId)
                .filter(
                    (candidateProductId): candidateProductId is string =>
                        Boolean(candidateProductId) &&
                        candidateProductId !== productId,
                ),
        );

        for (const candidateProductId of productIds) {
            coPurchaseCounts.set(
                candidateProductId,
                (coPurchaseCounts.get(candidateProductId) ?? 0) + 1,
            );
        }
    }

    const candidateByVariantId = new Map<string, string>();
    for (const candidate of candidates) {
        for (const variant of candidate.variants) {
            candidateByVariantId.set(variant.id, candidate.id);
        }
    }

    const unitsSoldByProduct = new Map<string, number>();
    for (const sale of salesByVariant) {
        if (!sale.variantId) continue;

        const candidateProductId = candidateByVariantId.get(sale.variantId);
        if (!candidateProductId) continue;

        unitsSoldByProduct.set(
            candidateProductId,
            (unitsSoldByProduct.get(candidateProductId) ?? 0) +
                (sale._sum.quantity ?? 0),
        );
    }

    const ranked = rankRecommendationCandidates(
        candidates.map((candidate) => ({
            ...candidate,
            coPurchaseOrderCount: coPurchaseCounts.get(candidate.id) ?? 0,
            unitsSold: unitsSoldByProduct.get(candidate.id) ?? 0,
        })),
        categoryId,
        limit,
    );

    if (ranked.length === 0) return [];

    const media = await prisma.productMedia.findMany({
        where: {
            productId: { in: ranked.map((product) => product.id) },
            purpose: { in: ["category", "default"] },
        },
        select: {
            productId: true,
            purpose: true,
            isPrimary: true,
            mediaAsset: {
                select: {
                    url: true,
                    folder: true,
                    variants: true,
                },
            },
        },
    });

    const mediaByProduct = new Map<string, typeof media>();
    for (const item of media) {
        const productMedia = mediaByProduct.get(item.productId) ?? [];
        productMedia.push(item);
        mediaByProduct.set(item.productId, productMedia);
    }

    return ranked.flatMap((product) => {
        if (!product.category) return [];

        const productMedia = mediaByProduct.get(product.id) ?? [];
        const categoryMedia = productMedia.filter(
            (item) => item.purpose === "category",
        );
        const fallbackAsset = productMedia.find(
            (item) => item.purpose === "default" && item.isPrimary,
        )?.mediaAsset;
        const assetForSize = (size: "mobile" | "tablet" | "desktop") =>
            categoryMedia.find((item) =>
                item.mediaAsset.folder?.endsWith(`/${size}`),
            )?.mediaAsset ?? fallbackAsset;

        return [
            {
                id: product.id,
                name: product.name,
                slug: product.slug,
                categorySlug: product.category.slug,
                images: {
                    mobile: getAssetSrc(assetForSize("mobile")),
                    tablet: getAssetSrc(assetForSize("tablet")),
                    desktop: getAssetSrc(assetForSize("desktop")),
                },
            },
        ];
    });
}
