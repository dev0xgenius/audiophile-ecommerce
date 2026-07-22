"use client"

import { IconAlertTriangle } from "@tabler/icons-react"

interface VariantStock {
    stock: number
    lowStockThreshold: number
}

interface ProductWithVariants {
    id: string
    name: string
    variants: VariantStock[]
}

interface LowStockAlertProps {
    products: ProductWithVariants[]
}

export function LowStockAlert({ products }: LowStockAlertProps) {
    let lowStockCount = 0
    let outOfStockCount = 0

    for (const p of products) {
        for (const v of p.variants ?? []) {
            if (v.stock === 0) {
                outOfStockCount++
            } else if (v.stock <= v.lowStockThreshold) {
                lowStockCount++
            }
        }
    }

    if (!lowStockCount && !outOfStockCount) return null

    return (
        <div className="flex flex-wrap gap-2">
            {outOfStockCount > 0 && (
                <div className="flex items-center gap-2 rounded-lg glass px-4 py-2.5 text-sm text-red-400">
                    <IconAlertTriangle className="size-4 shrink-0" />
                    <span>
                        <strong>{outOfStockCount}</strong> variant{outOfStockCount > 1 ? "s" : ""} out of stock
                    </span>
                </div>
            )}
            {lowStockCount > 0 && (
                <div className="flex items-center gap-2 rounded-lg glass px-4 py-2.5 text-sm text-amber-400">
                    <IconAlertTriangle className="size-4 shrink-0" />
                    <span>
                        <strong>{lowStockCount}</strong> variant{lowStockCount > 1 ? "s" : ""} low on stock
                    </span>
                </div>
            )}
        </div>
    )
}
