import { z } from "zod";

export const mediaQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().optional(),
    tag: z.string().optional(),
    folder: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    sortBy: z.string().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const updateMediaSchema = z.object({
    altText: z.string().optional(),
    tags: z.array(z.string()).optional(),
    folder: z.string().max(100).optional(),
});

export type MediaQueryInput = z.infer<typeof mediaQuerySchema>;
export type UpdateMediaInput = z.infer<typeof updateMediaSchema>;
