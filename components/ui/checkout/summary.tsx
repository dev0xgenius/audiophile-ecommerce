import { cn, formatPrice } from "@/lib/utils";
import { Button } from "../button";
import { Card, CardContent, CardFooter, CardHeader } from "../card";
import {
    ProductCard,
    ProductContent,
    ProductImage,
    ProductTitle,
} from "../product-card";

import ProductCartImage from "@/assets/cart/image-xx99-mark-two-headphones.jpg";
import CartProductCard from "../cart-product-card";

const cartItems = [
    {
        id: 1,
        product: "xx99 mk ii",
        price: 2999,
        available: 1,
    },
    {
        id: 2,
        product: "xx99 mk ii",
        price: 200,
        available: 2,
    },
];

function PriceLabel({
    name,
    info,
    classes = { root: "", text: "", price: "" },
}: {
    name: string;
    info: string;
    classes?: {
        root?: string;
        text?: string;
        price?: string;
    };
}) {
    return (
        <div className={cn("flex items-center justify-between", classes.root)}>
            <span className={cn("text-accent-foreground", classes.text)}>
                {name}
            </span>
            <span className={cn(classes.price)}>{`$ ${info}`}</span>
        </div>
    );
}

function SummaryInfo() {
    return (
        <div className="w-full grid gap-2">
            <PriceLabel name="TOTAL" info="5,396" />
            <PriceLabel name="SHIPPING" info="50" />
            <PriceLabel name="VAT (INCLUDED)" info="1,079" />
            <PriceLabel
                name="GRAND TOTAL"
                info="5,446"
                classes={{ price: "text-primary", root: "mt-6" }}
            />
        </div>
    );
}

export default function CheckoutSummary() {
    return (
        <Card className="shadow-none gap-8 w-full border-none px-6 py-8 mb-24 rounded-xl">
            <CardHeader className="p-0">SUMMARY</CardHeader>
            <CardContent className="p-0 flex flex-col gap-6">
                {cartItems.map((cartItem) => (
                    <CartProductCard
                        image={ProductCartImage}
                        title={cartItem.product}
                        price={formatPrice(cartItem.price)}
                        count={cartItem.available}
                        hasCounter={false}
                        key={cartItem.id}
                    />
                ))}
            </CardContent>
            <CardFooter className="flex flex-col gap-8 p-0">
                <SummaryInfo />
                <Button
                    className="w-full"
                    size="lg"
                    onClick={() => console.log("Processing payment")}
                >
                    {"CONTINUE & PAY"}
                </Button>
            </CardFooter>
        </Card>
    );
}
