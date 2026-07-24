"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import { Counter } from "./counter";
import type { CartItem } from "@/lib/cart";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./dialog";
import {
    getCart,
    clearCart,
    getCartTotal,
    removeFromCart,
    updateQuantity,
} from "@/lib/cart";

function CartItemRow({ item }: { item: CartItem }) {
    return (
        <div className="flex items-center gap-4">
            <div className="size-16 rounded-lg bg-gray flex items-center justify-center shrink-0 overflow-hidden">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-cover"
                    />
                ) : (
                    <span className="text-xs text-accent-foreground">
                        No img
                    </span>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">
                    {item.name.toUpperCase()}
                </p>
                <p className="text-sm text-accent-foreground">
                    $ {item.price.toLocaleString()}
                </p>
            </div>
            <Counter
                value={item.quantity}
                onChange={(q: number) => {
                    if (q <= 0) {
                        removeFromCart(item.variantId);
                    } else {
                        updateQuantity(item.variantId, q);
                    }
                }}
                className="h-8"
            />
        </div>
    );
}

export default function CartDialog() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [open, setOpen] = useState(false);

    const refresh = () => setItems(getCart());

    useEffect(() => {
        if (open) {
            setTimeout(refresh, 50);
        }
    }, [open]);

    const total = getCartTotal(items);
    const count = items.reduce((s, i) => s + i.quantity, 0);

    return (
        <Dialog modal={true} open={open} onOpenChange={setOpen}>
            <DialogTrigger className="cursor-pointer hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring rounded-md transition-opacity outline-none">
                <Image
                    src="/icon-cart.svg"
                    width={24}
                    height={24}
                    alt="Open cart"
                    className="w-auto h-auto"
                />
            </DialogTrigger>
            <DialogContent
                showCloseButton={true}
                className="rounded-2xl gap-8"
                aria-describedby="cart-dialog-title"
            >
                <DialogHeader
                    className="flex-row items-center justify-between"
                    id="cart-dialog-title"
                >
                    <DialogTitle>CART ({count})</DialogTitle>
                    {items.length > 0 && (
                        <Button
                            variant="ghost"
                            className="text-accent-foreground outline-none"
                            onClick={() => {
                                clearCart();
                                refresh();
                            }}
                        >
                            <span className="border-b border-b-accent-foreground">
                                Remove All
                            </span>
                        </Button>
                    )}
                </DialogHeader>

                {items.length === 0 ? (
                    <p className="text-center text-accent-foreground py-8">
                        Your cart is empty
                    </p>
                ) : (
                    <ul className="flex gap-6 flex-col">
                        {items.map((item) => (
                            <li
                                key={item.variantId}
                                className="flex items-center gap-4"
                            >
                                <CartItemRow item={item} />
                            </li>
                        ))}
                    </ul>
                )}

                <div className="grid gap-6">
                    <div className="flex justify-between">
                        <span className="text-accent-foreground">TOTAL</span>
                        <span className="font-bold">
                            $ {total.toLocaleString()}
                        </span>
                    </div>
                    <Button
                        size="lg"
                        className="w-full"
                        disabled={items.length === 0}
                        asChild
                    >
                        <Link href="/checkout" onClick={() => setOpen(false)}>
                            CHECKOUT
                        </Link>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
