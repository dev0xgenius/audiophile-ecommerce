import { z } from "zod";

export const dateRangeSchema = z.object({
    period: z.enum(["today", "7d", "30d", "90d", "custom"]).default("30d"),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
});

export const topProductsQuerySchema = z.object({
    period: z.enum(["today", "7d", "30d", "90d", "custom"]).default("30d"),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type DateRangeInput = z.infer<typeof dateRangeSchema>;
export type TopProductsQueryInput = z.infer<typeof topProductsQuerySchema>;
