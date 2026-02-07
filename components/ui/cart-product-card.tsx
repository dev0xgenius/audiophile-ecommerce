import { StaticImageData } from "next/image";
import { CardFooter } from "./card";
import Counter from "./counter";
import {
    ProductCard,
    ProductContent,
    ProductImage,
    ProductTitle,
} from "./product-card";

export interface CardProductCardProps {
    image: string | StaticImageData;
    title: string;
    price: string;
    count: number;
    hasCounter?: boolean;
}

export default function CartProductCard({
    image,
    title,
    count,
    price,
    hasCounter = false,
}: CardProductCardProps) {
    return (
        <ProductCard className="flex-row justify-evenly gap-4 p-0 rounded-none bg-transparent">
            <ProductImage
                src={image}
                alt="cart product item"
                className="rounded-2xl"
            />
            <ProductContent className="p-0 gap-0 text-left items-start">
                <ProductTitle className="text-base  font-normal tracking-normal">
                    {title.toUpperCase()}
                </ProductTitle>
                <span className="text-accent-foreground">{price}</span>
            </ProductContent>
            <CardFooter className="p-0">
                {count && hasCounter ? (
                    <Counter className="py-2 px-3" />
                ) : (
                    <span className="text-accent-foreground -mt-5">{`x${count}`}</span>
                )}
            </CardFooter>
        </ProductCard>
    );
}
