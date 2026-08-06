"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ImageFallback from "./image-fallback";
import type { StaticImageData } from "next/image";

interface ResponsiveImageProps extends Omit<
    React.ComponentProps<typeof Image>,
    "src" | "width" | "height"
> {
    imageClassName?: string;
    mobileSrc: string | StaticImageData;
    tabletSrc: string | StaticImageData;
    desktopSrc: string | StaticImageData;
    width?: number;
    height?: number;
}

export default function ResponsiveImage({
    mobileSrc,
    tabletSrc,
    desktopSrc,
    alt = "",
    className,
    imageClassName,
    width,
    height,
    ...props
}: ResponsiveImageProps) {
    const [failed, setFailed] = useState(false);

    const getSrc = (src: string | StaticImageData) =>
        typeof src === "string" ? src : src.src;

    const isValid = (src: string | StaticImageData) =>
        typeof src === "string" ? src.trim() !== "" : true;

    const sources = [
        { src: desktopSrc, media: "(min-width: 1024px)" },
        { src: tabletSrc, media: "(min-width: 768px)" },
        { src: mobileSrc },
    ];

    const validSources = sources.filter((s) => isValid(s.src));
    const baseSrc =
        validSources.find((s) => !s.media)?.src ?? validSources[0]?.src;

    const imageClass = cn(
        "w-full max-w-full h-auto object-contain",
        imageClassName,
    );

    if (!baseSrc || failed) {
        return (
            <ImageFallback
                className={cn(
                    props.fill ? "h-full" : "w-full max-w-full h-auto",
                    imageClassName,
                )}
            />
        );
    }

    const needsDimensions =
        typeof baseSrc === "string" && !width && !props.fill;

    return (
        <picture className={cn("block", className)}>
            {validSources.map((s) =>
                s.media ? (
                    <source key={s.media} media={s.media} srcSet={getSrc(s.src)} />
                ) : null,
            )}
            <Image
                src={getSrc(baseSrc)}
                alt={alt}
                width={needsDimensions ? 540 : width}
                height={needsDimensions ? 540 : height}
                className={imageClass}
                onError={() => setFailed(true)}
                {...props}
            />
        </picture>
    );
}
