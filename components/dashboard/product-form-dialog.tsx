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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { ProductRow } from "@/app/dashboard/products/page"
import type { CreateProductInput, UpdateProductInput } from "@/lib/validations/product"

interface Variant {
    id: string
    sku: string
    name: string
    priceDelta: number
    stock: number
    lowStockThreshold: number
    weightDelta: number | null
    isActive: boolean
}

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    sku: z.string().optional(),
    brand: z.string().optional(),
    description: z.string().optional(),
    basePrice: z.coerce.number().min(0.01, "Price must be greater than 0"),
    costPrice: z.coerce.number().min(0).optional(),
    taxClass: z.string().optional(),
    weight: z.coerce.number().min(0).optional(),
    status: z.enum(["draft", "active", "archived"]).default("draft"),
    categoryId: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CategoryOption {
    id: string
    name: string
    slug: string
}

interface ProductFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product?: ProductRow
    onSubmit: (data: CreateProductInput | UpdateProductInput) => Promise<void>
}

export function ProductFormDialog({
    open,
    onOpenChange,
    product,
    onSubmit,
}: ProductFormDialogProps) {
    const [categories, setCategories] = useState<CategoryOption[]>([])
    const [submitting, setSubmitting] = useState(false)
    const [variants, setVariants] = useState<Variant[]>([])
    const [newVariant, setNewVariant] = useState({ name: "", sku: "", priceDelta: 0, stock: 0, lowStockThreshold: 5 })
    const [showVariantForm, setShowVariantForm] = useState(false)

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
            slug: "",
            sku: "",
            brand: "",
            description: "",
            basePrice: 0,
            costPrice: 0,
            taxClass: "",
            weight: 0,
            status: "draft",
            categoryId: "",
        },
    })

    useEffect(() => {
        if (!open) return
        fetch("/api/categories")
            .then((r) => r.json())
            .then((j) => setCategories(j.data ?? []))
            .catch(() => {})

        if (product) {
            setValue("name", product.name)
            setValue("slug", product.slug)
            setValue("sku", product.sku ?? "")
            setValue("brand", product.brand ?? "")
            setValue("description", product.description ?? "")
            setValue("basePrice", product.basePrice)
            setValue("costPrice", product.costPrice ?? 0)
            setValue("taxClass", product.taxClass ?? "")
            setValue("weight", product.weight ?? 0)
            setValue("status", product.status as "draft" | "active" | "archived")
            setValue("categoryId", product.category?.id ?? "")

            fetch(`/api/products/${product.id}/variants?pageSize=100`)
                .then((r) => r.json())
                .then((j) => setVariants(j.data ?? []))
                .catch(() => {})
        } else {
            reset()
            setVariants([])
        }
    }, [open, product, setValue, reset])

    const status = watch("status")
    const categoryId = watch("categoryId")

    const handleFormSubmit = async (data: FormValues) => {
        setSubmitting(true)
        try {
            const payload: CreateProductInput = {
                ...data,
                sku: data.sku || undefined,
                brand: data.brand || undefined,
                description: data.description || undefined,
                costPrice: data.costPrice || undefined,
                taxClass: data.taxClass || undefined,
                weight: data.weight || undefined,
                categoryId: data.categoryId || undefined,
            }
            await onSubmit(payload)
            reset()
            onOpenChange(false)
        } finally {
            setSubmitting(false)
        }
    }

    const handleAddVariant = async () => {
        if (!product || !newVariant.name || !newVariant.sku) return
        try {
            const res = await fetch(`/api/products/${product.id}/variants`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newVariant),
            })
            if (!res.ok) throw new Error("Failed to add variant")
            const json = await res.json()
            setVariants((prev) => [...prev, json.data])
            setNewVariant({ name: "", sku: "", priceDelta: 0, stock: 0, lowStockThreshold: 5 })
            setShowVariantForm(false)
        } catch {
            // silent
        }
    }

    const handleRemoveVariant = async (variantId: string) => {
        try {
            const res = await fetch(`/api/variants/${variantId}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to remove variant")
            setVariants((prev) => prev.map((v) => v.id === variantId ? { ...v, isActive: false } : v))
        } catch {
            // silent
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
                    <DialogDescription>
                        {product ? "Update the product details below." : "Fill in the details to add a new product."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input id="name" {...register("name")} />
                            {errors.name && <p className="text-sm text-error">{errors.name.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" {...register("slug")} />
                            {errors.slug && <p className="text-sm text-error">{errors.slug.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="sku">Base SKU</Label>
                            <Input id="sku" {...register("sku")} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="brand">Brand</Label>
                            <Input id="brand" {...register("brand")} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="categoryId">Category</Label>
                        <Select
                            value={categoryId}
                            onValueChange={(v: string) => setValue("categoryId", v === "none" ? "" : v)}
                        >
                            <SelectTrigger id="categoryId">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No category</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="basePrice">Base Price ($)</Label>
                            <Input id="basePrice" type="number" step="0.01" {...register("basePrice")} />
                            {errors.basePrice && <p className="text-sm text-error">{errors.basePrice.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="costPrice">Cost Price ($)</Label>
                            <Input id="costPrice" type="number" step="0.01" {...register("costPrice")} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input id="weight" type="number" step="0.01" {...register("weight")} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="taxClass">Tax Class</Label>
                            <Input id="taxClass" {...register("taxClass")} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={status}
                                onValueChange={(v: string) => setValue("status", v as "draft" | "active" | "archived")}
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            rows={3}
                            className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            {...register("description")}
                        />
                    </div>

                    {product && (
                        <div className="space-y-3 rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">Variants</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowVariantForm(!showVariantForm)}
                                >
                                    {showVariantForm ? "Cancel" : "Add Variant"}
                                </Button>
                            </div>

                            {showVariantForm && (
                                <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted p-3">
                                    <div className="grid gap-1">
                                        <Label className="text-xs">Name</Label>
                                        <Input
                                            size={1}
                                            value={newVariant.name}
                                            onChange={(e) => setNewVariant((p) => ({ ...p, name: e.target.value }))}
                                            placeholder="e.g. Black, 1.2m"
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <Label className="text-xs">SKU</Label>
                                        <Input
                                            size={1}
                                            value={newVariant.sku}
                                            onChange={(e) => setNewVariant((p) => ({ ...p, sku: e.target.value }))}
                                            placeholder="Unique SKU"
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <Label className="text-xs">Price Delta</Label>
                                        <Input
                                            size={1}
                                            type="number"
                                            step="0.01"
                                            value={newVariant.priceDelta}
                                            onChange={(e) => setNewVariant((p) => ({ ...p, priceDelta: Number(e.target.value) }))}
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <Label className="text-xs">Stock</Label>
                                        <Input
                                            size={1}
                                            type="number"
                                            value={newVariant.stock}
                                            onChange={(e) => setNewVariant((p) => ({ ...p, stock: Number(e.target.value) }))}
                                        />
                                    </div>
                                    <Button type="button" size="sm" className="col-span-2" onClick={handleAddVariant}>
                                        Create Variant
                                    </Button>
                                </div>
                            )}

                            {variants.length === 0 && !showVariantForm && (
                                <p className="text-sm text-muted-foreground">No variants yet.</p>
                            )}

                            <div className="space-y-2">
                                {variants.map((v) => (
                                    <div key={v.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{v.name}</span>
                                            <span className="text-muted-foreground">({v.sku})</span>
                                            <Badge variant={v.isActive ? "default" : "outline"} className="text-xs">
                                                {v.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-muted-foreground">Stock: {v.stock}</span>
                                            <span className="tabular-nums">
                                                {v.priceDelta >= 0 ? "+" : ""}${v.priceDelta.toFixed(2)}
                                            </span>
                                            {v.isActive && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs"
                                                    onClick={() => handleRemoveVariant(v.id)}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Saving..." : product ? "Save Changes" : "Add Product"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
