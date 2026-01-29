import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";

export default function BillingInfo() {
	const form = useFormContext();

	return (
		<FieldGroup>
			<h3>BILLING DETAILS</h3>
			<Controller
				name="username"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor="username">Name</FieldLabel>
						<Input
							{...field}
							type="text"
							placeholder="Alexie Ward"
							id={field.name}
							aria-invalid={fieldState.invalid}
							autoComplete="on"
						/>
						{fieldState.error && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
			<Controller
				name="email"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor="email">Email</FieldLabel>
						<Input
							{...field}
							type="email"
							aria-invalid={fieldState.invalid}
							id={field.name}
							autoComplete="on"
							placeholder="alexie@mail.com"
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
			<Controller
				name="phone"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor="phone">Phone Number</FieldLabel>
						<Input
							{...field}
							type="tel"
							aria-invalid={fieldState.invalid}
							id={field.name}
							autoComplete="on"
							placeholder="+1 202-555-0136"
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
		</FieldGroup>
	);
}
