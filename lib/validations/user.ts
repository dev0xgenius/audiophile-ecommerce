import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(1).max(200),
    email: z.string().email(),
    password: z.string().min(6).optional(),
    roleIds: z.array(z.string()).optional(),
    isActive: z.boolean().default(true),
});

export const updateUserSchema = createUserSchema.partial();

export const userQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
});

export const createRoleSchema = z.object({
    name: z.string().min(1).max(50),
    description: z.string().optional(),
    permissionIds: z.array(z.string()).optional(),
});

export const updateRoleSchema = createRoleSchema.partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
