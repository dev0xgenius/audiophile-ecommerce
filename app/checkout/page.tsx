"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getCart, clearCart, getCartTotal } from "@/lib/cart";
import { toast } from "sonner";
import ConfirmationDialog from "./_components/confirmation-dialog";
import CheckoutSummary from "./_components/summary";
import BillingInfo from "./form/billing";
import PaymentInfo from "./form/payment-info";
import ShippingInfo from "./form/shipping-info";
import type { CartItem } from "@/lib/cart";

const formSchema = z
    .object({
        username: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        phone: z.string().min(1, "Phone is required"),
        address: z.string().min(1, "Address is required"),
        zipCode: z.string().min(1, "ZIP code is required"),
        city: z.string().min(1, "City is required"),
        country: z.string().min(1, "Country is required"),
        paymentMethod: z.string(),
        eMoneyNumber: z.string().optional(),
        eMoneyPin: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.paymentMethod === "e-money") {
            if (!data.eMoneyNumber || data.eMoneyNumber.length < 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["eMoneyNumber"],
                    message: "e-Money number is required",
                });
            }
            if (!data.eMoneyPin || data.eMoneyPin.length < 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["eMoneyPin"],
                    message: "e-Money PIN is required",
                });
            }
        }
    });

export default function Checkout() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [lastOrder, setLastOrder] = useState<{
        id: string;
        items: CartItem[];
        total: number;
    } | null>(null);

    const cartTotal = getCartTotal(cartItems);

    useEffect(() => {
        setCartItems(getCart());
    }, []);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            paymentMethod: "e-money",
        },
    });

    const onSubmit = useCallback(
        async (data: z.infer<typeof formSchema>) => {
            if (cartItems.length === 0) return;
            setSubmitting(true);

            try {
                const res = await fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        items: cartItems.map((i) => ({
                            variantId: i.variantId,
                            quantity: i.quantity,
                        })),
                        customer: {
                            name: data.username,
                            email: data.email,
                            phone: data.phone,
                        },
                        shipping: {
                            line1: data.address,
                            city: data.city,
                            state: data.city,
                            postalCode: data.zipCode,
                            country: data.country,
                        },
                        payment: {
                            method: data.paymentMethod,
                            eMoneyNumber: data.eMoneyNumber,
                            eMoneyPin: data.eMoneyPin,
                        },
                    }),
                });

                const result = await res.json();

                if (!res.ok) {
                    toast.error(result.error || "Checkout failed. Please try again.");
                    return;
                }

                setLastOrder({
                    id: result.orderId,
                    items: [...cartItems],
                    total: cartTotal,
                });
                clearCart();
                setCartItems([]);

                if (result.authorizationUrl) {
                    window.location.href = result.authorizationUrl;
                } else {
                    setShowConfirmation(true);
                }
            } catch {
                toast.error("Something went wrong. Please try again.");
            } finally {
                setSubmitting(false);
            }
        },
        [cartItems, cartTotal],
    );

    return (
        <>
            <div className="bg-gray py-4 px-6 md:py-12 xl:py-[140] md:px-10 h-full">
                <div className="relative container mx-auto max-w-[1110] flex flex-col gap-8 h-full lg:grid lg:grid-cols-[1fr_350px] lg:gap-8">
                    <Button
                        size="sm"
                        variant={"link"}
                        className="w-max p-0 font-normal text-accent-foreground lg:col-span-2 lg:absolute -top-10"
                    >
                        Go Back
                    </Button>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col px-6 py-8 md:p-7 xl:p-12 gap-8 md:gap-16 w-full bg-white rounded-xl"
                        >
                            <h2 className="text-h3">CHECKOUT</h2>
                            <BillingInfo />
                            <ShippingInfo />
                            <PaymentInfo />
                        </form>
                    </Form>
                    <CheckoutSummary
                        items={cartItems}
                        submitting={submitting}
                    />
                </div>
            </div>
            {lastOrder && (
                <ConfirmationDialog
                    isOpen={showConfirmation}
                    order={lastOrder}
                />
            )}
        </>
    );
}
