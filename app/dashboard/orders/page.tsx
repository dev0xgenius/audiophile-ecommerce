"use client"

import { useState } from "react"
import { OrderTable } from "@/components/dashboard/order-table"
import { orders as initialOrders, type Order, type OrderStatus } from "@/app/dashboard/_data/orders"

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>(initialOrders)

    const handleStatusChange = (orderId: string, status: OrderStatus) => {
        setOrders((prev) =>
            prev.map((o) =>
                o.id === orderId ? { ...o, status } : o
            )
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-8 p-8 lg:p-10">
            <div className="space-y-1.5">
                <h2 className="text-2xl font-semibold tracking-tight gradient-text">Orders</h2>
                <p className="text-sm text-muted-foreground">
                    Track and manage customer orders.
                </p>
            </div>
            <OrderTable orders={orders} onStatusChange={handleStatusChange} />
        </div>
    )
}
