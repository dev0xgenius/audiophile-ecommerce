import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Headphones",
};

import xx59Heaphone from "@/assets/product-xx59-headphones/mobile/image-product.jpg";
import xx99MarkIHeadphone from "@/assets/product-xx99-mark-one-headphones/mobile/image-product.jpg";
import xx99MarkIIHeadphone from "@/assets/product-xx99-mark-two-headphones/mobile/image-product.jpg";
import CategoryProductCard from "@/components/ui/category/category-product-card";

const headphoneProducts = [
	{
		src: xx99MarkIIHeadphone,
		isNew: true,
		name: "xx99 mark ii headphones",
		description: `
			The new XX99 Mark II headphones is the pinnacle of pristine audio.
			It redefines your premium headphone experience by reproducing the
			balanced depth and precision of studio-quality sound.
		`,
	},
	{
		src: xx99MarkIHeadphone,
		isNew: false,
		name: "xx99 mark i headphones",
		description: `As the gold standard for headphones, the classic XX99 Mark I offers detailed and accurate audio reproduction for audiophiles, mixing engineers, and music aficionados alike in studios and on the go.`,
	},
	{
		src: xx59Heaphone,
		isNew: false,
		name: "xx59 headphones",
		description: `Enjoy your audio almost anywhere and customize it to your specific tastes with the XX59 headphones. The stylish yet durable versatile wireless headset is a brilliant companion at home or on the move.`,
	},
];

export default function HeadphonesPage() {
	return headphoneProducts.map((headphoneProduct, index) => (
		<CategoryProductCard
			{...headphoneProduct}
			metadataTitle={metadata.title?.toString()}
			key={index}
		/>
	));
}
