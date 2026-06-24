"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ImageHeaderMobile from "@/assets/home/mobile/image-header.jpg";
import ImageHeaderTablet from "@/assets/home/tablet/image-header.jpg";
import ImageHeaderDesktop from "@/assets/home/desktop/image-hero.jpg";

export default function HeaderImage() {
    const [currentSrc, setCurrentSrc] = useState<string>(ImageHeaderDesktop.src);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) setCurrentSrc(ImageHeaderMobile.src);
            else if (width < 1024) setCurrentSrc(ImageHeaderTablet.src);
            else setCurrentSrc(ImageHeaderDesktop.src);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Image
            width={1240}
            height={720}
            src={currentSrc}
            alt="A Headset"
            className="w-full h-auto block object-cover overscroll-contain"
        />
    );
}
