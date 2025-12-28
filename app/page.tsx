import { CategoryCardProps } from "@/components/ui/category-card";
import CategoryList from "@/components/ui/home/category-list";
import Hero from "@/components/ui/home/hero";
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
		<div>
			<Hero />
			<div className="flex flex-col gap-[120px] mt-24 px-6">
				<CategoryList data={categories} />
				<ProductList />
			</div>
		</div>
	);
}
