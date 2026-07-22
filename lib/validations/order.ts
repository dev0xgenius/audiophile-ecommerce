import { z } from "zod";

export const orderQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().optional(),
    status: z.enum([
        "pending_payment",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
        "partially_refunded",
    ]).optional(),
    paymentStatus: z.string().optional(),
    pspProvider: z.string().optional(),
    customerId: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    sortBy: z.string().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const statusTransitionSchema = z.object({
    status: z.enum([
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
        "partially_refunded",
    ]),
    note: z.string().optional(),
});

const allowedTransitions: Record<string, string[]> = {
    pending_payment: ["paid", "cancelled"],
    paid: ["processing", "cancelled", "refunded"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered", "cancelled"],
    delivered: ["refunded", "partially_refunded"],
    cancelled: [],
    refunded: [],
    partially_refunded: ["refunded"],
};

export function isValidTransition(from: string, to: string): boolean {
    return allowedTransitions[from]?.includes(to) ?? false;
}

export const createFulfillmentSchema = z.object({
    items: z.array(z.object({
        lineItemId: z.string().min(1),
        quantity: z.number().int().min(1),
    })).min(1),
    trackingNumber: z.string().max(200).optional(),
    carrier: z.string().max(100).optional(),
});

export const createShipmentSchema = z.object({
    shipmentId: z.string().min(1),
});

export const orderExportSchema = z.object({
    format: z.enum(["csv", "pdf-invoice", "pdf-packing-slip"]).default("csv"),
    ...orderQuerySchema.shape,
});

export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
export type StatusTransitionInput = z.infer<typeof statusTransitionSchema>;
export type CreateFulfillmentInput = z.infer<typeof createFulfillmentSchema>;
export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;
export type OrderExportInput = z.infer<typeof orderExportSchema>;
