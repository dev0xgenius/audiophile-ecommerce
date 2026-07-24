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
import { cn } from "@/lib/utils";

interface AssetWithUrl {
    url: string;
    variants: Record<string, { webp?: string; original?: string }> | null;
}

function getAssetUrl(asset: AssetWithUrl | null | undefined, size: string): string {
    if (!asset) return "";
    if (asset.variants?.[size]?.original) return asset.variants[size].original;
    if (asset.variants?.[size]?.webp) return asset.variants[size].webp;
    if (asset.variants?.desktop?.original) return asset.variants.desktop.original;
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

    const detailMedia = product.media
        .filter((m) => m.purpose === "default" && m.isPrimary)
        .map((m) => m.mediaAsset)[0];

    const gallery = product.media
        .filter((m) => m.purpose === "gallery")
        .map((m) => m.mediaAsset);

    const defaultVariant = product.variants[0];
    const box = product.box as Array<{ name: string; quantity: number }> | null;

    const detailAsset = detailMedia
        ? { url: detailMedia.url, variants: detailMedia.variants as Record<string, { webp?: string; original?: string }> | null }
        : null;

    const galleryAssets = gallery.map((g) => ({
        url: g.url,
        variants: g.variants as Record<string, { webp?: string; original?: string }> | null,
    }));

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
                        {detailAsset && (
                            <ResponsiveImage
                                mobileSrc={getAssetUrl(detailAsset, "mobile")}
                                tabletSrc={getAssetUrl(detailAsset, "tablet")}
                                desktopSrc={getAssetUrl(detailAsset, "desktop")}
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

                {galleryAssets.length >= 3 && (
                    <div className="flex flex-col md:max-h-[368] xl:max-h-[592] gap-5 md:grid md:grid-cols-2 md:grid-rows-2">
                        <span className="block overflow-hidden rounded-xl">
                            <ResponsiveImage
                                mobileSrc={getAssetUrl(galleryAssets[0], "mobile")}
                                tabletSrc={getAssetUrl(galleryAssets[0], "tablet")}
                                desktopSrc={getAssetUrl(galleryAssets[0], "desktop")}
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
                                mobileSrc={getAssetUrl(galleryAssets[1], "mobile")}
                                tabletSrc={getAssetUrl(galleryAssets[1], "tablet")}
                                desktopSrc={getAssetUrl(galleryAssets[1], "desktop")}
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
                                mobileSrc={getAssetUrl(galleryAssets[2], "mobile")}
                                tabletSrc={getAssetUrl(galleryAssets[2], "tablet")}
                                desktopSrc={getAssetUrl(galleryAssets[2], "desktop")}
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
