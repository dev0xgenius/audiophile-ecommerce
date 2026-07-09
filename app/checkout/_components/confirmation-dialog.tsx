import Image from "next/image";

import ProductXX99MK2 from "@/assets/cart/image-xx99-mark-two-headphones.jpg";
import ProductXX59 from "@/assets/cart/image-xx59-headphones.jpg";
import ProductYX1 from "@/assets/cart/image-yx1-earphones.jpg";
import confirmationImage from "@/assets/checkout/icon-order-confirmation.svg";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CartProductCard from "@/components/ui/cart-product-card";
import {
    DialogHeader,
    DialogFooter,
    DialogContent,
    DialogDescription,
    DialogTitle,
    Dialog,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const orderItems = [
    { image: ProductXX99MK2, title: "xx99 mk ii", price: 2999, count: 1 },
    { image: ProductXX59, title: "xx59", price: 899, count: 2 },
    { image: ProductYX1, title: "yx1", price: 599, count: 1 },
];

export default function ConfirmationDialog({
    isOpen = false,
}: {
    isOpen?: boolean;
}) {
    return (
        <Dialog modal={true} open={isOpen}>
            <DialogContent
                className="text-balance rounded-xl max-w-[540px]"
                showCloseButton={false}
                aria-describedby="dialog-description"
            >
                <DialogHeader className="gap-4">
                    <span>
                        <Image
                            src={confirmationImage}
                            width={64}
                            height={64}
                            alt=""
                        />
                    </span>
                    <DialogTitle className="text-h3 text-left">
                        THANK YOU FOR YOUR ORDER
                    </DialogTitle>
                    <DialogDescription className="text-left leading-6">
                        You will receive an email confirmation shortly.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-col gap-6">
                    <div className="rounded-xl overflow-hidden flex md:flex-row">
                        <div className="bg-gray p-6 flex-1">
                            <div className="grid gap-3">
                                {orderItems.map((item, i) => (
                                    <div key={i}>
                                        <CartProductCard
                                            image={item.image}
                                            title={item.title}
                                            price={formatPrice(item.price)}
                                            count={item.count}
                                        />
                                        {i < orderItems.length - 1 && <Separator className="mt-3" />}
                                    </div>
                                ))}
                                {orderItems.length > 1 && (
                                    <span className="text-center text-accent-foreground text-sm pt-2">
                                        and {orderItems.length - 1} other item(s)
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="bg-secondary flex flex-col justify-end p-6 md:w-[198px]">
                            <span className="text-accent-foreground text-sm">GRAND TOTAL</span>
                            <span className="text-white text-lg font-bold">$ 5,446</span>
                        </div>
                    </div>
                    <Button size="lg" asChild>
                        <Link href="/">BACK TO HOME</Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
