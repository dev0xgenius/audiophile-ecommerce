import { Card, CardContent, CardTitle } from "./card";

import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./button";

function ProductCard({ className, children }: React.ComponentProps<"div">) {
    return (
        <Card
            className={cn(
                "p-14 px-6 shadow-none border-0 justify-center items-center rounded-xl overflow-hidden",
                className,
            )}
        >
            {children}
        </Card>
    );
}

function ProductContent({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <CardContent
            className={cn(
                "text-center p-0 w-full [align-items:inherit] flex flex-col gap-8 z-10",
                className,
            )}
            {...props}
        />
    );
}

function ProductImage({
    src,
    className,
    width,
    height,
}: React.ComponentProps<typeof Image>) {
    return (
        <Image
            src={src}
            width={width || 360}
            height={height || 360}
            alt=""
            className={cn("w-full block", className)}
        />
    );
}

function ProductTitle({
    className,
    children,
}: React.ComponentProps<typeof CardTitle>) {
    return (
        <CardTitle className={cn("text-h2 font-semibold", className)}>
            {children}
        </CardTitle>
    );
}

function ProductDescription({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return <div className={className} {...props}></div>;
}

function ProductAction({
    text,
    className,
    href,
    ...props
}: { text?: string; href?: string } & React.ComponentProps<typeof Button>) {
    if (href) {
        return (
            <Button asChild size="lg" className={cn("font-semibold tracking-widest", className)} {...props}>
                <Link href={href}>{text || "SEE PRODUCT"}</Link>
            </Button>
        );
    }

    return (
        <Button
            {...props}
            size="lg"
            className={cn("font-semibold tracking-widest", className)}
        >
            {text || "SEE PRODUCT"}
        </Button>
    );
}

export {
    ProductAction,
    ProductCard,
    ProductContent,
    ProductDescription,
    ProductImage,
    ProductTitle,
};
