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
import { Badge } from "@/components/ui/badge"

interface RefundData {
    id: string
    amount: number
    currency: string
    reason: string | null
    status: string
    pspRefundId: string | null
    createdAt: string
}

interface RefundDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    orderId: string
    paymentId: string
    maxAmount: number
    existingRefunds: RefundData[]
    onSuccess: () => void
}

export function RefundDialog({
    open,
    onOpenChange,
    orderId,
    paymentId,
    maxAmount,
    existingRefunds,
    onSuccess,
}: RefundDialogProps) {
    const [amount, setAmount] = useState(maxAmount)
    const [reason, setReason] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    const totalRefunded = existingRefunds.reduce((s, r) => s + (r.status === "succeeded" ? r.amount : 0), 0)
    const remaining = maxAmount - totalRefunded

    const handleSubmit = async () => {
        setSubmitting(true)
        setError("")
        try {
            const res = await fetch(`/api/orders/${orderId}/refund`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: amount > 0 ? amount : undefined, reason: reason || undefined }),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? "Refund failed")
            }
            onSuccess()
            onOpenChange(false)
        } catch (e) {
            setError((e as Error).message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Issue Refund</DialogTitle>
                    <DialogDescription>
                        Process a refund for this order. Payment will be returned via {paymentId.slice(0, 8)}...
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    {existingRefunds.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Previous Refunds</p>
                            {existingRefunds.map((r) => (
                                <div key={r.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={r.status === "succeeded" ? "default" : r.status === "failed" ? "destructive" : "outline"}
                                            className="text-xs"
                                        >
                                            {r.status}
                                        </Badge>
                                        <span>${r.amount.toFixed(2)}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(r.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label>Refund Amount</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                step="0.01"
                                min={0.01}
                                max={remaining}
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                            <span className="text-sm text-muted-foreground">
                                / ${remaining.toFixed(2)} remaining
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="reason">Reason (optional)</Label>
                        <textarea
                            id="reason"
                            rows={2}
                            className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-sm text-error">{error}</p>}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={submitting || amount <= 0 || amount > remaining}>
                        {submitting ? "Processing..." : "Issue Refund"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
