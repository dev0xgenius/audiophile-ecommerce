import { CategoryCardProps } from "@/components/ui/category-card";
import CategoryList from "@/components/ui/home/category-list";
import ProductList from "@/components/ui/home/product-list";

const categories: CategoryCardProps[] = [
    {
        hoverImg: "/shared/desktop/image-category-thumbnail-headphones.png",
        category: "headphones",
        link: "/category/headphones",
    },
    {
        hoverImg: "/shared/desktop/image-category-thumbnail-speakers.png",
        category: "speakers",
        link: "/category/speakers",
    },
    {
        hoverImg: "/shared/desktop/image-category-thumbnail-earphones.png",
        category: "earphones",
        link: "/category/earphones",
    },
];

export default function Page() {
    return (
        <div className="flex flex-col">
            <div className="mt-24 container xl:max-w-[1110] xl:px-0 m-auto flex flex-col gap-20 md:gap-[120px] px-6 md:px-10">
                <CategoryList data={categories} />
                <ProductList />
            </div>
        </div>
    );
}
