import { z } from "zod";

export const createBundleSchema = z.object({
    productId: z.string().min(1),
    componentVariantId: z.string().min(1),
    quantity: z.number().int().min(1).default(1),
    decrementComponentStock: z.boolean().default(true),
});

export const updateBundleSchema = createBundleSchema.partial();

export const bundleQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z.string().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateBundleInput = z.infer<typeof createBundleSchema>;
export type UpdateBundleInput = z.infer<typeof updateBundleSchema>;
export type BundleQueryInput = z.infer<typeof bundleQuerySchema>;
