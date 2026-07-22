"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconArrowBackUp, IconRotate } from "@tabler/icons-react"
import { FulfillmentPanel } from "@/components/dashboard/fulfillment-panel"
import { RefundDialog } from "@/components/dashboard/refund-dialog"
import { ReturnDialog } from "@/components/dashboard/return-dialog"

interface ShipmentItemData {
    id: string
    quantity: number
    lineItem: { id: string; quantity: number }
}

interface ShipmentData {
    id: string
    trackingNumber: string | null
    carrier: string | null
    shippedAt: string | null
    createdAt: string
    items: ShipmentItemData[]
}

interface RefundData {
    id: string
    amount: number
    currency: string
    reason: string | null
    status: string
    pspRefundId: string | null
    createdAt: string
}

interface ReturnData {
    id: string
    reason: string
    status: string
    refundAmount: number
    restocked: boolean
    createdAt: string
    actor: { id: string; name: string } | null
}

interface PaymentData {
    id: string
    amount: number
    status: string
    provider: string
    refunds?: RefundData[]
}

interface OrderDetail {
    id: string
    status: string
    total: number
    subtotal: number
    shippingCost: number
    taxAmount: number
    discountAmount: number
    createdAt: string
    customer: { id: string; name: string; email: string; phone: string | null } | null
    items: Array<{
        id: string
        quantity: number
        unitPrice: number
        lineTotal: number
        variant: { id: string; name: string; sku: string } | null
    }>
    payments: PaymentData[]
    statusHistory: Array<{
        fromStatus: string | null
        toStatus: string
        actor: { id: string; name: string } | null
        note: string | null
        timestamp: string
    }>
    shipments: ShipmentData[]
    returns?: ReturnData[]
}

interface OrderDetailDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    orderId: string | null
}

