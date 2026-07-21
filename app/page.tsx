import { prisma } from "@/lib/prisma";
import { CategoryCardProps } from "@/components/ui/category-card";
import CategoryList from "@/components/ui/home/category-list";
import ProductList from "@/components/ui/home/product-list";

export default async function Page() {
    const categories = await prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
    });

    const categoryCards: CategoryCardProps[] = categories.map((cat) => ({
        hoverImg: `/shared/desktop/image-category-thumbnail-${cat.slug}.png`,
        category: cat.slug,
        link: `/${cat.slug}`,
    }));

    return (
        <div className="flex flex-col">
            <div className="mt-24 container xl:max-w-[1110] xl:px-0 m-auto flex flex-col gap-20 md:gap-[120px] px-6 md:px-10">
                <CategoryList data={categoryCards} />
                <ProductList />
            </div>
        </div>
    );
}
