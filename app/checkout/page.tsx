"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import BillingInfo from "./form/billing";
import PaymentInfo from "./form/payment-info";
import ShippingInfo from "./form/shipping-info";
import CheckoutSummary from "@/components/ui/checkout/summary";

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
		<div className="grid place-items-start gap-8 px-6 py-4 mb-24">
			<Button
				size="sm"
				variant={"link"}
				className="w-max p-0 font-normal text-accent-foreground"
			>
				Go Back
			</Button>
			<Form {...form}>
				<form className="flex flex-wrap items-center gap-8 w-full">
					<h2 className="text-3xl">CHECKOUT</h2>
					<BillingInfo />
					<ShippingInfo />
					<PaymentInfo />
				</form>
			</Form>
			<CheckoutSummary />
		</div>
	);
}
