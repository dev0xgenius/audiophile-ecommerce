import { cn } from "@/lib/utils";
import CategoryCard, { CategoryCardProps } from "../category-card";

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

export default function CategoryList({
    data,
    className,
    ...props
}: { data?: CategoryCardProps[] } & React.ComponentProps<"ul">) {
    const dataToMap = data instanceof Array ? data : categories;

    return (
        <ul className={cn("flex flex-wrap gap-16", className)} {...props}>
            {dataToMap.map((category, i) => (
                <li key={i} className="min-w-full my-4">
                    <CategoryCard {...category} />
                </li>
            ))}
        </ul>
    );
}
