import CategoryProductCard, {
	CategoryProductCardProps,
} from "@/components/ui/category/category-product-card";

import { Metadata } from "next";

import yx1Earphone from "@/assets/product-yx1-earphones/mobile/image-product.jpg";

export const metadata: Metadata = {
	title: "earphones",
};

const earphoneProducts: CategoryProductCardProps[] = [
	{
		src: yx1Earphone,
		isNew: true,
		description: `Tailor your listening experience with bespoke dynamic drivers from the new YX1 Wireless Earphones. Enjoy incredible high-fidelity sound even in noisy environments with its active noise cancellation feature.`,
		name: "yx1 wireless earphones",
	},
];

export default function EarphonesPage() {
	return earphoneProducts.map((earphoneProduct, index) => (
		<CategoryProductCard
			{...earphoneProduct}
			metadataTitle={metadata.title?.toString()}
			key={index}
		/>
	));
}
