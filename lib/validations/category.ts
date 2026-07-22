import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(1).max(100),
    slug: z.string().min(1).max(120),
    description: z.string().optional(),
    parentId: z.string().optional(),
    sortOrder: z.number().int().default(0),
    imageUrl: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
