import { CategoryCardProps } from "@/components/ui/category-card";
import Footer from "@/components/ui/footer";
import AboutInfo from "@/components/ui/home/about-info";
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
		<div className="mt-24 px-6">
			<div className="flex flex-col gap-[120px]">
				<CategoryList data={categories} />
				<ProductList />
			</div>
		</div>
	);
}
