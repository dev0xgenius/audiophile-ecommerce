"use client"

import { useCallback, useEffect, useState } from "react"
import { OrderTable } from "@/components/dashboard/order-table"

export interface OrderRow {
    id: string
    orderNumber: number
    customerName: string
    customerEmail: string
    status: string
    total: number
    itemCount: number
    createdAt: string
}

interface ApiOrderData {
    id: string
    customer: { name: string; email: string } | null
    status: string
    total: number
    items: unknown[]
    createdAt: string
}

interface OrdersResponse {
    data: ApiOrderData[]
    meta: { page: number; pageSize: number; total: number; totalPages: number }
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderRow[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchOrders = useCallback(async () => {
        try {
            const res = await fetch(`/api/orders?page=${page}&pageSize=20`)
            if (!res.ok) throw new Error("Failed to fetch")
            const json: OrdersResponse = await res.json()
            setTotalPages(json.meta.totalPages)
            const mapped: OrderRow[] = json.data.map((o: ApiOrderData) => ({
                id: o.id,
                orderNumber: parseInt(o.id.slice(-4), 16) || 1000,
                customerName: o.customer?.name ?? "Guest",
                customerEmail: o.customer?.email ?? "",
                status: o.status,
                total: o.total,
                itemCount: o.items?.length ?? 0,
                createdAt: o.createdAt,
            }))
            setOrders(mapped)
        } catch {
            // silent
        }
    }, [page])

    useEffect(() => {
        fetchOrders()
    }, [fetchOrders])

    const handleStatusChange = async (orderId: string, status: string) => {
        if (!orderId && !status) {
            await fetchOrders();
            return;
        }
        const res = await fetch(`/api/orders/${orderId}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        })
        if (!res.ok) throw new Error("Failed to update status")
        await fetchOrders()
    }

    return (
        <div className="flex flex-1 flex-col gap-8 p-8 lg:p-10">
            <div className="space-y-1.5">
                <h2 className="text-2xl font-semibold tracking-tight gradient-text">Orders</h2>
                <p className="text-sm text-secondary">
                    Track and manage customer orders.
                </p>
            </div>
            <OrderTable orders={orders} onStatusChange={handleStatusChange} page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    )
}
