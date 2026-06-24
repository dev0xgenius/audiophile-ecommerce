import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardContent,
} from "../card";

import ResponsiveImage from "../responsive-image";
import bestGearMobile from "@/assets/shared/mobile/image-best-gear.jpg";
import bestGearTablet from "@/assets/shared/tablet/image-best-gear.jpg";
import bestGearDesktop from "@/assets/shared/desktop/image-best-gear.jpg";

export default function AboutInfo() {
    return (
        <Card className="p-0 shadow-none border-0 text-center mt-20 md:mt-[120] gap-8 md:gap-16 lg:flex-row-reverse lg:text-left lg:items-center lg:gap-24">
            <CardHeader className="p-0 lg:w-1/2">
                <CardDescription className="overflow-hidden rounded-2xl">
                    <ResponsiveImage
                        mobileSrc={bestGearMobile}
                        tabletSrc={bestGearTablet}
                        desktopSrc={bestGearDesktop}
                        width={360}
                        height={720}
                        className="w-full"
                        alt="Man with quality headphones"
                    />
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col p-0 md:px-14 gap-8 lg:w-1/2 lg:px-0">
                <CardTitle className="font-semibold text-h4 md:text-h2">
                    BRINGING YOU THE <span className="text-primary">BEST</span>{" "}
                    AUDIO GEAR
                </CardTitle>
                <p className="text-balance block text-accent-foreground tracking-tighter">
                    Located at the heart of New York City. Audiophile is the
                    premier store for high end headphones, earphones, speakers,
                    and audio accessories. We have a large showroom and luxury
                    demonstration rooms available for you to browse and
                    experience a wide range of our products. Stop by our store
                    to meet some of the fantastic people who make Audiophile the
                    best place to buy your portable audio equipment.
                </p>
            </CardContent>
        </Card>
    );
}
