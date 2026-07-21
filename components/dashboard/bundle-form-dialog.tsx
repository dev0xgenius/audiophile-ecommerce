"use client"

import { useEffect, useState } from "react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface ProductOption {
    id: string
    name: string
    variants: { id: string; name: string; sku: string }[]
}

interface BundleRecord {
    id: string
    productId: string
    componentVariantId: string
    quantity: number
    decrementComponentStock: boolean
    product: { id: string; name: string }
    component: { id: string; name: string; sku: string }
}

const formSchema = z.object({
    productId: z.string().min(1, "Product is required"),
    componentVariantId: z.string().min(1, "Variant is required"),
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
    decrementComponentStock: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

interface BundleFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSaved: () => void
    editBundle?: BundleRecord | null
}

export function BundleFormDialog({ open, onOpenChange, onSaved, editBundle }: BundleFormDialogProps) {
    const [products, setProducts] = useState<ProductOption[]>([])
    const [selectedProductVariants, setSelectedProductVariants] = useState<{ id: string; name: string; sku: string }[]>([])
    const [saving, setSaving] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
        defaultValues: {
            productId: "",
            componentVariantId: "",
            quantity: 1,
            decrementComponentStock: true,
        },
    })

    const watchProductId = form.watch("productId")

    useEffect(() => {
        if (!open) return
        fetch("/api/products?pageSize=100")
            .then((r) => r.json())
            .then((j) => {
                const list: ProductOption[] = (j.data ?? []).map((p: { id: string; name: string; variants?: { id: string; name: string; sku: string }[] }) => ({
                    id: p.id,
                    name: p.name,
                    variants: (p.variants ?? []).filter((v) => v.id),
                }))
                setProducts(list)
            })
            .catch(() => toast.error("Failed to load products"))
    }, [open])

    useEffect(() => {
        if (watchProductId) {
            const p = products.find((x) => x.id === watchProductId)
            setSelectedProductVariants(p?.variants ?? [])
            form.setValue("componentVariantId", "")
        } else {
            setSelectedProductVariants([])
        }
    }, [watchProductId, products, form])

    useEffect(() => {
        if (editBundle) {
            form.reset({
                productId: editBundle.productId,
                componentVariantId: editBundle.componentVariantId,
                quantity: editBundle.quantity,
                decrementComponentStock: editBundle.decrementComponentStock,
            })
        } else {
            form.reset({ productId: "", componentVariantId: "", quantity: 1, decrementComponentStock: true })
        }
    }, [editBundle, form])

    async function onSubmit(values: FormValues) {
        setSaving(true)
        try {
            const url = editBundle ? `/api/bundles/${editBundle.id}` : "/api/bundles"
            const method = editBundle ? "PUT" : "POST"
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? "Failed to save bundle")
            }
            toast.success(editBundle ? "Bundle updated" : "Bundle created")
            onSaved()
            onOpenChange(false)
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to save bundle")
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editBundle ? "Edit Bundle" : "Add Bundle"}</DialogTitle>
                    <DialogDescription>
                        Link a product variant as a component of a product bundle.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="productId">Product (Bundle)</Label>
                        <Select
                            value={form.watch("productId")}
                            onValueChange={(v) => form.setValue("productId", v)}
                        >
                            <SelectTrigger id="productId">
                                <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="componentVariantId">Component Variant</Label>
                        {!watchProductId ? (
                            <p className="text-sm text-muted-foreground">Select a product first</p>
                        ) : selectedProductVariants.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No variants available for this product</p>
                        ) : (
                            <Select
                                value={form.watch("componentVariantId")}
                                onValueChange={(v) => form.setValue("componentVariantId", v)}
                            >
                                <SelectTrigger id="componentVariantId">
                                    <SelectValue placeholder="Select variant" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedProductVariants.map((v) => (
                                        <SelectItem key={v.id} value={v.id}>
                                            {v.name} ({v.sku})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input id="quantity" type="number" min={1} {...form.register("quantity")} />
                        {form.formState.errors.quantity && (
                            <p className="text-sm text-error">{form.formState.errors.quantity.message}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Switch
                            id="decrementComponentStock"
                            checked={form.watch("decrementComponentStock")}
                            onCheckedChange={(v) => form.setValue("decrementComponentStock", v)}
                        />
                        <Label htmlFor="decrementComponentStock">Decrement component stock on sale</Label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? "Saving..." : editBundle ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
