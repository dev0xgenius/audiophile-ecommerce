import CategoryList from "@/components/ui/home/category-list";

export default function CatgoryPageLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div>
			<div>{children}</div>
			<span className="mt-24 px-6 block">
				<CategoryList />
			</span>
		</div>
	);
}
