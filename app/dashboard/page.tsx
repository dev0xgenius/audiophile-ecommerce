"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { IconPlus, IconEye } from "@tabler/icons-react"
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { NeedsAttention } from "@/components/dashboard/needs-attention";
import { TopProducts } from "@/components/dashboard/top-products";

interface Metrics {
    totalRevenue: number
    orderCount: number
    pendingOrders: number
    activeProducts: number
    customerCount: number
    recentOrders: Array<{
        id: string
        orderNumber: number
        customerName: string
        status: string
        total: number
        createdAt: string
    }>
}

export default function Page() {
    const [metrics, setMetrics] = useState<Metrics | null>(null)

    useEffect(() => {
        fetch("/api/dashboard/metrics")
            .then((r) => r.json())
            .then((j) => setMetrics(j.data ?? null))
            .catch(() => {})
    }, [])

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-10 py-10 md:gap-14 md:py-14">
                    <SectionCards
                        revenue={{
                            value: metrics ? `$${metrics.totalRevenue.toLocaleString()}` : "—",
                            badge: metrics ? `${metrics.orderCount} orders` : "",
                        }}
                        orders={{
                            value: metrics ? String(metrics.orderCount) : "—",
                            badge: metrics ? `${metrics.pendingOrders} pending` : "",
                        }}
                        products={{
                            value: metrics ? String(metrics.activeProducts) : "—",
                            badge: metrics ? `${metrics.activeProducts} active` : "",
                        }}
                        customers={{
                            value: metrics ? String(metrics.customerCount) : "—",
                            badge: metrics ? `${metrics.customerCount} total` : "",
                        }}
                    />
                    <div className="px-4 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <ChartAreaInteractive />
                        </div>
                        <NeedsAttention />
                    </div>
                    <div className="px-4 lg:px-8">
                        <TopProducts />
                    </div>
                    <div className="px-4 lg:px-8 flex items-start gap-6">
                        <div className="flex-1">
                            <RecentOrders orders={metrics?.recentOrders ?? []} />
                        </div>
                        <div className="hidden lg:flex flex-col gap-3 w-56 shrink-0">
                            <Link
                                href="/dashboard/products"
                                className="flex items-center gap-2 rounded-lg border p-3 text-sm font-medium hover:bg-accent transition-colors"
                            >
                                <IconPlus className="size-4 text-primary" />
                                Add Product
                            </Link>
                            <Link
                                href="/dashboard/orders"
                                className="flex items-center gap-2 rounded-lg border p-3 text-sm font-medium hover:bg-accent transition-colors"
                            >
                                <IconEye className="size-4 text-primary" />
                                View Orders
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
