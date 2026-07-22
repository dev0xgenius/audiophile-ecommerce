import { cn } from "@/lib/utils";
import Image from "next/image";
import type { StaticImageData } from "next/image";

interface ResponsiveImageProps extends Omit<
    React.ComponentProps<typeof Image>,
    "src"
> {
    mobileSrc: string | StaticImageData;
    tabletSrc: string | StaticImageData;
    desktopSrc: string | StaticImageData;
}

export default function ResponsiveImage({
    mobileSrc,
    tabletSrc,
    desktopSrc,
    alt = "",
    className,
    ...props
}: ResponsiveImageProps) {
    const getSrc = (src: string | StaticImageData) =>
        typeof src === "string" ? src : src.src;

    return (
        <picture className={cn(className)}>
            <source media="(min-width: 1024px)" srcSet={getSrc(desktopSrc)} />
            <source media="(min-width: 768px)" srcSet={getSrc(tabletSrc)} />
            <Image src={mobileSrc} alt={alt} {...props} />
        </picture>
    );
}
