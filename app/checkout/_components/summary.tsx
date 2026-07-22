import { cn, formatPrice } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import type { CartItem } from "@/lib/cart";
import { getCartTotal } from "@/lib/cart";

function PriceLabel({
    name,
    info,
    classes = { root: "", text: "", price: "" },
}: {
    name: string;
    info: string;
    classes?: { root?: string; text?: string; price?: string };
}) {
    return (
        <div className={cn("flex items-center justify-between", classes.root)}>
            <span className={cn("text-accent-foreground", classes.text)}>{name}</span>
            <span className={cn(classes.price)}>{`$ ${info}`}</span>
        </div>
    );
}

export default function CheckoutSummary({
    items,
    submitting,
}: {
    items: CartItem[];
    submitting: boolean;
}) {
    const subtotal = getCartTotal(items);
    const shippingCost = subtotal >= 5000 ? 0 : 50;
    const taxAmount = Math.round((subtotal + shippingCost) * 0.08 * 100) / 100;
    const grandTotal = subtotal + shippingCost + taxAmount;

    return (
        <Card className="shadow-none gap-8 w-full border-0 px-6 py-8 mb-24 rounded-xl h-fit">
            <CardHeader className="p-0 text-lg font-bold tracking-wider">
                SUMMARY
            </CardHeader>
            <CardContent className="p-0 flex flex-col gap-6">
                {items.length === 0 && (
                    <p className="text-accent-foreground text-sm">Your cart is empty</p>
                )}
                {items.map((item) => (
                    <div key={item.variantId} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-accent-foreground">x{item.quantity}</span>
                        </div>
                        <span className="tabular-nums">{formatPrice(item.price)}</span>
                    </div>
                ))}
            </CardContent>
            <CardFooter className="flex flex-col gap-8 p-0">
                <div className="w-full grid gap-2">
                    <PriceLabel name="TOTAL" info={subtotal.toLocaleString()} />
                    <PriceLabel name="SHIPPING" info={shippingCost.toLocaleString()} />
                    <PriceLabel name="VAT (INCLUDED)" info={taxAmount.toLocaleString()} />
                    <PriceLabel
                        name="GRAND TOTAL"
                        info={grandTotal.toLocaleString()}
                        classes={{ price: "text-primary", root: "mt-6" }}
                    />
                </div>
                <Button className="w-full" size="lg" type="submit" disabled={submitting || items.length === 0}>
                    {submitting ? "PROCESSING..." : "CONTINUE & PAY"}
                </Button>
            </CardFooter>
        </Card>
    );
}
