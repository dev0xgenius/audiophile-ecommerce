import { cn } from "@/lib/utils";
import CategoryCard, { CategoryCardProps } from "../category-card";

const categories: CategoryCardProps[] = [
    {
        hoverImg: "/shared/desktop/image-category-thumbnail-headphones.png",
        category: "headphones",
        link: "/headphones",
    },
    {
        hoverImg: "/shared/desktop/image-category-thumbnail-speakers.png",
        category: "speakers",
        link: "/speakers",
    },
    {
        hoverImg: "/shared/desktop/image-category-thumbnail-earphones.png",
        category: "earphones",
        link: "/earphones",
    },
];

export default function CategoryList({
    data,
    className,
    ...props
}: { data?: CategoryCardProps[] } & React.ComponentProps<"ul">) {
    const dataToMap = data instanceof Array ? data : categories;

    return (
        <ul
            className={cn(
                "flex flex-col justify-between items-center gap-16 md:flex-row md:gap-4 lg:gap-8",
                className,
            )}
            {...props}
        >
            {dataToMap.map((category, i) => (
                <li key={i} className="w-full my-4 max-w-[350]">
                    <CategoryCard {...category} />
                </li>
            ))}
        </ul>
    );
}