export function OrderDetailDialog({ open, onOpenChange, orderId }: OrderDetailDialogProps) {
    const [detail, setDetail] = useState<OrderDetail | null>(null)
    const [refundDialogOpen, setRefundDialogOpen] = useState(false)
    const [returnDialogOpen, setReturnDialogOpen] = useState(false)

    const fetchDetail = () => {
        if (!open || !orderId) return
        fetch(`/api/orders/${orderId}`)
            .then((r) => r.json())
            .then((j) => setDetail(j.data ?? null))
            .catch(() => setDetail(null))
    }

    useEffect(() => {
        fetchDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, orderId])

    const successfulPayment = detail?.payments?.find((p) => p.status === "succeeded" || p.status === "paid")

    if (!detail) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Order #{detail.id.slice(-6)}</DialogTitle>
                    <DialogDescription>
                        Placed on {new Date(detail.createdAt).toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric",
                        })}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-4">
                        <div>
                            <p className="text-sm font-medium">Customer</p>
                            <p className="text-sm text-muted-foreground">{detail.customer?.name ?? "Guest"}</p>
                            <p className="text-sm text-muted-foreground">{detail.customer?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Status</p>
                            <Badge variant="outline" className="capitalize mt-1">{detail.status.replace(/_/g, " ")}</Badge>
                        </div>
                    </div>

                    {successfulPayment && (
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setRefundDialogOpen(true)}
                                disabled={detail.status === "refunded" || detail.status === "cancelled"}
                            >
                                <IconArrowBackUp className="size-4 mr-1" />
                                Refund
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setReturnDialogOpen(true)}
                            >
                                <IconRotate className="size-4 mr-1" />
                                Returns
                            </Button>
                        </div>
                    )}

                    <div>
                        <p className="text-sm font-medium mb-2">Items</p>
                        <div className="divide-y rounded-lg border">
                            {detail.items.length === 0 && (
                                <p className="p-3 text-sm text-muted-foreground">No items</p>
                            )}
                            {detail.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{item.variant?.name ?? "Unknown"}</span>
                                        <span className="text-muted-foreground">×{item.quantity}</span>
                                    </div>
                                    <span className="tabular-nums">${item.lineTotal.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span>Subtotal</span><span className="tabular-nums">${detail.subtotal.toLocaleString()}</span></div>
                        {detail.shippingCost > 0 && <div className="flex justify-between"><span>Shipping</span><span className="tabular-nums">${detail.shippingCost.toLocaleString()}</span></div>}
                        {detail.taxAmount > 0 && <div className="flex justify-between"><span>Tax</span><span className="tabular-nums">${detail.taxAmount.toLocaleString()}</span></div>}
                        {detail.discountAmount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span className="tabular-nums">-${detail.discountAmount.toLocaleString()}</span></div>}
                        <div className="flex justify-between border-t pt-1 font-semibold"><span>Total</span><span className="tabular-nums">${detail.total.toLocaleString()}</span></div>
                    </div>

                    {detail.payments && detail.payments.length > 0 && (
                        <div>
                            <p className="text-sm font-medium mb-2">Payments & Refunds</p>
                            <div className="space-y-2">
                                {detail.payments.map((p) => (
                                    <div key={p.id}>
                                        <div className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={
                                                        p.status === "succeeded" || p.status === "paid"
                                                            ? "default"
                                                            : p.status === "failed"
                                                            ? "destructive"
                                                            : "outline"
                                                    }
                                                    className="text-xs capitalize"
                                                >
                                                    {p.status}
                                                </Badge>
                                                <span className="font-medium">{p.provider}</span>
                                            </div>
                                            <span className="tabular-nums">${p.amount.toLocaleString()}</span>
                                        </div>
                                        {p.refunds && p.refunds.length > 0 && (
                                            <div className="ml-4 mt-1 space-y-1">
                                                {p.refunds.map((r) => (
                                                    <div key={r.id} className="flex items-center justify-between rounded-lg border border-dashed px-3 py-1.5 text-xs">
                                                        <div className="flex items-center gap-2">
                                                            <Badge
                                                                variant={r.status === "succeeded" ? "default" : r.status === "failed" ? "destructive" : "outline"}
                                                                className="text-[10px]"
                                                            >
                                                                {r.status}
                                                            </Badge>
                                                            <span className="text-muted-foreground">Refund</span>
                                                        </div>
                                                        <span className="tabular-nums">-${r.amount.toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {detail.shipments && detail.shipments.length > 0 && (
                        <div>
                            <p className="text-sm font-medium mb-2">Shipments</p>
                            <div className="space-y-2">
                                {detail.shipments.map((s) => (
                                    <div key={s.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Badge variant={s.shippedAt ? "default" : "outline"} className="text-xs">
                                                {s.shippedAt ? "Shipped" : "Pending"}
                                            </Badge>
                                            <span className="text-muted-foreground">{s.carrier || "No carrier"}</span>
                                            {s.trackingNumber && (
                                                <span className="text-xs text-muted-foreground">#{s.trackingNumber}</span>
                                            )}
                                            <span className="text-xs text-muted-foreground">{s.items.length} item(s)</span>
                                        </div>
                                        {s.shippedAt && (
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(s.shippedAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {detail.returns && detail.returns.length > 0 && (
                        <div>
                            <p className="text-sm font-medium mb-2">Returns</p>
                            <div className="space-y-2">
                                {detail.returns.map((r) => (
                                    <div key={r.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs capitalize">{r.status}</Badge>
                                            <span className="text-muted-foreground truncate max-w-[200px]">{r.reason}</span>
                                        </div>
                                        <span className="tabular-nums text-xs text-muted-foreground">
                                            ${r.refundAmount.toFixed(2)} {r.restocked ? "• Restocked" : ""}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <FulfillmentPanel
                        orderId={detail.id}
                        items={detail.items}
                        shipments={detail.shipments ?? []}
                        onUpdate={fetchDetail}
                    />

                    {detail.statusHistory.length > 0 && (
                        <div>
                            <p className="text-sm font-medium mb-2">Status History</p>
                            <div className="space-y-2">
                                {detail.statusHistory.map((h, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <div>
                                            <span className="capitalize">{h.toStatus.replace(/_/g, " ")}</span>
                                            {h.note && <span className="text-muted-foreground ml-2">— {h.note}</span>}
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(h.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <RefundDialog
                        open={refundDialogOpen}
                        onOpenChange={setRefundDialogOpen}
                        orderId={detail.id}
                        paymentId={successfulPayment?.id ?? ""}
                        maxAmount={successfulPayment?.amount ?? 0}
                        existingRefunds={(successfulPayment?.refunds ?? []) as RefundData[]}
                        onSuccess={fetchDetail}
                    />
                    <ReturnDialog
                        open={returnDialogOpen}
                        onOpenChange={setReturnDialogOpen}
                        orderId={detail.id}
                        maxRefundAmount={detail.total}
                        existingReturns={(detail.returns ?? []) as ReturnData[]}
                        onSuccess={fetchDetail}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
