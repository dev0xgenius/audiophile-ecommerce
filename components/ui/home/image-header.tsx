import Image from "next/image";
import ImageHeaderMobile from "@/assets/home/mobile/image-header.jpg";
import ImageHeaderTablet from "@/assets/home/tablet/image-header.jpg";
import ImageHeaderDesktop from "@/assets/home/desktop/image-hero.jpg";
import { cn } from "@/lib/utils";

export default function HeaderImage({ className }: { className?: string }) {
    return (
        <picture className={cn(className)}>
            <source
                media="(min-width: 1024px)"
                srcSet={ImageHeaderDesktop.src}
            />
            <source media="(min-width: 768px)" srcSet={ImageHeaderTablet.src} />
            <Image
                priority
                width={1240}
                height={720}
                src={ImageHeaderMobile}
                alt="A Headset"
                className="w-full h-full left-0 object-cover"
            />
        </picture>
    );
}
