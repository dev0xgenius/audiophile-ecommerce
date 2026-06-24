"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import BillingInfo from "./form/billing";
import PaymentInfo from "./form/payment-info";
import ShippingInfo from "./form/shipping-info";
import ConfirmationDialog from "./_components/confirmation-dialog";
import CheckoutSummary from "./_components/summary";

const formSchema = z.object({
    // Billing Info
    username: z.string(),
    email: z.email(),
    phone: z.string().regex(/(\d+)(\d{1,3}){1,3}/i),
    // ADDRESS
    address: z.string(),
    zipCode: z.number(),
    city: z.string(),
    country: z.string(),
    // PAYMENT
    payment: z.boolean(),
});

export default function Checkout() {
    const form = useForm({
        resolver: zodResolver(formSchema),
    });

    return (
        <>
            <div className="flex flex-col gap-8 px-6 md:px-10 py-4 bg-accent h-full lg:grid lg:grid-cols-[1fr_350px] lg:gap-8">
                <Button
                    size="sm"
                    variant={"link"}
                    className="w-max p-0 font-normal text-accent-foreground lg:col-span-2"
                >
                    Go Back
                </Button>
                <Form {...form}>
                    <form className="flex flex-wrap items-center px-6 py-8 gap-8 w-full bg-white rounded-xl">
                        <h2 className="text-h3">CHECKOUT</h2>
                        <BillingInfo />
                        <ShippingInfo />
                        <PaymentInfo />
                    </form>
                </Form>
                <CheckoutSummary />
            </div>
            <ConfirmationDialog isOpen={false} />
        </>
    );
}
