import zx7Speaker from "@/assets/product-zx7-speaker/mobile/image-product.jpg";
import zx9Speaker from "@/assets/product-zx9-speaker/mobile/image-product.jpg";

import CategoryProductCard, {
	type CategoryProductCardProps,
} from "@/components/ui/category/category-product-card";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Speakers",
};

const speakerProducts: CategoryProductCardProps[] = [
	{
		src: zx9Speaker,
		isNew: true,
		name: "zx9 speaker",
		description: `Upgrade your sound system with the all new ZX9 active speaker. It’s a bookshelf speaker system that offers truly wireless connectivity -- creating new possibilities for more pleasing and practical audio setups.`,
	},
	{
		src: zx7Speaker,
		isNew: false,
		name: "zx7 speaker",
		description: `Stream high quality sound wirelessly with minimal loss. The ZX7 bookshelf speaker uses high-end audiophile components that represents the top of the line powered speakers for home or studio use.`,
	},
];

export default function SpeakersPage() {
	return speakerProducts.map((speakerProduct, index) => (
		<CategoryProductCard
			{...speakerProduct}
			metadataTitle={metadata.title?.toString()}
			key={index}
		/>
	));
}
