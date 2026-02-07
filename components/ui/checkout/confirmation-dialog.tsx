import { Card } from "../card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../dialog";
import Image from "next/image";

import confirmationImage from "@/assets/checkout/icon-order-confirmation.svg";
import ProductCartImage from "@/assets/cart/image-xx59-headphones.jpg";
import CartProductCard from "../cart-product-card";
import { priceFormatter } from "@/lib/utils";
import { Separator } from "../separator";
import { Button } from "../button";

export default function ConfirmationDialog({
    isOpen = false,
}: {
    isOpen?: boolean;
}) {
    return (
        <Dialog modal={true} open={isOpen}>
            <DialogContent className="text-balance">
                <DialogHeader className="gap-4">
                    <span>
                        <Image
                            src={confirmationImage}
                            width={64}
                            height={64}
                            alt=""
                        />
                    </span>
                    <DialogTitle className="text-2xl font-normal text-left">
                        THANK YOU FOR YOUR ORDER
                    </DialogTitle>
                    <DialogDescription className="border text-left">
                        You will receive an email confirmation shortly.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-col">
                    <div className="grid gap-4 bg-accent rounded-2xl">
                        <CartProductCard
                            image={ProductCartImage}
                            title="xx59 mk ii"
                            price={priceFormatter(2999)}
                            count={1}
                        />
                        <Separator />
                        <span>And 2 other items</span>
                        <div>
                            <span>GRAND TOTAL</span>
                            <span>$ 5,446</span>
                        </div>
                    </div>
                    <Button size="lg">BACK TO HOME</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
