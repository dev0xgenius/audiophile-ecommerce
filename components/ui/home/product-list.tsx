import {
    ProductAction,
    ProductCard,
    ProductContent,
    ProductDescription,
    ProductTitle,
} from "../product-card";

import ResponsiveImage from "../responsive-image";

import EarphoneYX1ImageDesktop from "@/assets/home/desktop/image-earphones-yx1.jpg";
import EarphoneYX1ImageMobile from "@/assets/home/mobile/image-earphones-yx1.jpg";
import EarphoneYX1ImageTablet from "@/assets/home/tablet/image-earphones-yx1.jpg";

import SpeakerZX7ImageDesktop from "@/assets/home/desktop/image-speaker-zx7.jpg";
import SpeakerZX7ImageMobile from "@/assets/home/mobile/image-speaker-zx7.jpg";
import SpeakerZX7ImageTablet from "@/assets/home/tablet/image-speaker-zx7.jpg";

import SpeakerZX9ImageDesktop from "@/assets/home/desktop/image-speaker-zx9.png";
import SpeakerZX9ImageMobile from "@/assets/home/mobile/image-speaker-zx9.png";
import SpeakerZX9ImageTablet from "@/assets/home/tablet/image-speaker-zx9.png";

import PatternCircles from "@/components/pattern-circles";

export default function ProductList() {
    return (
        <ul className="grid gap-6 md:gap-8">
            <li>
                <ProductCard className="bg-primary text-white relative lg:flex-row lg:items-center lg:gap-16">
                    <div className="relative w-full flex justify-center items-center m-auto lg:w-1/2">
                        <PatternCircles className="absolute w-[558] md:w-max h-auto" />
                        <ResponsiveImage
                            mobileSrc={SpeakerZX9ImageMobile}
                            tabletSrc={SpeakerZX9ImageTablet}
                            desktopSrc={SpeakerZX9ImageDesktop}
                            className="w-auto h-auto relative z-10"
                            width={172.25}
                            height={207}
                            alt="image for the speaker category"
                        />
                    </div>
                    <ProductContent className="max-w-[350] w-full lg:text-left lg:items-start">
                        <ProductTitle className="px-5 pt-4 text-h1">
                            ZX9 SPEAKER
                        </ProductTitle>
                        <ProductDescription>
                            Upgrade to premium speakers that are phenomenally
                            built to deliver truly remarkable sound.
                        </ProductDescription>
                        <ProductAction className="bg-secondary" />
                    </ProductContent>
                </ProductCard>
            </li>
            <li>
                <ProductCard className="relative h-auto max-h-80 items-start p-0">
                    <ResponsiveImage
                        mobileSrc={SpeakerZX7ImageMobile}
                        tabletSrc={SpeakerZX7ImageTablet}
                        desktopSrc={SpeakerZX7ImageDesktop}
                        className="w-full h-full object-cover"
                        alt=""
                    />
                    <ProductContent className="absolute p-6 lg:w-1/2 lg:p-16 lg:justify-center">
                        <ProductTitle className="text-h4">
                            ZX7 SPEAKER
                        </ProductTitle>
                        <ProductAction variant={"outline"} />
                    </ProductContent>
                </ProductCard>
            </li>
            <li>
                <ProductCard className="p-0 md:max-h-80 items-stretch shadow-none md:flex-row md:gap-3">
                    <ResponsiveImage
                        mobileSrc={EarphoneYX1ImageMobile}
                        tabletSrc={EarphoneYX1ImageTablet}
                        desktopSrc={EarphoneYX1ImageDesktop}
                        alt=""
                        className="rounded-2xl md:w-1/2"
                    />
                    <ProductContent className="flex items-start rounded-2xl gap-8 p-6 py-10 bg-off-white md:w-1/2 md:p-[51px] md:justify-center">
                        <ProductTitle className="text-h4">
                            YX1 EARPHONES
                        </ProductTitle>
                        <ProductAction variant={"outline"} />
                    </ProductContent>
                </ProductCard>
            </li>
        </ul>
    );
}
