import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoryProductCard from "./_components/category-product-card";

const validCategories = ["headphones", "speakers", "earphones"];

function getVariantUrl(
    media: Array<{ mediaAsset: { variants: unknown; url: string } | null }> | undefined,
    size: "mobile" | "tablet" | "desktop",
): string {
    const asset = media?.[0]?.mediaAsset;
    if (!asset) return "";

    const variants = asset.variants as Record<string, { webp?: string; original?: string }> | null;
    if (variants) {
        const sizeVariants = variants[size] || variants.desktop || variants.original;
        if (sizeVariants?.original) return sizeVariants.original;
        if (sizeVariants?.webp) return sizeVariants.webp;
    }

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
                where: { purpose: "default", isPrimary: true },
                include: { mediaAsset: true },
                take: 1,
            },
        },
    });

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    const productCards = products.map((product) => ({
        name: product.name,
        src: {
            mobile: getVariantUrl(product.media, "mobile"),
            tablet: getVariantUrl(product.media, "tablet"),
            desktop: getVariantUrl(product.media, "desktop"),
        },
        isNew: product.createdAt > cutoffDate,
        description: product.description ?? "",
        slug: product.slug,
        categorySlug: category,
    }));

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
                        metadataTitle={category}
                        isNew={product.isNew}
                        description={product.description}
                        index={index}
                        key={product.slug}
                    />
                ))}
            </div>
        </div>
    );
}
