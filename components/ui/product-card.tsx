import { Card, CardContent, CardTitle } from "./card";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./button";

function ProductCard({ className, children }: React.ComponentProps<"div">) {
	return (
		<Card
			className={cn(
				"p-14 px-6 shadow-none border-none justify-center items-center rounded-2xl overflow-hidden",
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
				"w-full  [align-items:inherit] flex flex-col gap-6 z-10",
				className,
			)}
			{...props}
		/>
	);
}

function ProductImage({ src, className }: React.ComponentProps<typeof Image>) {
	return (
		<Image
			src={src}
			width={360}
			height={360}
			alt=""
			className={cn("w-max block", className)}
		/>
	);
}

function ProductTitle({
	className,
	children,
}: React.ComponentProps<typeof CardTitle>) {
	return (
		<CardTitle className={cn("text-4xl font-semibold", className)}>
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
	...props
}: { text?: string } & React.ComponentProps<typeof Button>) {
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
