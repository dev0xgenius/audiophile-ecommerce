// TODO: Refactor through extraction
import { Button } from "@/components/ui/button";
import { CardFooter, CardHeader } from "@/components/ui/card";
import Counter from "@/components/ui/counter";

import {
    ProductAction,
    ProductCard,
    ProductContent,
    ProductDescription,
    ProductTitle,
} from "@/components/ui/product-card";

import ResponsiveImage from "@/components/ui/responsive-image";

import {
    xx99MarkIIHeadphoneMobile,
    xx99MarkIIHeadphoneTablet,
    xx99MarkIIHeadphoneDesktop,
} from "@/lib/img-exports";

import bestGearMobile from "@/assets/shared/mobile/image-best-gear.jpg";
import bestGearTablet from "@/assets/shared/tablet/image-best-gear.jpg";
import bestGearDesktop from "@/assets/shared/desktop/image-best-gear.jpg";

import { cn } from "@/lib/utils";

function DetailedInfo() {
    return (
        <div className="grid gap-[inherit] xl:grid-cols-[2fr_1fr] xl:gap-24">
            <section className="grid gap-6 text-pretty text-accent-foreground">
                <h2 className="text-h3 text-secondary">FEATURES</h2>
                <p>
                    Featuring a genuine leather head strap and premium earcups,
                    these headphones deliver superior comfort for those who like
                    to enjoy endless listening. It includes intuitive controls
                    designed for any situation. Whether you’re taking a business
                    call or just in your own personal space, the auto on/off and
                    pause features ensure that you’ll never miss a beat.
                </p>
                <p>
                    The advanced Active Noise Cancellation with built-in
                    equalizer allow you to experience your audio world on your
                    terms. It lets you enjoy your audio in peace, but quickly
                    interact with your surroundings when you need to. Combined
                    with Bluetooth 5. 0 compliant connectivity and 17 hour
                    battery life, the XX99 Mark II headphones gives you superior
                    sound, cutting-edge technology, and a modern design
                    aesthetic.
                </p>
            </section>
            <section className="flex flex-col md:flex-row xl:flex-col items-start gap-6 text-pretty text-accent-foreground">
                <h2 className="text-h3 text-secondary w-full">IN THE BOX</h2>
                <ul className="flex flex-col gap-2 w-full">
                    <li className="flex gap-6">
                        <span className="text-sm text-primary">1x</span>
                        <span>Headphone Unit</span>
                    </li>
                    <li className="flex gap-6">
                        <span className="text-sm text-primary">2x</span>
                        <span>Replacement Earcups</span>
                    </li>
                </ul>
            </section>
        </div>
    );
}

function Photo({
    className,
    blockClassName,
}: {
    className?: string;
    blockClassName?: string;
}) {
    return (
        <span
            className={cn("block overflow-hidden rounded-xl", blockClassName)}
        >
            <ResponsiveImage
                mobileSrc={bestGearMobile}
                tabletSrc={bestGearTablet}
                desktopSrc={bestGearDesktop}
                width={360}
                height={720}
                alt="random category photo"
                className={cn("block w-full h-[174px] object-cover", className)}
            />
        </span>
    );
}

function ImageGallery() {
    return (
        <div className="flex flex-col md:max-h-[368] xl:max-h-[592] gap-5 md:grid md:grid-cols-2 md:grid-rows-2">
            <Photo className="h-[174px] md:h-full" />
            <Photo
                className="h-[174px] md:h-full"
                blockClassName="row-span-2"
            />
            <Photo className="h-[368px] md:min-h-[174] md:h-full" />
        </div>
    );
}

function ProductRecommendations() {
    return (
        <div>
            <h2 className="text-h3 text-center">YOU MAY ALSO LIKE</h2>
            <ul className="md:grid md:grid-cols-3 md:gap-8">
                <li>
                    <ProductCard>
                        <ResponsiveImage
                            mobileSrc={bestGearMobile}
                            tabletSrc={bestGearTablet}
                            desktopSrc={bestGearDesktop}
                            className="rounded-xl"
                            alt=""
                        />
                        <ProductTitle>XX59</ProductTitle>
                        <ProductAction />
                    </ProductCard>
                </li>
                <li>
                    <ProductCard>
                        <ResponsiveImage
                            mobileSrc={bestGearMobile}
                            tabletSrc={bestGearTablet}
                            desktopSrc={bestGearDesktop}
                            className="rounded-xl"
                            alt=""
                        />
                        <ProductTitle>XX59</ProductTitle>
                        <ProductAction />
                    </ProductCard>
                </li>
                <li>
                    <ProductCard>
                        <ResponsiveImage
                            mobileSrc={bestGearMobile}
                            tabletSrc={bestGearTablet}
                            desktopSrc={bestGearDesktop}
                            className="rounded-xl"
                            alt=""
                        />
                        <ProductTitle>XX59</ProductTitle>
                        <ProductAction />
                    </ProductCard>
                </li>
            </ul>
        </div>
    );
}

export default function ProductPage() {
    return (
        <div className="leading-7 gap-6 p-6 py-2 flex flex-col items-start container mx-auto max-w-[1110]">
            <Button
                variant={"ghost"}
                className="text-accent-foreground font-normal p-0"
            >
                Go Back
            </Button>
            <div className="grid gap-[88px] md:gap-32">
                <ProductCard className="p-0 rounded-none items-start md:items-center gap-6 md:gap-16 xl:gap-[124.5] md:flex-row">
                    <CardHeader className="w-full p-0 gap-0">
                        <ResponsiveImage
                            mobileSrc={xx99MarkIIHeadphoneMobile}
                            tabletSrc={xx99MarkIIHeadphoneTablet}
                            desktopSrc={xx99MarkIIHeadphoneDesktop}
                            className=""
                            alt=""
                        />
                    </CardHeader>
                    <div className="flex flex-col gap-6 md:gap-8 w-full lg:justify-center">
                        <span className="text-overline text-primary text-xs">
                            NEW PRODUCT
                        </span>
                        <ProductContent className="text-left">
                            <ProductTitle className="text-h4 xl:text-h2">
                                {"xx99 mark ii headphones".toUpperCase()}
                            </ProductTitle>
                            <ProductDescription className="text-accent-foreground">
                                {`The new XX99 Mark II headphones is the pinnacle of pristine audio. It redefines your premium headphone experience by reproducing the balanced depth and precision of studio-quality sound.`}
                            </ProductDescription>
                        </ProductContent>
                        <CardFooter className="w-full p-0 flex-col items-start gap-8">
                            <span className="text-lg tracking-[1.29]">
                                $ 2,999
                            </span>
                            <div className="flex w-full gap-4">
                                <Counter />
                                <ProductAction text="ADD TO CART" />
                            </div>
                        </CardFooter>
                    </div>
                </ProductCard>
                <DetailedInfo />
                <ImageGallery />
                <ProductRecommendations />
            </div>
        </div>
    );
}
