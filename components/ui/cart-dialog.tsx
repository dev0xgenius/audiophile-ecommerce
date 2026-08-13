"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import { Counter } from "./counter";
import { useIsMobile } from "@/hooks/use-mobile";
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
import ImageFallback from "./image-fallback";

const emptySubscribe = () => () => {};

function useMounted() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );
}

function CartThumb({ src, alt }: { src?: string; alt: string }) {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <ImageFallback className="size-16 rounded-lg shrink-0 overflow-hidden" />
        );
    }

    return (
        <div className="size-16 rounded-lg bg-gray flex items-center justify-center shrink-0 overflow-hidden">
            <Image
                src={src}
                alt={alt}
                width={64}
                height={64}
                className="object-cover"
                onError={() => setFailed(true)}
            />
        </div>
    );
}

function CartItemRow({ item }: { item: CartItem }) {
    return (
        <div className="flex items-center gap-4">
            <CartThumb src={item.image} alt={item.name} />
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
    const mounted = useMounted();
    const isMobile = useIsMobile();

    const refresh = () => setItems(getCart());

    useEffect(() => {
        if (open) {
            setTimeout(refresh, 50);
        }
    }, [open]);

    const total = getCartTotal(items);
    const count = items.reduce((s, i) => s + i.quantity, 0);

    if (!mounted) {
        return (
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open cart"
                className="cursor-pointer hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring rounded-md transition-opacity outline-none bg-transparent border-0 p-0"
            >
                <Image
                    src="/icon-cart.svg"
                    width={24}
                    height={24}
                    alt="Open cart"
                    className="w-auto h-auto"
                />
            </button>
        );
    }

    return (
        <Dialog modal={isMobile} open={open} onOpenChange={setOpen}>
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
                className="rounded-2xl gap-8 md:top-[6.25rem] md:left-auto md:right-6 md:translate-x-0 md:translate-y-0 md:w-[377px] md:max-w-[377px] xl:right-[calc((100vw-1110px)/2)] md:max-h-[calc(100dvh-8rem)] md:overflow-y-auto"
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
