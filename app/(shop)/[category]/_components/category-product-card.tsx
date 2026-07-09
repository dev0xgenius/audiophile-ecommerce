import {
    ProductContent,
    ProductTitle,
    ProductDescription,
    ProductAction,
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
        <div className="container mx-auto px-6 md:px-10 xl:px-0 py-8 md:py-16">
            <div className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${isReversed ? "md:flex-row-reverse" : ""}`}>
                <div className="w-full md:w-1/2">
                    <ResponsiveImage
                        mobileSrc={src.mobile}
                        tabletSrc={src.tablet}
                        desktopSrc={src.desktop}
                        alt={`${metadataTitle} product image`}
                        className="rounded-xl w-full"
                    />
                </div>
                <ProductContent className={`text-center p-0 md:w-1/2 ${isReversed ? "md:text-left md:pl-8" : "md:text-left md:pr-8"}`}>
                    {isNew && (
                        <span className="text-overline text-primary">
                            NEW PRODUCT
                        </span>
                    )}
                    <ProductTitle className="text-h2 md:text-h1">
                        {name.toUpperCase()}
                    </ProductTitle>
                    <ProductDescription className="text-accent-foreground">
                        {description}
                    </ProductDescription>
                    <ProductAction className="w-max" />
                </ProductContent>
            </div>
        </div>
    );
}
