import Image from "next/image";
import { Button } from "./button";
import { CardFooter } from "./card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./dialog";
import {
	ProductCard,
	ProductContent,
	ProductImage,
	ProductTitle,
} from "./product-card";

import ProductCartImage from "@/assets/cart/image-xx99-mark-two-headphones.jpg";
import Counter from "./counter";

function CartList() {
	return (
		<ul className="flex gap-6 flex-col">
			<li>
				<ProductCard className="flex-row justify-evenly gap-4 p-0 rounded-none">
					<ProductImage
						src={ProductCartImage}
						alt="cart product item"
						className="rounded-2xl"
					/>
					<ProductContent className="p-0 gap-0 text-left items-start">
						<ProductTitle className="text-base font-normal tracking-normal">
							XX99 MK II
						</ProductTitle>
						<span className="text-accent-foreground">$2,999</span>
					</ProductContent>
					<CardFooter className="p-0">
						<Counter className="py-2 px-3" />
					</CardFooter>
				</ProductCard>
			</li>
		</ul>
	);
}

export default function CartDialog() {
	return (
		<Dialog modal={true}>
			<DialogTrigger>
				<Image src="/icon-cart.svg" width={24} height={24} alt="cart icon" />
			</DialogTrigger>
			<DialogContent
				className="rounded-2xl gap-8"
				showCloseButton={false}
				aria-describedby="User's Cart"
			>
				<DialogHeader className="flex-row items-center justify-between">
					<DialogTitle>CART (3)</DialogTitle>
					<Button
						variant={"ghost"}
						className="text-accent-foreground outline-none"
					>
						<span className="border-b border-b-accent-foreground">
							Remove All
						</span>
					</Button>
				</DialogHeader>
				<CartList />
				<div className="grid gap-6">
					<div className="flex justify-between">
						<span className="text-accent-foreground">TOTAL</span>
						<span>$ 5,396</span>
					</div>
					<Button size={"lg"} className="w-full">
						CHECKOUT
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
