"use client"

import { useCallback, useEffect, useState } from "react"
import { LowStockAlert } from "@/components/dashboard/low-stock-alert"
import { InventoryTable } from "@/components/dashboard/inventory-table"
import { InventoryAdjustDialog } from "@/components/dashboard/inventory-adjust-dialog"

interface VariantData {
    id: string
    sku: string
    name: string
    priceDelta: number
    stock: number
    lowStockThreshold: number
    weightDelta: number | null
    isActive: boolean
}

interface ProductData {
    id: string
    name: string
    sku: string | null
    brand: string | null
    category: { id: string; name: string; slug: string } | null
    variants: VariantData[]
    basePrice: number
    status: string
}

export default function InventoryPage() {
    const [products, setProducts] = useState<ProductData[]>([])
    const [loading, setLoading] = useState(true)
    const [adjustTarget, setAdjustTarget] = useState<{ variantId: string; variantName: string; currentStock: number } | null>(null)

    const fetchProducts = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/products?pageSize=100")
            if (!res.ok) throw new Error("Failed to fetch")
            const json = await res.json()
            setProducts(json.data ?? [])
        } catch {
            // silent
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    const handleAdjust = (variantId: string, variantName: string, currentStock: number) => {
        setAdjustTarget({ variantId, variantName, currentStock })
    }

    const handleAdjustConfirm = async (newQuantity: number) => {
        if (!adjustTarget) return
        const delta = newQuantity - adjustTarget.currentStock
        if (delta === 0) {
            setAdjustTarget(null)
            return
        }
        try {
            const res = await fetch("/api/stock/adjust", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    variantId: adjustTarget.variantId,
                    delta,
                    reason: "adjustment",
                }),
            })
            if (!res.ok) throw new Error("Failed to adjust stock")
            await fetchProducts()
        } catch {
            // silent
        }
        setAdjustTarget(null)
    }

    return (
        <div className="flex flex-1 flex-col gap-8 p-8 lg:p-10">
            <div className="space-y-1.5">
                <h2 className="text-2xl font-semibold tracking-tight gradient-text">Inventory</h2>
                <p className="text-sm text-secondary">
                    Monitor stock levels and manage inventory across all products.
                </p>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
                    ))}
                </div>
            ) : (
                <>
                    <LowStockAlert products={products} />
                    <InventoryTable products={products} onAdjust={handleAdjust} />
                </>
            )}

            <InventoryAdjustDialog
                open={!!adjustTarget}
                onOpenChange={(open) => !open && setAdjustTarget(null)}
                productName={adjustTarget?.variantName ?? ""}
                currentStock={adjustTarget?.currentStock ?? 0}
                onConfirm={handleAdjustConfirm}
            />
        </div>
    )
}
