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
    username: z.string(),
    email: z.string().email(),
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
            <div className="flex flex-col gap-8 px-6 md:px-10 py-4 bg-gray h-full lg:grid lg:grid-cols-[1fr_350px] lg:gap-8">
                <Button
                    size="sm"
                    variant={"link"}
                    className="w-max p-0 font-normal text-accent-foreground lg:col-span-2"
                >
                    Go Back
                </Button>
                <Form {...form}>
                    <form className="flex flex-col px-6 py-8 gap-8 w-full bg-white rounded-xl">
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
