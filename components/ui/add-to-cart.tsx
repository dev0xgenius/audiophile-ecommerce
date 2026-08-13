"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";

export function AddToCart({
    variantId,
    name,
    price,
    image,
}: {
    variantId: string;
    name: string;
    price: number;
    image?: string;
}) {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="flex w-full gap-4">
            <span className="flex justify-between items-center bg-gray w-[120px] h-12">
                <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex-1 h-full text-sm font-bold tracking-widest uppercase text-accent-foreground hover:text-primary transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-ring rounded-sm outline-none"
                    aria-label="Decrease quantity"
                >
                    -
                </button>
                <span className="text-sm font-bold tracking-widest">
                    {quantity}
                </span>
                <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex-1 h-full text-sm font-bold tracking-widest uppercase text-accent-foreground hover:text-primary transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-ring rounded-sm outline-none"
                    aria-label="Increase quantity"
                >
                    +
                </button>
            </span>
            <Button
                size="lg"
                className="w-max"
                onClick={() => {
                    addToCart({ variantId, name, price, quantity, image });
                    toast.success(`${name} added to cart`);
                }}
            >
                ADD TO CART
            </Button>
        </div>
    );
}
