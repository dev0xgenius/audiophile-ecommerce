"use client"

import { IconAlertTriangle } from "@tabler/icons-react"
import type { Product } from "@/app/dashboard/_data/products"

interface LowStockAlertProps {
    products: Product[]
}

export function LowStockAlert({ products }: LowStockAlertProps) {
    const lowStock = products.filter(
        (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold
    )
    const outOfStock = products.filter((p) => p.stockQuantity === 0)

    if (!lowStock.length && !outOfStock.length) return null

    return (
        <div className="flex flex-wrap gap-2">
            {outOfStock.length > 0 && (
                <div className="flex items-center gap-2 rounded-lg glass px-4 py-2.5 text-sm text-red-400">
                    <IconAlertTriangle className="size-4 shrink-0" />
                    <span>
                        <strong>{outOfStock.length}</strong> product{outOfStock.length > 1 ? "s" : ""} out of stock
                    </span>
                </div>
            )}
            {lowStock.length > 0 && (
                <div className="flex items-center gap-2 rounded-lg glass px-4 py-2.5 text-sm text-amber-400">
                    <IconAlertTriangle className="size-4 shrink-0" />
                    <span>
                        <strong>{lowStock.length}</strong> product{lowStock.length > 1 ? "s" : ""} low on stock
                    </span>
                </div>
            )}
        </div>
    )
}
