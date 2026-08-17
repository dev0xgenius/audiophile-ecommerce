import Link from "next/link";
import { Button } from "@/components/ui/button";
import ResponsiveImage from "@/components/ui/responsive-image";
import type { StorefrontRecommendation } from "@/lib/recommendations";

interface ProductRecommendationsProps {
    recommendations: StorefrontRecommendation[];
}

export default function ProductRecommendations({
    recommendations,
}: ProductRecommendationsProps) {
    if (recommendations.length === 0) return null;

    return (
        <section aria-labelledby="product-recommendations-title">
            <h2
                id="product-recommendations-title"
                className="text-h5 md:text-h3 text-center"
            >
                YOU MAY ALSO LIKE
            </h2>
            <ul className="grid gap-14 mt-10 md:grid-cols-3 md:gap-3 md:mt-14 lg:gap-8 lg:mt-16">
                {recommendations.map((product) => (
                    <li
                        key={product.id}
                        className="flex flex-col items-center gap-8 text-center"
                    >
                        <ResponsiveImage
                            mobileSrc={product.images.mobile}
                            tabletSrc={product.images.tablet}
                            desktopSrc={product.images.desktop}
                            fill
                            sizes="(min-width: 1024px) 350px, (min-width: 768px) calc((100vw - 104px) / 3), calc(100vw - 48px)"
                            alt={`${product.name} product image`}
                            className="relative w-full overflow-hidden rounded-lg bg-gray aspect-square lg:aspect-[350/318]"
                            imageClassName="object-cover"
                        />
                        <h3 className="text-h5">{product.name}</h3>
                        <Button size="lg" className="mt-auto" asChild>
                            <Link
                                href={`/${product.categorySlug}/${product.slug}`}
                            >
                                SEE PRODUCT
                            </Link>
                        </Button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
