"use client"

import { useState } from "react"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ProductTable } from "@/components/dashboard/product-table"
import { ProductFormDialog } from "@/components/dashboard/product-form-dialog"
import { ProductDeleteDialog } from "@/components/dashboard/product-delete-dialog"
import { products as initialProducts, type Product } from "@/app/dashboard/_data/products"
import type { ProductFormValues } from "@/components/dashboard/product-form-dialog"

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [formOpen, setFormOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | undefined>()
    const [deletingProduct, setDeletingProduct] = useState<Product | undefined>()

    const handleAdd = (data: ProductFormValues) => {
        const newProduct: Product = {
            id: `prod-${Date.now()}`,
            name: data.name,
            category: data.category,
            price: data.price,
            stockQuantity: data.stockQuantity,
            lowStockThreshold: data.lowStockThreshold,
            description: data.description,
            isNew: data.isNew,
            addedAt: new Date().toISOString(),
        }
        setProducts((prev) => [newProduct, ...prev])
    }

    const handleEdit = (data: ProductFormValues) => {
        if (!editingProduct) return
        setProducts((prev) =>
            prev.map((p) =>
                p.id === editingProduct.id
                    ? { ...p, ...data, id: p.id, addedAt: p.addedAt }
                    : p
            )
        )
    }

    const handleDelete = () => {
        if (!deletingProduct) return
        setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id))
        setDeletingProduct(undefined)
    }

    const openAdd = () => {
        setEditingProduct(undefined)
        setFormOpen(true)
    }

    const openEdit = (product: Product) => {
        setEditingProduct(product)
        setFormOpen(true)
    }

    const openDelete = (product: Product) => {
        setDeletingProduct(product)
        setDeleteOpen(true)
    }

    return (
        <div className="flex flex-1 flex-col gap-8 p-8 lg:p-10">
            <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                    <h2 className="text-2xl font-semibold tracking-tight gradient-text">Products</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage your product catalog, stock levels, and pricing.
                    </p>
                </div>
                <Button onClick={openAdd}>
                    <IconPlus className="size-4 mr-2" />
                    Add Product
                </Button>
            </div>
            <ProductTable products={products} onEdit={openEdit} onDelete={openDelete} />
            <ProductFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                product={editingProduct}
                onSubmit={editingProduct ? handleEdit : handleAdd}
            />
            <ProductDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                productName={deletingProduct?.name ?? ""}
                onConfirm={handleDelete}
            />
        </div>
    )
}
