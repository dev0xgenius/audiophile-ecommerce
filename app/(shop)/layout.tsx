import CategoryList from "@/components/ui/home/category-list";

export default function CatgoryPageLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div>
            <div>{children}</div>
            <span className="mt-24 px-6 md:px-10 xl:px-0 block container mx-auto max-w-[1110]">
                <CategoryList />
            </span>
        </div>
    );
}
