import { z } from "zod";

export const checkoutItemSchema = z.object({
    variantId: z.string().min(1),
    quantity: z.number().int().min(1),
});

export const checkoutCustomerSchema = z.object({
    name: z.string().min(1).max(200),
    email: z.string().email(),
    phone: z.string().max(30).optional(),
});

export const checkoutAddressSchema = z.object({
    line1: z.string().min(1).max(255),
    line2: z.string().max(255).optional(),
    city: z.string().min(1).max(100),
    state: z.string().max(100),
    postalCode: z.string().max(20),
    country: z.string().min(1).max(100),
});

export const checkoutSchema = z.object({
    items: z.array(checkoutItemSchema).min(1),
    customer: checkoutCustomerSchema,
    shipping: checkoutAddressSchema.optional(),
    notes: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
