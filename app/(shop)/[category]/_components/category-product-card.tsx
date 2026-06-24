import {
    ProductCard,
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
            <ResponsiveImage
                mobileSrc={src.mobile}
                tabletSrc={src.tablet}
                desktopSrc={src.desktop}
                alt={`${metadataTitle} product image`}
                className="rounded-xl"
            />
            <ProductContent className="text-center p-0">
                {isNew && (
                    <span className="text-overline text-primary">
                        NEW PRODUCT
                    </span>
                )}
                <ProductTitle className="text-h1">
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
