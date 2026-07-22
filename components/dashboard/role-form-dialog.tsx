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
import type { RoleRow } from "@/app/dashboard/roles/page"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional().or(z.literal("")),
    permissionIds: z.array(z.string()).default([]),
})

type FormValues = z.infer<typeof formSchema>

interface PermissionOption {
    id: string
    resource: string
    action: string
    description: string | null
}

interface RoleFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    role?: RoleRow
    onSubmit: (data: { name: string; description?: string; permissionIds?: string[] }) => Promise<void>
}

export function RoleFormDialog({
    open,
    onOpenChange,
    role,
    onSubmit,
}: RoleFormDialogProps) {
    const [permissions, setPermissions] = useState<PermissionOption[]>([])
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
            description: "",
            permissionIds: [],
        },
    })

    const permissionIds = watch("permissionIds")

    useEffect(() => {
        if (!open) return
        fetch("/api/permissions")
            .then((r) => r.json())
            .then((j) => setPermissions(j.data ?? []))
            .catch(() => {})

        if (role) {
            setValue("name", role.name)
            setValue("description", role.description ?? "")
            setValue("permissionIds", role.permissionIds)
        } else {
            reset()
        }
    }, [open, role, setValue, reset])

    const handleFormSubmit = async (data: FormValues) => {
        setSubmitting(true)
        try {
            await onSubmit({
                name: data.name,
                description: data.description || undefined,
                permissionIds: data.permissionIds,
            })
            reset()
            onOpenChange(false)
        } finally {
            setSubmitting(false)
        }
    }

    const togglePermission = (permissionId: string) => {
        const current = permissionIds ?? []
        const updated = current.includes(permissionId)
            ? current.filter((id) => id !== permissionId)
            : [...current, permissionId]
        setValue("permissionIds", updated)
    }

    const grouped = permissions.reduce<Record<string, PermissionOption[]>>((acc, p) => {
        if (!acc[p.resource]) acc[p.resource] = []
        acc[p.resource].push(p)
        return acc
    }, {})

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{role ? "Edit Role" : "Add Role"}</DialogTitle>
                    <DialogDescription>
                        {role ? "Update the role details and permissions below." : "Fill in the details to add a new role."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Role Name</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && <p className="text-sm text-error">{errors.name.message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            rows={2}
                            className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            {...register("description")}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Permissions</Label>
                        <div className="space-y-3 rounded-lg border p-3 max-h-64 overflow-y-auto">
                            {permissions.length === 0 && (
                                <p className="text-sm text-muted-foreground">No permissions available.</p>
                            )}
                            {Object.entries(grouped).map(([resource, perms]) => (
                                <div key={resource}>
                                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                                        {resource}
                                    </p>
                                    <div className="space-y-1 pl-2">
                                        {perms.map((p) => (
                                            <div key={p.id} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`perm-${p.id}`}
                                                    checked={permissionIds?.includes(p.id)}
                                                    onCheckedChange={() => togglePermission(p.id)}
                                                />
                                                <Label
                                                    htmlFor={`perm-${p.id}`}
                                                    className="text-sm font-normal capitalize"
                                                >
                                                    {p.action}
                                                    {p.description && (
                                                        <span className="text-muted-foreground ml-1">
                                                            — {p.description}
                                                        </span>
                                                    )}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Saving..." : role ? "Save Changes" : "Add Role"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
