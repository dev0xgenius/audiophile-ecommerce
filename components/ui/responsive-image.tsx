"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";

interface ResponsiveImageProps
    extends Omit<React.ComponentProps<typeof Image>, "src"> {
    mobileSrc: string | StaticImageData;
    tabletSrc: string | StaticImageData;
    desktopSrc: string | StaticImageData;
}

export default function ResponsiveImage({
    mobileSrc,
    tabletSrc,
    desktopSrc,
    alt = "",
    ...props
}: ResponsiveImageProps) {
    const [currentSrc, setCurrentSrc] = useState<string | StaticImageData>(
        desktopSrc,
    );

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) setCurrentSrc(mobileSrc);
            else if (width < 1024) setCurrentSrc(tabletSrc);
            else setCurrentSrc(desktopSrc);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [mobileSrc, tabletSrc, desktopSrc]);

    return <Image src={currentSrc} alt={alt} {...props} />;
}
