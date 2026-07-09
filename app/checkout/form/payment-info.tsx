import { FieldGroup, Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Controller, useFormContext } from "react-hook-form";

export default function PaymentInfo() {
	const form = useFormContext();
	const paymentMethod = form.watch("paymentMethod");

	return (
		<FieldGroup>
			<h3 className="text-sm font-bold tracking-wider">PAYMENT DETAILS</h3>
			<div className="text-sm font-medium mb-1">Payment Method</div>
			<Controller
				name="paymentMethod"
				control={form.control}
				render={({ field, fieldState }) => (
					<>
						<RadioGroup
							value={field.value}
							onValueChange={field.onChange}
							className="grid grid-cols-1 md:grid-cols-2 gap-4"
						>
							<Label
								htmlFor="r1"
								className="flex items-center gap-4 px-4 py-5 rounded-lg border border-input aria-selected:border-primary hover:border-primary/50 focus-within:ring-2 focus-within:ring-ring transition-[color,box-shadow] cursor-pointer"
								aria-selected={field.value === "e-money"}
							>
								<RadioGroupItem value="e-money" id="r1" />
								<span>e-Money</span>
							</Label>
							<Label
								htmlFor="r2"
								className="flex items-center gap-4 px-4 py-5 rounded-lg border border-input aria-selected:border-primary hover:border-primary/50 focus-within:ring-2 focus-within:ring-ring transition-[color,box-shadow] cursor-pointer"
								aria-selected={field.value === "cash"}
							>
								<RadioGroupItem value="cash" id="r2" />
								<span>Cash On Delivery</span>
							</Label>
						</RadioGroup>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</>
				)}
			/>

			{paymentMethod === "e-money" && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Controller
						name="eMoneyNumber"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="eMoneyNumber">e-Money Number</FieldLabel>
								<Input
									{...field}
									type="text"
									id="eMoneyNumber"
									placeholder="238521993"
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						name="eMoneyPin"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="eMoneyPin">e-Money PIN</FieldLabel>
								<Input
									{...field}
									type="text"
									id="eMoneyPin"
									placeholder="6891"
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
				</div>
			)}
		</FieldGroup>
	);
}
