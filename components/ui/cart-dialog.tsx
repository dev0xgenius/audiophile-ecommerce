import Image from "next/image";
import { Button } from "./button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./dialog";

import ProductCartImage from "@/assets/cart/image-xx99-mark-two-headphones.jpg";

import Link from "next/link";
import CartProductCard from "./cart-product-card";

function CartList() {
    return (
        <ul className="flex gap-6 flex-col">
            <li>
                <CartProductCard
                    image={ProductCartImage}
                    title="XX99 MK II"
                    price={"$2,999"}
                    count={4}
                    hasCounter={true}
                />
            </li>
        </ul>
    );
}

export default function CartDialog() {
    return (
        <Dialog modal={true}>
            <DialogTrigger className="cursor-pointer hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring rounded-md transition-opacity outline-none">
                <Image
                    src="/icon-cart.svg"
                    width={24}
                    height={24}
                    alt="cart icon"
                    className="w-auto h-auto"
                />
            </DialogTrigger>
            <DialogContent
                showCloseButton={false}
                className="rounded-2xl gap-8"
                aria-describedby="dialog-title"
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
                        <Link href="/checkout">CHECKOUT</Link>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
