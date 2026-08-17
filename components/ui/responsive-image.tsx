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

    const isStaticImageData = (
        src: string | StaticImageData,
    ): src is StaticImageData =>
        typeof src === "object" && src !== null && "width" in src;

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

    const intrinsic =
        isStaticImageData(baseSrc) && !props.fill
            ? { width: baseSrc.width, height: baseSrc.height }
            : undefined;

    const imageWidth =
        width ??
        intrinsic?.width ??
        (typeof baseSrc === "string" && !props.fill ? 540 : undefined);
    const imageHeight =
        height ??
        intrinsic?.height ??
        (typeof baseSrc === "string" && !props.fill ? 540 : undefined);

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
                width={imageWidth}
                height={imageHeight}
                className={imageClass}
                onError={() => setFailed(true)}
                {...props}
            />
        </picture>
    );
}
