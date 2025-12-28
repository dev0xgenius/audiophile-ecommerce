"use client";

import CategoryList from "@/components/ui/home/category-list";
import { useEffect, useState } from "react";

export default function CatgoryPageLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const [pageTitle, setPageTitle] = useState("");

	useEffect(() => {
		Promise.resolve(document.title).then((value) =>
			setPageTitle(value.split("|")[0]),
		);
	}, []);

	return (
		<div>
			<span className="font-medium text-center w-full block bg-black py-8 text-white text-3xl">
				{pageTitle.toUpperCase()}
			</span>
			<div>{children}</div>
			<span className="mt-24 px-6 block">
				<CategoryList />
			</span>
		</div>
	);
}
