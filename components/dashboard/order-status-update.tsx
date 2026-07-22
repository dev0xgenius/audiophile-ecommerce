"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const statusLabels: Record<string, { label: string; color: string }> = {
    pending_payment: { label: "Pending Payment", color: "text-warning" },
    paid: { label: "Paid", color: "text-info" },
    processing: { label: "Processing", color: "text-info" },
    shipped: { label: "Shipped", color: "text-info" },
    delivered: { label: "Delivered", color: "text-success" },
    cancelled: { label: "Cancelled", color: "text-danger" },
    refunded: { label: "Refunded", color: "text-danger" },
    partially_refunded: { label: "Partially Refunded", color: "text-warning" },
}

interface OrderStatusUpdateProps {
    value: string
    onChange: (value: string) => void
}

export function OrderStatusUpdate({ value, onChange }: OrderStatusUpdateProps) {
    const current = statusLabels[value]

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger
                size="sm"
                className={`w-36 border-0 bg-transparent font-medium shadow-none hover:bg-accent/50 ${current?.color ?? ""}`}
            >
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent align="end">
                {Object.entries(statusLabels).map(([status, info]) => (
                    <SelectItem key={status} value={status}>
                        <span className={info.color}>{info.label}</span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
