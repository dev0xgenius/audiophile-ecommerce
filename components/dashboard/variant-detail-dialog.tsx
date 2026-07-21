"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface Variant {
    id: string
    sku: string
    name: string
    priceDelta: number
    stock: number
    lowStockThreshold: number
    weightDelta: number | null
    isActive: boolean
}

interface VariantDetailDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    variantId: string | null
    onAdjust?: (variantId: string) => void
    onViewLedger?: (variantId: string) => void
}

export function VariantDetailDialog({
    open,
    onOpenChange,
    variantId,
    onAdjust,
    onViewLedger,
}: VariantDetailDialogProps) {
    const [variant] = useState<Variant | null>(null)
    const [loading] = useState(false)

    if (!variantId) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Variant Details</DialogTitle>
                    <DialogDescription>
                        View and manage this product variant.
                    </DialogDescription>
                </DialogHeader>
                {loading ? (
                    <div className="space-y-3">
                        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                        <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                    </div>
                ) : variant ? (
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-4 text-sm">
                            <div>
                                <p className="font-medium text-muted-foreground">Name</p>
                                <p>{variant.name}</p>
                            </div>
                            <div>
                                <p className="font-medium text-muted-foreground">SKU</p>
                                <p>{variant.sku}</p>
                            </div>
                            <div>
                                <p className="font-medium text-muted-foreground">Stock</p>
                                <p className={variant.stock <= variant.lowStockThreshold ? "text-error font-semibold" : ""}>
                                    {variant.stock}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium text-muted-foreground">Threshold</p>
                                <p>{variant.lowStockThreshold}</p>
                            </div>
                            <div>
                                <p className="font-medium text-muted-foreground">Price Delta</p>
                                <p>${variant.priceDelta.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="font-medium text-muted-foreground">Weight Delta</p>
                                <p>{variant.weightDelta ? `${variant.weightDelta}kg` : "—"}</p>
                            </div>
                            <div>
                                <p className="font-medium text-muted-foreground">Status</p>
                                <Badge variant={variant.isActive ? "default" : "outline"}>
                                    {variant.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {onAdjust && (
                                <button
                                    className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                                    onClick={() => { onAdjust(variantId); onOpenChange(false) }}
                                >
                                    Adjust Stock
                                </button>
                            )}
                            {onViewLedger && (
                                <button
                                    className="flex-1 rounded-lg border border-input bg-transparent px-4 py-2 text-sm font-medium hover:bg-accent"
                                    onClick={() => { onViewLedger(variantId); onOpenChange(false) }}
                                >
                                    View Ledger
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Variant not found.</p>
                )}
            </DialogContent>
        </Dialog>
    )
}
