"use client"

import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
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


interface SupplierRecord {
    id: string
    name: string
    contactName: string | null
    email: string | null
    phone: string | null
    leadTimeDays: number | null
    notes: string | null
}

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    contactName: z.string().optional().or(z.literal("")),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    leadTimeDays: z.coerce.number().int().min(0).optional(),
    notes: z.string().optional().or(z.literal("")),
})

type FormValues = z.infer<typeof formSchema>

interface SupplierFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSaved: () => void
    editSupplier?: SupplierRecord | null
}

export function SupplierFormDialog({ open, onOpenChange, onSaved, editSupplier }: SupplierFormDialogProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
        defaultValues: { name: "", contactName: "", email: "", phone: "", leadTimeDays: undefined, notes: "" },
    })

    const isEdit = !!editSupplier

    function resetForm() {
        if (editSupplier) {
            form.reset({
                name: editSupplier.name,
                contactName: editSupplier.contactName ?? "",
                email: editSupplier.email ?? "",
                phone: editSupplier.phone ?? "",
                leadTimeDays: editSupplier.leadTimeDays ?? undefined,
                notes: editSupplier.notes ?? "",
            })
        } else {
            form.reset({ name: "", contactName: "", email: "", phone: "", leadTimeDays: undefined, notes: "" })
        }
    }

    async function onSubmit(values: FormValues) {
        try {
            const body = {
                ...values,
                leadTimeDays: values.leadTimeDays || null,
                contactName: values.contactName || null,
                email: values.email || null,
                phone: values.phone || null,
                notes: values.notes || null,
            }
            const url = isEdit ? `/api/suppliers/${editSupplier.id}` : "/api/suppliers"
            const method = isEdit ? "PUT" : "POST"
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? "Failed to save supplier")
            }
            toast.success(isEdit ? "Supplier updated" : "Supplier created")
            onSaved()
            onOpenChange(false)
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to save supplier")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
                    <DialogDescription>Manage a product supplier or vendor.</DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" onReset={resetForm}>
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input id="name" {...form.register("name")} />
                        {form.formState.errors.name && (
                            <p className="text-sm text-error">{form.formState.errors.name.message}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contactName">Contact Name</Label>
                            <Input id="contactName" {...form.register("contactName")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...form.register("email")} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" {...form.register("phone")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="leadTimeDays">Lead Time (days)</Label>
                            <Input id="leadTimeDays" type="number" min={0} {...form.register("leadTimeDays")} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <textarea
                            id="notes"
                            className="flex min-h-[80px] w-full rounded-lg border bg-transparent px-3 py-2 text-sm"
                            {...form.register("notes")}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">{isEdit ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
