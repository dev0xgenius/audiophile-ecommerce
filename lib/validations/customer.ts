import { z } from "zod";

export const customerQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().optional(),
    sortBy: z.string().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const updateCustomerSchema = z.object({
    notes: z.string().optional(),
    flags: z.array(z.enum(["VIP", "fraud-risk"])).optional(),
});

export type CustomerQueryInput = z.infer<typeof customerQuerySchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
