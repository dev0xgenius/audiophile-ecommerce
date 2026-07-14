"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import type { Order } from "@/app/dashboard/_data/orders"

interface OrderDetailDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    order: Order | null
}

export function OrderDetailDialog({ open, onOpenChange, order }: OrderDetailDialogProps) {
    if (!order) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Order #{order.orderNumber}</DialogTitle>
                    <DialogDescription>
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-4">
                        <div>
                            <p className="text-sm font-medium">Customer</p>
                            <p className="text-sm text-muted-foreground">{order.customerName}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium mb-2">Items</p>
                        <div className="divide-y rounded-lg border">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{item.productName}</span>
                                        <span className="text-muted-foreground">×{item.quantity}</span>
                                    </div>
                                    <span className="tabular-nums">
                                        ${(item.unitPrice * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold tabular-nums">
                            ${order.total.toLocaleString()}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
