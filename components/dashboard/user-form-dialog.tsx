"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { UserRow } from "@/app/dashboard/users/page"
import type { CreateUserInput, UpdateUserInput } from "@/lib/validations/user"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
    isActive: z.boolean().default(true),
    roleIds: z.array(z.string()).default([]),
})

type FormValues = z.infer<typeof formSchema>

interface RoleOption {
    id: string
    name: string
}

interface UserFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user?: UserRow
    onSubmit: (data: CreateUserInput | UpdateUserInput) => Promise<void>
}

export function UserFormDialog({
    open,
    onOpenChange,
    user,
    onSubmit,
}: UserFormDialogProps) {
    const [roles, setRoles] = useState<RoleOption[]>([])
    const [submitting, setSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<FormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: "",
            email: "",
            password: "",
            isActive: true,
            roleIds: [],
        },
    })

    const isActive = watch("isActive")
    const roleIds = watch("roleIds")

    useEffect(() => {
        if (!open) return
        fetch("/api/roles")
            .then((r) => r.json())
            .then((j) => setRoles(j.data ?? []))
            .catch(() => {})

        if (user) {
            setValue("name", user.name ?? "")
            setValue("email", user.email ?? "")
            setValue("isActive", user.isActive)
            setValue("roleIds", user.roleIds)
            setValue("password", "")
        } else {
            reset()
        }
    }, [open, user, setValue, reset])

    const handleFormSubmit = async (data: FormValues) => {
        setSubmitting(true)
        try {
            const payload = {
                name: data.name,
                email: data.email,
                isActive: data.isActive,
                roleIds: data.roleIds,
                ...(data.password ? { password: data.password } : {}),
            }
            await onSubmit(payload)
            reset()
            onOpenChange(false)
        } finally {
            setSubmitting(false)
        }
    }

    const toggleRole = (roleId: string) => {
        const current = roleIds ?? []
        const updated = current.includes(roleId)
            ? current.filter((id) => id !== roleId)
            : [...current, roleId]
        setValue("roleIds", updated)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
                    <DialogDescription>
                        {user ? "Update the user details below." : "Fill in the details to add a new user."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...register("name")} />
                            {errors.name && <p className="text-sm text-error">{errors.name.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register("email")} />
                            {errors.email && <p className="text-sm text-error">{errors.email.message}</p>}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">
                            {user ? "New Password (leave blank to keep current)" : "Password"}
                        </Label>
                        <Input id="password" type="password" {...register("password")} />
                        {errors.password && <p className="text-sm text-error">{errors.password.message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label>Status</Label>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="isActive"
                                checked={isActive}
                                onCheckedChange={(checked) => setValue("isActive", checked === true)}
                            />
                            <Label htmlFor="isActive" className="text-sm font-normal">
                                Active
                            </Label>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Roles</Label>
                        <div className="space-y-2 rounded-lg border p-3">
                            {roles.length === 0 && (
                                <p className="text-sm text-muted-foreground">No roles available.</p>
                            )}
                            {roles.map((role) => (
                                <div key={role.id} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`role-${role.id}`}
                                        checked={roleIds?.includes(role.id)}
                                        onCheckedChange={() => toggleRole(role.id)}
                                    />
                                    <Label htmlFor={`role-${role.id}`} className="text-sm font-normal capitalize">
                                        {role.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Saving..." : user ? "Save Changes" : "Add User"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
