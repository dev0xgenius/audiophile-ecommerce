import { z } from "zod";

export const createSupplierSchema = z.object({
    name: z.string().min(1).max(200),
    contactName: z.string().max(100).optional(),
    email: z.string().email().max(255).optional().or(z.literal("")),
    phone: z.string().max(30).optional(),
    leadTimeDays: z.number().int().min(0).optional(),
    notes: z.string().optional(),
});

export const updateSupplierSchema = createSupplierSchema.partial();

export const supplierQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().optional(),
    sortBy: z.string().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
export type SupplierQueryInput = z.infer<typeof supplierQuerySchema>;
