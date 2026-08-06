import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoryProductCard from "./_components/category-product-card";

const validCategories = ["headphones", "speakers", "earphones"];

interface MediaAssetLike {
    url: string;
    variants: unknown;
}

function getAssetSrc(asset: MediaAssetLike | null | undefined): string {
    if (!asset) return "";
    const variants = asset.variants as Record<
        string,
        { webp?: string; original?: string }
    > | null;
    if (variants?.desktop?.webp) return variants.desktop.webp;
    if (variants?.desktop?.original) return variants.desktop.original;
    return asset.url;
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ category: string }>;
}) {
    const { category } = await params;
    if (!validCategories.includes(category)) notFound();

    const dbCategory = await prisma.category.findUnique({
        where: { slug: category },
    });

    if (!dbCategory) notFound();

    const products = await prisma.product.findMany({
        where: {
            categoryId: dbCategory.id,
            status: "active",
        },
        orderBy: { createdAt: "asc" },
        include: {
            variants: {
                where: { isActive: true },
                take: 1,
            },
            media: {
                include: { mediaAsset: true },
                orderBy: [{ purpose: "asc" }, { displayOrder: "asc" }],
            },
        },
    });

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    const productCards = products.map((product) => {
        const categoryMedia = product.media.filter(
            (m) => m.purpose === "category",
        );
        const fallbackAsset =
            product.media.find(
                (m) => m.purpose === "default" && m.isPrimary,
            )?.mediaAsset ?? null;

        const assetForSize = (size: "mobile" | "tablet" | "desktop") =>
            categoryMedia.find((m) =>
                m.mediaAsset?.folder?.endsWith(`/${size}`),
            )?.mediaAsset ?? fallbackAsset;

        return {
            name: product.name,
            src: {
                mobile: getAssetSrc(assetForSize("mobile")),
                tablet: getAssetSrc(assetForSize("tablet")),
                desktop: getAssetSrc(assetForSize("desktop")),
            },
            isNew: product.createdAt > cutoffDate,
            description: product.description ?? "",
            slug: product.slug,
            categorySlug: category,
        };
    });

    return (
        <div>
            <div className="bg-darker py-8 md:py-16">
                <span className="text-h4 block mx-auto md:text-h2 text-white text-center">
                    {dbCategory.name.toUpperCase()}
                </span>
            </div>
            <div className="container max-w-[1110] mx-auto flex flex-col gap-16 py-16 md:gap-[120] md:py-[120] xl:gap-40 xl:py-40">
                {productCards.map((product, index) => (
                    <CategoryProductCard
                        name={product.name}
                        src={product.src}
                        isNew={product.isNew}
                        description={product.description}
                        index={index}
                        key={product.slug}
                        slug={product.slug}
                        categorySlug={product.categorySlug}
                    />
                ))}
            </div>
        </div>
    );
}
