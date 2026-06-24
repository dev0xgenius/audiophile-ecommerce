import Image from "next/image";

import ProductCartImage from "@/assets/cart/image-xx59-headphones.jpg";
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

export default function ConfirmationDialog({
    isOpen = false,
}: {
    isOpen?: boolean;
}) {
    return (
        <Dialog modal={true} open={isOpen}>
            <DialogContent
                className="text-balance rounded-xl"
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
                    <div className="bg-accent rounded-xl overflow-y-hidden flex flex-col">
                        <div className="grid gap-3 p-6 pb-0">
                            <CartProductCard
                                image={ProductCartImage}
                                title="xx59 mk ii"
                                price={formatPrice(2999)}
                                count={1}
                            />
                            <Separator />
                            <span className="text-center text-accent-foreground">
                                and 2 other items
                            </span>
                        </div>
                        <div className="bg-secondary text-accent-foreground grid gap-2 p-6">
                            <span>GRAND TOTAL</span>
                            <span className="text-white">$ 5,446</span>
                        </div>
                    </div>
                    <Button size="lg">
                        <Link href="/">BACK TO HOME</Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
