import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
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
import ProductRecommendations from "@/components/ui/product-recommendations";
import { getProductRecommendations } from "@/lib/recommendations";

interface MediaAssetLike {
    url: string;
    variants: unknown;
}

function getAssetSrc(asset: MediaAssetLike | null | undefined): string {
    if (!asset) return "";
    const variants = asset.variants as Record<
        string,
        { webp?: string; original?: string }
    > | null;
    if (variants?.desktop?.webp) return variants.desktop.webp;
    if (variants?.desktop?.original) return variants.desktop.original;
    return asset.url;
}

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
            media: {
                include: { mediaAsset: true },
                orderBy: [{ purpose: "asc" }, { displayOrder: "asc" }],
            },
        },
    });

    if (!product) notFound();

    const recommendations = await getProductRecommendations({
        productId: product.id,
        categoryId: product.categoryId,
    }).catch((error) => {
        console.error("Failed to load product recommendations", error);
        return [];
    });

    const detailRows = product.media.filter(
        (m) => m.purpose === "default" && m.isPrimary,
    );
    const assetForSize = (size: "mobile" | "tablet" | "desktop") =>
        detailRows.find((m) =>
            m.mediaAsset?.folder?.endsWith(`/${size}`),
        )?.mediaAsset ??
        detailRows.map((m) => m.mediaAsset)[0] ??
        null;

    const heroSrc = {
        mobile: getAssetSrc(assetForSize("mobile")),
        tablet: getAssetSrc(assetForSize("tablet")),
        desktop: getAssetSrc(assetForSize("desktop")),
    };

    const galleryRows = product.media.filter(
        (m) => m.purpose === "gallery",
    );
    const galleryAsset = (
        order: number,
        size: "mobile" | "tablet" | "desktop",
    ) =>
        galleryRows.find(
            (r) =>
                r.displayOrder === order &&
                r.mediaAsset?.folder?.endsWith(`/${size}`),
        )?.mediaAsset ??
        galleryRows.find((r) => r.displayOrder === order)?.mediaAsset ??
        null;

    const defaultVariant = product.variants[0];
    const box = product.box as Array<{ name: string; quantity: number }> | null;

    const cartAsset = product.media.find((m) => m.purpose === "cart")
        ?.mediaAsset;
    const cartVariants = cartAsset?.variants as Record<
        string,
        { webp?: string; original?: string }
    > | null;
    const cartImage = cartVariants?.thumbnail?.webp ??
        cartVariants?.thumbnail?.original ??
        cartAsset?.url;

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
                        {heroSrc.mobile && (
                            <ResponsiveImage
                                mobileSrc={heroSrc.mobile}
                                tabletSrc={heroSrc.tablet}
                                desktopSrc={heroSrc.desktop}
                                fill
                                className="block relative w-full rounded-xl overflow-hidden bg-gray aspect-square md:aspect-[281/480] lg:aspect-[540/560]"
                                imageClassName="object-cover"
                                alt={product.name}
                                loading="eager"
                                priority
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
                                    image={cartImage}
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

                {galleryRows.length >= 3 && (
                    <div className="flex flex-col md:max-h-[368] xl:max-h-[592] gap-5 md:grid md:grid-cols-2 md:grid-rows-2">
                        <span className="block overflow-hidden rounded-xl bg-gray">
                            <ResponsiveImage
                                mobileSrc={getAssetSrc(
                                    galleryAsset(1, "mobile"),
                                )}
                                tabletSrc={getAssetSrc(
                                    galleryAsset(1, "tablet"),
                                )}
                                desktopSrc={getAssetSrc(
                                    galleryAsset(1, "desktop"),
                                )}
                                fill
                                alt="gallery image"
                                className="block relative w-full aspect-[327/184] md:h-full"
                                imageClassName="object-cover"
                            />
                        </span>
                        <span className="block overflow-hidden rounded-xl bg-gray row-span-2">
                            <ResponsiveImage
                                mobileSrc={getAssetSrc(
                                    galleryAsset(2, "mobile"),
                                )}
                                tabletSrc={getAssetSrc(
                                    galleryAsset(2, "tablet"),
                                )}
                                desktopSrc={getAssetSrc(
                                    galleryAsset(2, "desktop"),
                                )}
                                fill
                                alt="gallery image"
                                className="block relative w-full aspect-[327/368] md:h-full"
                                imageClassName="object-cover"
                            />
                        </span>
                        <span className="block overflow-hidden rounded-xl bg-gray">
                            <ResponsiveImage
                                mobileSrc={getAssetSrc(
                                    galleryAsset(3, "mobile"),
                                )}
                                tabletSrc={getAssetSrc(
                                    galleryAsset(3, "tablet"),
                                )}
                                desktopSrc={getAssetSrc(
                                    galleryAsset(3, "desktop"),
                                )}
                                fill
                                alt="gallery image"
                                className="block relative w-full aspect-[327/184] md:h-full"
                                imageClassName="object-cover"
                            />
                        </span>
                    </div>
                )}

                <ProductRecommendations recommendations={recommendations} />
            </div>
        </div>
    );
}
