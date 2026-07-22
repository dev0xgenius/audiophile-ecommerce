import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1).max(200),
    slug: z.string().min(1).max(255),
    sku: z.string().max(100).optional(),
    brand: z.string().max(100).optional(),
    description: z.string().optional(),
    specifications: z.record(z.string(), z.any()).optional(),
    basePrice: z.number().min(0),
    costPrice: z.number().min(0).optional(),
    taxClass: z.string().max(50).optional(),
    weight: z.number().min(0).optional(),
    dimensions: z.object({
        length: z.number().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        unit: z.string().optional(),
    }).optional(),
    status: z.enum(["draft", "active", "archived"]).default("draft"),
    categoryId: z.string().optional(),
    supplierId: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().optional(),
    status: z.enum(["draft", "active", "archived"]).optional(),
    categoryId: z.string().optional(),
    sortBy: z.string().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const createVariantSchema = z.object({
    productId: z.string().min(1),
    sku: z.string().min(1).max(100),
    name: z.string().min(1).max(200),
    priceDelta: z.number().default(0),
    stock: z.number().int().min(0).default(0),
    lowStockThreshold: z.number().int().min(0).default(5),
    weightDelta: z.number().optional(),
    isActive: z.boolean().default(true),
});

export const updateVariantSchema = createVariantSchema.partial().omit({ productId: true });

export const variantQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().optional(),
    sortBy: z.string().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type CreateVariantInput = z.infer<typeof createVariantSchema>;
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>;
export type VariantQueryInput = z.infer<typeof variantQuerySchema>;
