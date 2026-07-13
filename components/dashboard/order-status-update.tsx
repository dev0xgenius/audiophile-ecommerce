"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { OrderStatus } from "@/app/dashboard/_data/orders"

const statusLabels: Record<OrderStatus, { label: string; color: string }> = {
    pending: { label: "Pending", color: "text-amber-600" },
    processing: { label: "Processing", color: "text-blue-600" },
    shipped: { label: "Shipped", color: "text-purple-600" },
    delivered: { label: "Delivered", color: "text-green-600" },
    cancelled: { label: "Cancelled", color: "text-red-600" },
}

interface OrderStatusUpdateProps {
    value: OrderStatus
    onChange: (value: OrderStatus) => void
}

export function OrderStatusUpdate({ value, onChange }: OrderStatusUpdateProps) {
    const current = statusLabels[value]

    return (
        <Select value={value} onValueChange={(v) => onChange(v as OrderStatus)}>
            <SelectTrigger
                size="sm"
                className={`w-32 border-0 bg-transparent font-medium shadow-none hover:bg-accent/50 ${current.color}`}
            >
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent align="end">
                {(Object.keys(statusLabels) as OrderStatus[]).map((status) => (
                    <SelectItem key={status} value={status}>
                        <span className={statusLabels[status].color}>
                            {statusLabels[status].label}
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
