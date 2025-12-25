import CategoryCard, { CategoryCardProps } from "../category-card";

export default function CategoryList({ data }: { data: CategoryCardProps[] }) {
	return (
		<ul className="flex flex-wrap gap-16">
			{data.map((category, i) => (
				<li key={i} className="min-w-full my-4">
					<CategoryCard {...category} />
				</li>
			))}
		</ul>
	);
}
