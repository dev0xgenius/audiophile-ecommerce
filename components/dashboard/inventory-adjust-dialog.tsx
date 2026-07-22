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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const reasonOptions = [
    { value: "restock", label: "Restock" },
    { value: "sale", label: "Sale" },
    { value: "adjustment", label: "Adjustment" },
    { value: "return", label: "Return" },
    { value: "damaged", label: "Damaged" },
    { value: "correction", label: "Correction" },
] as const

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
    const [delta, setDelta] = useState("")
    const [reason, setReason] = useState("adjustment")
    const [error, setError] = useState("")

    const handleConfirm = () => {
        const d = parseInt(delta, 10)
        if (isNaN(d) || d === 0) {
            setError("Please enter a non-zero delta value")
            return
        }
        const newQty = currentStock + d
        if (newQty < 0) {
            setError(`Insufficient stock: current is ${currentStock}, cannot decrease by ${Math.abs(d)}`)
            return
        }
        onConfirm(newQty)
        setDelta("")
        setReason("adjustment")
        setError("")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adjust Stock</DialogTitle>
                    <DialogDescription>
                        Update stock for <strong>{productName}</strong>.
                        Current stock: <strong>{currentStock}</strong>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Select value={reason} onValueChange={(v: string) => setReason(v)}>
                            <SelectTrigger id="reason">
                                <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                            <SelectContent>
                                {reasonOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="delta">
                            Delta (positive to add, negative to remove)
                        </Label>
                        <Input
                            id="delta"
                            type="number"
                            value={delta}
                            onChange={(e) => {
                                setDelta(e.target.value)
                                setError("")
                            }}
                            placeholder="e.g. 10 or -5"
                        />
                        {delta && !isNaN(parseInt(delta, 10)) && parseInt(delta, 10) !== 0 && (
                            <p className="text-sm text-muted-foreground">
                                New stock will be: {currentStock + parseInt(delta, 10)}
                            </p>
                        )}
                        {error && <p className="text-sm text-error">{error}</p>}
                    </div>
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
