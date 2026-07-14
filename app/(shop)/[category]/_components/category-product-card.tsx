import { CardHeader } from "@/components/ui/card";
import {
    ProductContent,
    ProductTitle,
    ProductDescription,
    ProductAction,
    ProductCard,
} from "@/components/ui/product-card";
import ResponsiveImage from "@/components/ui/responsive-image";
import { StaticImageData } from "next/image";

export interface CategoryProductCardProps {
    name: string;
    src: {
        mobile: string | StaticImageData;
        tablet: string | StaticImageData;
        desktop: string | StaticImageData;
    };
    metadataTitle?: string;
    isNew: boolean;
    description: string;
    index?: number;
}

export default function CategoryProductCard({
    name,
    src,
    metadataTitle,
    isNew,
    description,
    index = 0,
}: CategoryProductCardProps) {
    const isReversed = index % 2 !== 0;

    return (
        <div className="container mx-auto px-6 md:px-10 xl:px-0">
            <ProductCard
                className={`flex-col lg:flex-row gap-8 md:gap-16 items-center p-0 ${isReversed ? "lg:flex-row-reverse" : ""}`}
            >
                <CardHeader className="p-0 w-full">
                    <ResponsiveImage
                        mobileSrc={src.mobile}
                        tabletSrc={src.tablet}
                        desktopSrc={src.desktop}
                        alt={`${metadataTitle} product image`}
                        className="rounded-xl w-full"
                    />
                </CardHeader>
                <ProductContent
                    className={`text-center p-0 md:px-14 lg:items-start ${isReversed ? "lg:text-left " : "lg:text-left"}`}
                >
                    {isNew && (
                        <span className="text-overline text-primary text-xs">
                            NEW PRODUCT
                        </span>
                    )}
                    <ProductTitle className="text-h4 md:text-h2">
                        {name.toUpperCase()}
                    </ProductTitle>
                    <ProductDescription className="text-accent-foreground">
                        {description}
                    </ProductDescription>
                    <ProductAction className="w-max" />
                </ProductContent>
            </ProductCard>
        </div>
    );
}
