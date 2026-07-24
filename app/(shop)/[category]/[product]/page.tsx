import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getProductDetailImage, getProductGallery } from "@/lib/product-assets";
import { AddToCart } from "@/components/ui/add-to-cart";
import { Button } from "@/components/ui/button";
import { CardFooter, CardHeader } from "@/components/ui/card";
import {
    ProductCard,
    ProductContent,
    ProductDescription,
    ProductTitle,
} from "@/components/ui/product-card";
import ResponsiveImage from "@/components/ui/responsive-image";
import { cn } from "@/lib/utils";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ product: string }>;
}) {
    const { product: slug } = await params;

    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            category: true,
            variants: { where: { isActive: true } },
        },
    });

    if (!product) notFound();

    const images = getProductDetailImage(product.slug);
    const gallery = getProductGallery(product.slug);
    const defaultVariant = product.variants[0];
    const box = product.box as Array<{ name: string; quantity: number }> | null;

    return (
        <div className="leading-7 gap-6 p-6 md:px-10 xl:px-0 py-2 lg:py-20 flex flex-col items-start container mx-auto max-w-[1110] lg:px-0">
            <Button
                variant="ghost"
                className="text-accent-foreground font-normal p-0"
            >
                Go Back
            </Button>
            <div className="grid gap-[88px] md:gap-32">
                <ProductCard className="p-0 rounded-none items-start md:items-center gap-6 md:gap-16 xl:gap-[124.5] md:flex-row">
                    <CardHeader className="w-full p-0 gap-0">
                        {images && (
                            <ResponsiveImage
                                mobileSrc={images.mobile}
                                tabletSrc={images.tablet}
                                desktopSrc={images.desktop}
                                className=""
                                alt={product.name}
                            />
                        )}
                    </CardHeader>
                    <div className="flex flex-col gap-6 md:gap-8 w-full lg:justify-center">
                        <span className="text-overline text-primary text-xs">
                            NEW PRODUCT
                        </span>
                        <ProductContent className="text-left">
                            <ProductTitle className="text-h4 xl:text-h2">
                                {product.name.toUpperCase()}
                            </ProductTitle>
                            <ProductDescription className="text-accent-foreground">
                                {product.description}
                            </ProductDescription>
                        </ProductContent>
                        <CardFooter className="w-full p-0 flex-col items-start gap-8">
                            <span className="text-lg tracking-[1.29]">
                                $ {product.basePrice.toLocaleString()}
                            </span>
                            {defaultVariant && (
                                <AddToCart
                                    variantId={defaultVariant.id}
                                    name={product.name}
                                    price={
                                        product.basePrice +
                                        defaultVariant.priceDelta
                                    }
                                />
                            )}
                        </CardFooter>
                    </div>
                </ProductCard>

                <div className="grid gap-[inherit] xl:grid-cols-[2fr_1fr] xl:gap-24">
                    <section className="grid gap-6 text-pretty text-accent-foreground">
                        <h2 className="text-h3 text-secondary">FEATURES</h2>
                        {product.features.map((feature, i) => (
                            <p key={i}>{feature}</p>
                        ))}
                    </section>
                    <section className="flex flex-col md:flex-row xl:flex-col items-start gap-6 text-pretty text-accent-foreground">
                        <h2 className="text-h3 text-secondary w-full">
                            IN THE BOX
                        </h2>
                        <ul className="flex flex-col gap-2 w-full">
                            {box?.map((item, i) => (
                                <li key={i} className="flex gap-6">
                                    <span className="text-sm text-primary">
                                        {item.quantity}x
                                    </span>
                                    <span>{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {gallery && (
                    <div className="flex flex-col md:max-h-[368] xl:max-h-[592] gap-5 md:grid md:grid-cols-2 md:grid-rows-2">
                        <span className="block overflow-hidden rounded-xl">
                            <ResponsiveImage
                                mobileSrc={gallery.gallery1.mobile}
                                tabletSrc={gallery.gallery1.tablet}
                                desktopSrc={gallery.gallery1.desktop}
                                width={360}
                                height={720}
                                alt="gallery image"
                                className={cn(
                                    "block w-full h-[174px] object-cover md:h-full",
                                )}
                            />
                        </span>
                        <span className="block overflow-hidden rounded-xl row-span-2">
                            <ResponsiveImage
                                mobileSrc={gallery.gallery2.mobile}
                                tabletSrc={gallery.gallery2.tablet}
                                desktopSrc={gallery.gallery2.desktop}
                                width={360}
                                height={720}
                                alt="gallery image"
                                className={cn(
                                    "block w-full h-[174px] object-cover md:h-full",
                                )}
                            />
                        </span>
                        <span className="block overflow-hidden rounded-xl">
                            <ResponsiveImage
                                mobileSrc={gallery.gallery3.mobile}
                                tabletSrc={gallery.gallery3.tablet}
                                desktopSrc={gallery.gallery3.desktop}
                                width={360}
                                height={720}
                                alt="gallery image"
                                className={cn(
                                    "block w-full h-[368px] md:min-h-[174] md:h-full object-cover",
                                )}
                            />
                        </span>
                    </div>
                )}

                <div>
                    <h2 className="text-h3 text-center">YOU MAY ALSO LIKE</h2>
                    <p className="text-accent-foreground text-center mt-4">
                        Coming soon
                    </p>
                </div>
            </div>
        </div>
    );
}
