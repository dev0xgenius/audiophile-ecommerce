import { StaticImageData } from "next/image";
import {
	ProductCard,
	ProductImage,
	ProductContent,
	ProductTitle,
	ProductDescription,
	ProductAction,
} from "../product-card";

export interface CategoryProductCardProps {
	name: string;
	src: string | StaticImageData;
	metadataTitle?: string;
	isNew: boolean;
	description: string;
}

export default function CategoryProductCard({
	name,
	src,
	metadataTitle,
	isNew,
	description,
}: CategoryProductCardProps) {
	return (
		<ProductCard className="gap-8">
			<ProductImage
				src={src}
				alt={`${metadataTitle} product image`}
				className="rounded-xl"
			/>
			<ProductContent className="text-center p-0">
				{isNew && (
					<span className="text-sm tracking-[10px] text-primary">
						NEW PRODUCT
					</span>
				)}
				<ProductTitle className="font-light text-3xl">
					{name.toUpperCase()}
				</ProductTitle>
				<ProductDescription className="text-accent-foreground">
					{description}
				</ProductDescription>
			</ProductContent>
			<ProductAction />
		</ProductCard>
	);
}
