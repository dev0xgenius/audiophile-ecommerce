import Link from "next/link";
import { CardHeader } from "@/components/ui/card";
import {
    ProductContent,
    ProductTitle,
    ProductDescription,
    ProductCard,
} from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import ResponsiveImage from "@/components/ui/responsive-image";

export interface CategoryProductCardProps {
    name: string;
    src: {
        mobile: string;
        tablet: string;
        desktop: string;
    };
    isNew: boolean;
    description: string;
    index?: number;
    slug?: string;
    categorySlug?: string;
}

export default function CategoryProductCard({
    name,
    src,
    isNew,
    description,
    index = 0,
    slug,
    categorySlug,
}: CategoryProductCardProps) {
    const isReversed = index % 2 !== 0;
    const productLink = slug && categorySlug ? `/${categorySlug}/${slug}` : "#";

    return (
        <div className="container mx-auto px-6 md:px-10 xl:px-0">
            <ProductCard
                className={`flex-col lg:flex-row gap-8 md:gap-16 lg:gap-32 items-center rounded-none p-0 ${isReversed ? "lg:flex-row-reverse" : ""}`}
            >
                <CardHeader className="p-0 w-full">
                    <ResponsiveImage
                        mobileSrc={src.mobile}
                        tabletSrc={src.tablet}
                        desktopSrc={src.desktop}
                        alt={`${name} product image`}
                        fill
                        className="relative w-full rounded-xl overflow-hidden bg-gray aspect-square md:aspect-[689/352] lg:aspect-[540/560]"
                        imageClassName="object-cover"
                    />
                </CardHeader>
                <ProductContent
                    className={`text-center p-0 lg:items-start ${isReversed ? "lg:text-left " : "lg:text-left"}`}
                >
                    {isNew && (
                        <span className="text-overline text-primary text-xs">
                            NEW PRODUCT
                        </span>
                    )}
                    <ProductTitle className="text-h4 md:text-h2">
                        {name.toUpperCase()}
                    </ProductTitle>
                    <ProductDescription className="text-accent-foreground lg:max-w-md md:w-9/12 lg:w-full mx-auto lg:mx-0 p-0">
                        {description}
                    </ProductDescription>
                    <Link href={productLink}>
                        <Button
                            size="lg"
                            className="font-semibold tracking-widest"
                        >
                            SEE PRODUCT
                        </Button>
                    </Link>
                </ProductContent>
            </ProductCard>
        </div>
    );
}
