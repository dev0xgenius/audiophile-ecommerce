import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCategoryPreviewImage } from "@/lib/product-assets";
import CategoryProductCard from "./_components/category-product-card";

const validCategories = ["headphones", "speakers", "earphones"];

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
        },
    });

    const productCards = products.map((product) => {
        const images = getCategoryPreviewImage(product.slug);
        return {
            name: product.name,
            src: images ?? { mobile: "", tablet: "", desktop: "" },
            isNew:
                product.createdAt >
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
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
                        src={product.src as any}
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
