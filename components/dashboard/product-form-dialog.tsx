"use client"

import { useForm, type Resolver } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
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
import type { Product } from "@/app/dashboard/_data/products"

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    category: z.enum(["headphone", "earphone", "speaker"]),
    price: z.coerce.number().min(0.01, "Price must be greater than 0"),
    stockQuantity: z.coerce.number().int().min(0, "Can't be negative"),
    lowStockThreshold: z.coerce.number().int().min(1, "Threshold must be at least 1"),
    description: z.string().min(1, "Description is required"),
    isNew: z.boolean(),
})

export type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product?: Product
    onSubmit: (data: ProductFormValues) => void
}

export function ProductFormDialog({
    open,
    onOpenChange,
    product,
    onSubmit,
}: ProductFormDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as unknown as Resolver<ProductFormValues>,
        defaultValues: product
            ? {
                  name: product.name,
                  category: product.category,
                  price: product.price,
                  stockQuantity: product.stockQuantity,
                  lowStockThreshold: product.lowStockThreshold,
                  description: product.description,
                  isNew: product.isNew,
              }
            : {
                  name: "",
                  category: "headphone",
                  price: 0,
                  stockQuantity: 0,
                  lowStockThreshold: 5,
                  description: "",
                  isNew: false,
              },
    })

    const category = watch("category")
    const isNew = watch("isNew")

    const handleFormSubmit = (data: ProductFormValues) => {
        onSubmit(data)
        reset()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
                    <DialogDescription>
                        {product ? "Update the product details below." : "Fill in the details to add a new product."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && (
                            <p className="text-sm text-error">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                            value={category}
                            onValueChange={(v) =>
                                setValue("category", v as "headphone" | "earphone" | "speaker")
                            }
                        >
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="headphone">Headphones</SelectItem>
                                <SelectItem value="earphone">Earphones</SelectItem>
                                <SelectItem value="speaker">Speakers</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.category && (
                            <p className="text-sm text-error">{errors.category.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input id="price" type="number" step="0.01" {...register("price")} />
                            {errors.price && (
                                <p className="text-sm text-error">{errors.price.message}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="stockQuantity">Stock Quantity</Label>
                            <Input
                                id="stockQuantity"
                                type="number"
                                {...register("stockQuantity")}
                            />
                            {errors.stockQuantity && (
                                <p className="text-sm text-error">{errors.stockQuantity.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                            <Input
                                id="lowStockThreshold"
                                type="number"
                                {...register("lowStockThreshold")}
                            />
                            {errors.lowStockThreshold && (
                                <p className="text-sm text-error">{errors.lowStockThreshold.message}</p>
                            )}
                        </div>
                        <div className="flex items-end gap-2 pb-2">
                            <input
                                id="isNew"
                                type="checkbox"
                                className="size-4 accent-primary"
                                checked={isNew}
                                onChange={(e) => setValue("isNew", e.target.checked)}
                            />
                            <Label htmlFor="isNew" className="cursor-pointer">
                                New Product
                            </Label>
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
                        {errors.description && (
                            <p className="text-sm text-error">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {product ? "Save Changes" : "Add Product"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
