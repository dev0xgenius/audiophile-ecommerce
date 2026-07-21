"use client"

import { useEffect, useState } from "react"
import { IconTrophy, IconCategory } from "@tabler/icons-react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface TopProduct {
    productId: string
    productName: string
    variantName: string
    quantitySold: number
    revenue: number
}

interface TopCategory {
    categoryId: string
    categoryName: string
    quantitySold: number
    revenue: number
}

export function TopProducts() {
    const [products, setProducts] = useState<TopProduct[]>([])
    const [categories, setCategories] = useState<TopCategory[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/dashboard/top-products?period=30d&limit=10")
            .then((r) => r.json())
            .then((j) => {
                const d = j.data ?? {}
                setProducts(d.products ?? [])
                setCategories(d.categories ?? [])
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <Card className="glass-card card-accent">
                <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-8 rounded bg-muted animate-pulse" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card card-accent">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <IconTrophy className="size-4 text-primary" />
                        Top Products
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {products.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No sales data for this period.</p>
                    ) : (
                        <div className="space-y-3">
                            {products.map((p, i) => (
                                <div key={p.productId} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">
                                            #{i + 1}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">{p.productName}</p>
                                            <p className="text-xs text-muted-foreground truncate">{p.variantName}</p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-4">
                                        <p className="text-sm font-medium">{p.quantitySold} sold</p>
                                        <p className="text-xs text-muted-foreground">${p.revenue.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="glass-card card-accent">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <IconCategory className="size-4 text-primary" />
                        Top Categories
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {categories.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No category data for this period.</p>
                    ) : (
                        <div className="space-y-3">
                            {categories.map((c, i) => (
                                <div key={c.categoryId} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                                        <p className="text-sm font-medium">{c.categoryName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{c.quantitySold} sold</p>
                                        <p className="text-xs text-muted-foreground">${c.revenue.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
