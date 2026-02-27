import { Button } from "@/components/ui/button";
import { CardFooter, CardHeader } from "@/components/ui/card";
import Counter from "@/components/ui/counter";

import {
    ProductAction,
    ProductCard,
    ProductContent,
    ProductDescription,
    ProductImage,
    ProductTitle,
} from "@/components/ui/product-card";

import Image from "next/image";

import { xx99MarkIIHeadphone } from "@/lib/img-exports";
import { cn } from "@/lib/utils";

function DetailedInfo() {
    return (
        <div className="grid gap-[inherit]">
            <section className="grid gap-6 text-pretty text-accent-foreground">
                <h2 className="text-2xl text-black">FEATURES</h2>
                <p className="">
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
            <section className="grid gap-6 text-pretty text-accent-foreground">
                <h2 className="text-2xl text-black"> IN THE BOX</h2>
                <ul className="grid gap-2">
                    <li className="flex gap-6">
                        <span className="text-sm">1x</span>
                        <span>Headphone Unit</span>
                    </li>
                    <li className="flex gap-6">
                        <span>2x</span>
                        <span>Replacement Earcups</span>
                    </li>
                </ul>
            </section>
        </div>
    );
}

function Photo({ className }: { className?: string }) {
    return (
        <span className="block overflow-hidden rounded-2xl">
            <Image
                src="/shared/mobile/image-best-gear.jpg"
                width={360}
                height={720}
                alt="random category photo"
                className={cn("block w-full h-[174px]", className)}
            />
        </span>
    );
}

function ImageGallery() {
    return (
        <div className="flex flex-col gap-5">
            <Photo />
            <Photo />
            <Photo className="h-[368px]" />
        </div>
    );
}

function ProductRecommendations() {
    return (
        <div>
            <h2 className="text-2xl text-black text-center">
                YOU MAY ALSO LIKE
            </h2>
            <ul>
                <li>
                    <ProductCard>
                        <ProductImage
                            src={"/shared/mobile/image-best-gear.jpg"}
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
        <div className="leading-7 gap-6 p-6 py-2 flex flex-col items-start">
            <Button
                variant={"ghost"}
                className="text-accent-foreground font-normal p-0"
            >
                Go Back
            </Button>
            <div className="grid gap-[88]">
                <ProductCard className="p-0 rounded-none items-start gap-6">
                    <CardHeader className="w-full p-0 gap-[inherit]">
                        <ProductImage src={xx99MarkIIHeadphone} alt="" />
                        <span className="text-sm tracking-[10px] text-primary">
                            NEW PRODUCT
                        </span>
                    </CardHeader>
                    <ProductContent className="text-left">
                        <ProductTitle className="font-light">
                            {"xx99 mark ii headphones".toUpperCase()}
                        </ProductTitle>
                        <ProductDescription className="text-accent-foreground">
                            {`The new XX99 Mark II headphones is the pinnacle of pristine audio. It redefines your premium headphone experience by reproducing the balanced depth and precision of studio-quality sound.`}
                        </ProductDescription>
                    </ProductContent>
                    <CardFooter className="w-full p-0 flex-col items-start gap-8">
                        <span className="text-lg tracking-[1.29]">$ 2,999</span>
                        <div className="flex w-full gap-4">
                            <Counter />
                            <ProductAction />
                        </div>
                    </CardFooter>
                </ProductCard>
                <DetailedInfo />
                <ImageGallery />
                <ProductRecommendations />
            </div>
        </div>
    );
}
