import CategoryList, {
	CategoryCardProps,
} from "@/components/ui/home/category-list";
import ProductList from "@/components/ui/home/product-list";

const categories: CategoryCardProps[] = [
	{
		hoverImg: "/headphones-category.svg",
		category: "headphones",
		link: "/category/headphones",
	},
	{
		hoverImg: "/speakers-category.svg",
		category: "speakers",
		link: "/category/speakers",
	},
	{
		hoverImg: "/earphones-category.svg",
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
