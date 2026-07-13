"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InventoryAdjustDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    productName: string
    currentStock: number
    onConfirm: (newQuantity: number) => void
}

export function InventoryAdjustDialog({
    open,
    onOpenChange,
    productName,
    currentStock,
    onConfirm,
}: InventoryAdjustDialogProps) {
    const [quantity, setQuantity] = useState(String(currentStock))
    const [error, setError] = useState("")

    const handleConfirm = () => {
        const n = parseInt(quantity, 10)
        if (isNaN(n) || n < 0) {
            setError("Please enter a valid non-negative number")
            return
        }
        onConfirm(n)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adjust Stock</DialogTitle>
                    <DialogDescription>
                        Update stock quantity for <strong>{productName}</strong>.
                        Current stock: {currentStock}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                    <Label htmlFor="quantity">New Stock Quantity</Label>
                    <Input
                        id="quantity"
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={(e) => {
                            setQuantity(e.target.value)
                            setError("")
                        }}
                    />
                    {error && <p className="text-sm text-error">{error}</p>}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm}>Update Stock</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
