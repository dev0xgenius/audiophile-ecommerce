import { FieldGroup, Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

function EpaymentInfo() {
	// TODO: Make use of component
	return <div></div>;
}

export default function PaymentInfo() {
	const [paymentMethod, setPaymentMethod] = useState<"0" | "1">("0"); // '0' for e-Money and '1' for the other
	const form = useFormContext();

	return (
		<FieldGroup>
			<h3 className="text-sm">PAYMENT DETAILS</h3>
			<Controller
				name="payment"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field>
						<RadioGroup
							name={field.name}
							aria-invalid={fieldState.invalid}
							defaultValue={paymentMethod}
							onChange={() => console.log("Payment Method: ", paymentMethod)}
						>
                            <Label
                                htmlFor="r1"
                                className="flex items-center gap-4 px-4 py-5 rounded-2xl border border-input aria-selected:border-primary hover:border-primary/50 focus-within:ring-2 focus-within:ring-ring transition-[color,box-shadow]"
                                aria-selected={paymentMethod == "0"}
                            >
                                <RadioGroupItem
                                    value="0"
                                    id="r1"
                                    onClick={() => setPaymentMethod("0")}
                                />
                                <span>e-Money</span>
                            </Label>
                            <Label
                                htmlFor="r2"
                                className="flex items-center gap-4 px-4 py-5 rounded-2xl border border-input aria-selected:border-primary hover:border-primary/50 focus-within:ring-2 focus-within:ring-ring transition-[color,box-shadow]"
                                aria-selected={paymentMethod == "1"}
                            >
                                <RadioGroupItem
                                    value="1"
                                    id="r2"
                                    onClick={() => setPaymentMethod("1")}
                                />
                                <span>Cash On Delivery</span>
                            </Label>
						</RadioGroup>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			{paymentMethod == "0" && (
				<div className="grid gap-4">
					<Field>
						<Label htmlFor="eMoneyNumber">e-Money Number</Label>
						<Input
							type="text"
							name="eMoneyNumber"
							id="eMoneyNumber"
							placeholder="238521993"
						/>
					</Field>
					<Field>
						<Label htmlFor="eMoneyPin">e-Money PIN</Label>
						<Input
							type="text"
							name="eMoneyPin"
							id="eMoneyPin"
							placeholder="6891"
						/>
					</Field>
				</div>
			)}
		</FieldGroup>
	);
}
