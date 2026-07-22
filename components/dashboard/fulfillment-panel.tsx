"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface LineItem {
    id: string
    quantity: number
    unitPrice: number
    variant: { id: string; name: string; sku: string } | null
}

interface ShipmentItem {
    id: string
    quantity: number
    lineItem: { id: string; quantity: number }
}

interface Shipment {
    id: string
    trackingNumber: string | null
    carrier: string | null
    shippedAt: string | null
    createdAt: string
    items: ShipmentItem[]
}

interface FulfillmentPanelProps {
    orderId: string
    items: LineItem[]
    shipments: Shipment[]
    onUpdate: () => void
}

export function FulfillmentPanel({ orderId, items, shipments, onUpdate }: FulfillmentPanelProps) {
    const [trackingNumber, setTrackingNumber] = useState("")
    const [carrier, setCarrier] = useState("")

    const fulfilledItemIds = new Set(shipments.flatMap((s) => s.items.map((i) => i.lineItem.id)))

    const unfulfilledItems = items.filter((item) => !fulfilledItemIds.has(item.id))

    const handleCreateShipment = async () => {
        if (unfulfilledItems.length === 0) return
        try {
            const res = await fetch(`/api/orders/${orderId}/fulfill`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: unfulfilledItems.map((item) => ({
                        lineItemId: item.id,
                        quantity: item.quantity,
                    })),
                    trackingNumber: trackingNumber || undefined,
                    carrier: carrier || undefined,
                }),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? "Failed to create shipment")
            }
            toast.success("Shipment created")
            setTrackingNumber("")
            setCarrier("")
            onUpdate()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to create shipment")
        }
    }

    const handleMarkShipped = async (shipmentId: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}/ship`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ shipmentId }),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? "Failed to mark shipped")
            }
            toast.success("Shipment marked as shipped")
            onUpdate()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to mark shipped")
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <p className="text-sm font-medium mb-2">Fulfillment</p>

                {unfulfilledItems.length > 0 && (
                    <div className="space-y-3 rounded-lg bg-muted p-4">
                        <p className="text-xs text-muted-foreground">Unfulfilled items ({unfulfilledItems.length})</p>
                        <div className="space-y-1">
                            {unfulfilledItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{item.variant?.name ?? "Unknown"}</span>
                                    <span className="tabular-nums">×{item.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="grid gap-1">
                                <Label className="text-xs">Tracking Number</Label>
                                <Input
                                    size={1}
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    placeholder="Optional"
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label className="text-xs">Carrier</Label>
                                <Input
                                    size={1}
                                    value={carrier}
                                    onChange={(e) => setCarrier(e.target.value)}
                                    placeholder="e.g. FedEx"
                                />
                            </div>
                        </div>
                        <Button size="sm" onClick={handleCreateShipment}>
                            Create Shipment
                        </Button>
                    </div>
                )}

                {shipments.length > 0 && (
                    <div className="space-y-2 mt-3">
                        <p className="text-xs text-muted-foreground">Shipments ({shipments.length})</p>
                        {shipments.map((s) => (
                            <div key={s.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                                <div className="flex items-center gap-2">
                                    {s.shippedAt ? (
                                        <Badge variant="default" className="text-xs">Shipped</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-xs">Pending</Badge>
                                    )}
                                    <span className="text-muted-foreground">{s.carrier || "No carrier"}</span>
                                    {s.trackingNumber && (
                                        <span className="text-xs text-muted-foreground">#{s.trackingNumber}</span>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                        {s.items.length} item(s)
                                    </span>
                                </div>
                                {!s.shippedAt && (
                                    <Button variant="outline" size="sm" onClick={() => handleMarkShipped(s.id)}>
                                        Mark Shipped
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {unfulfilledItems.length === 0 && shipments.length === 0 && (
                    <p className="text-sm text-muted-foreground">No items to fulfill.</p>
                )}
            </div>
        </div>
    )
}
