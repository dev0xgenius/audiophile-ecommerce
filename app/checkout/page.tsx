"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ConfirmationDialog from "./_components/confirmation-dialog";
import CheckoutSummary from "./_components/summary";
import BillingInfo from "./form/billing";
import PaymentInfo from "./form/payment-info";
import ShippingInfo from "./form/shipping-info";

const formSchema = z.object({
    username: z.string(),
    email: z.email(),
    phone: z.string(),
    address: z.string(),
    zipCode: z.string(),
    city: z.string(),
    country: z.string(),
    paymentMethod: z.string(),
    eMoneyNumber: z.string(),
    eMoneyPin: z.string(),
});

export default function Checkout() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            paymentMethod: "e-money",
        },
    });

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
                        <form className="flex flex-col px-6 py-8 md:p-7 xl:p-12 gap-8 md:gap-16 w-full bg-white rounded-xl">
                            <h2 className="text-h3">CHECKOUT</h2>
                            <BillingInfo />
                            <ShippingInfo />
                            <PaymentInfo />
                        </form>
                    </Form>
                    <CheckoutSummary />
                </div>
            </div>
            <ConfirmationDialog isOpen={false} />
        </>
    );
}
