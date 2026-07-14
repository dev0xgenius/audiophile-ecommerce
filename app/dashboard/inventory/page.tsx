"use client"

import { useState } from "react"
import { LowStockAlert } from "@/components/dashboard/low-stock-alert"
import { InventoryTable } from "@/components/dashboard/inventory-table"
import { products as initialProducts, type Product } from "@/app/dashboard/_data/products"

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>(initialProducts)

    const handleAdjust = (productId: string, newQuantity: number) => {
        setProducts((prev) =>
            prev.map((p) =>
                p.id === productId ? { ...p, stockQuantity: newQuantity } : p
            )
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-8 p-8 lg:p-10">
            <div className="space-y-1.5">
                <h2 className="text-2xl font-semibold tracking-tight gradient-text">Inventory</h2>
                <p className="text-sm text-muted-foreground">
                    Monitor stock levels and manage inventory across all products.
                </p>
            </div>
            <LowStockAlert products={products} />
            <InventoryTable products={products} onAdjust={handleAdjust} />
        </div>
    )
}
