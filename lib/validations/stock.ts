import { z } from "zod";

export const stockAdjustSchema = z.object({
    variantId: z.string().min(1),
    delta: z.number().int().refine((v) => v !== 0, { message: "Delta must be non-zero" }),
    reason: z.enum(["restock", "sale", "adjustment", "return", "damaged", "correction"]),
    reasonDetail: z.string().max(500).optional(),
});

export type StockAdjustInput = z.infer<typeof stockAdjustSchema>;
