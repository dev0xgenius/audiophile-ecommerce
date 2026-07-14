import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";

export default function ShippingInfo() {
    const form = useFormContext();
    return (
        <FieldGroup>
            <h3 className="text-sm font-bold tracking-wider text-primary">
                SHIPPING INFO
            </h3>
            <Controller
                name="address"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="address">Your Address</FieldLabel>
                        <Input
                            {...field}
                            type="text"
                            id={field.name}
                            autoComplete="on"
                            placeholder="1137 Williams Avenue"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                    name="zipCode"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="zipCode">ZIP Code</FieldLabel>
                            <Input
                                {...field}
                                type="text"
                                id={field.name}
                                autoComplete="on"
                                placeholder="10001"
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="city"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="city">City</FieldLabel>
                            <Input
                                {...field}
                                type="text"
                                id={field.name}
                                autoComplete="on"
                                placeholder="New York"
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </div>
            <Controller
                name="country"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="country">Country</FieldLabel>
                        <Input
                            {...field}
                            type="text"
                            id={field.name}
                            autoComplete="on"
                            placeholder="United States"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
        </FieldGroup>
    );
}
