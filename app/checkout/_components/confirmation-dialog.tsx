import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import type { CartItem } from "@/lib/cart";

export default function ConfirmationDialog({
    isOpen = false,
    order,
}: {
    isOpen?: boolean;
    order: { id: string; items: CartItem[]; total: number };
}) {
    const shippingCost = order.total >= 5000 ? 0 : 50;
    const taxAmount = Math.round((order.total + shippingCost) * 0.08 * 100) / 100;
    const grandTotal = order.total + shippingCost + taxAmount;

    return (
        <Dialog modal={true} open={isOpen}>
            <DialogContent
                className="text-balance rounded-xl max-w-[540px]"
                showCloseButton={false}
                aria-describedby="dialog-description"
            >
                <DialogHeader className="gap-4">
                    <span className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </span>
                    <DialogTitle className="text-h3 text-left">
                        THANK YOU FOR YOUR ORDER
                    </DialogTitle>
                    <DialogDescription className="text-left leading-6">
                        You will receive an email confirmation shortly.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex sm:flex-col gap-6">
                    <div className="rounded-xl overflow-hidden flex">
                        <div className="bg-gray p-6 flex-1">
                            <div className="grid gap-3">
                                <div className="space-y-2">
                                    {order.items.slice(0, 1).map((item) => (
                                        <div key={item.variantId} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{item.name}</span>
                                                <span className="text-accent-foreground">x{item.quantity}</span>
                                            </div>
                                            <span className="tabular-nums">${(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                {order.items.length > 1 && (
                                    <span className="text-center text-accent-foreground text-sm pt-2 block border-t border-border">
                                        and {order.items.length - 1} other item(s)
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="bg-secondary flex flex-col justify-end p-6 md:w-[198px]">
                            <span className="text-accent-foreground text-sm">GRAND TOTAL</span>
                            <span className="text-white text-lg font-bold">
                                $ {grandTotal.toLocaleString()}
                            </span>
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
