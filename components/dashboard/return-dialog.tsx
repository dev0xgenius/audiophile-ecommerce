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
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface ReturnData {
    id: string
    reason: string
    status: string
    refundAmount: number
    restocked: boolean
    createdAt: string
    actor: { id: string; name: string } | null
}

interface ReturnDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    orderId: string
    maxRefundAmount: number
    existingReturns: ReturnData[]
    onSuccess: () => void
}

export function ReturnDialog({
    open,
    onOpenChange,
    orderId,
    maxRefundAmount,
    existingReturns,
    onSuccess,
}: ReturnDialogProps) {
    const [reason, setReason] = useState("")
    const [refundAmount, setRefundAmount] = useState(maxRefundAmount)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    const handleCreate = async () => {
        setSubmitting(true)
        setError("")
        try {
            const res = await fetch("/api/returns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, reason, refundAmount }),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? "Failed to create return")
            }
            onSuccess()
            onOpenChange(false)
        } catch (e) {
            setError((e as Error).message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleStatusUpdate = async (returnId: string, status: string) => {
        setSubmitting(true)
        setError("")
        try {
            const res = await fetch(`/api/returns/${returnId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, restocked: status === "restocked" }),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? "Failed to update return")
            }
            onSuccess()
        } catch (e) {
            setError((e as Error).message)
        } finally {
            setSubmitting(false)
        }
    }

    const showCreateForm = existingReturns.every((r) => r.status !== "requested" && r.status !== "approved")

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Returns</DialogTitle>
                    <DialogDescription>Manage returns for this order.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    {existingReturns.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Existing Returns</p>
                            {existingReturns.map((r) => (
                                <div key={r.id} className="rounded-lg border p-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="capitalize text-xs">{r.status}</Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(r.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm">{r.reason}</p>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <span>Refund: ${r.refundAmount.toFixed(2)}</span>
                                        <span>{r.restocked ? "Restocked" : "Not restocked"}</span>
                                    </div>
                                    {(r.status === "requested" || r.status === "approved") && (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-xs"
                                                onClick={() => handleStatusUpdate(r.id, "approved")}
                                                disabled={submitting}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-xs text-error"
                                                onClick={() => handleStatusUpdate(r.id, "rejected")}
                                                disabled={submitting}
                                            >
                                                Reject
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-xs"
                                                onClick={() => handleStatusUpdate(r.id, "restocked")}
                                                disabled={submitting}
                                            >
                                                Restock
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {showCreateForm && (
                        <div className="space-y-3 rounded-lg border p-3">
                            <p className="text-sm font-medium">Create Return Request</p>
                            <div className="grid gap-2">
                                <Label htmlFor="return-reason">Reason</Label>
                                <textarea
                                    id="return-reason"
                                    rows={2}
                                    className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Refund Amount</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    max={maxRefundAmount}
                                    value={refundAmount}
                                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                                />
                            </div>
                            <Button size="sm" onClick={handleCreate} disabled={submitting || !reason}>
                                {submitting ? "Creating..." : "Create Return"}
                            </Button>
                        </div>
                    )}

                    {error && <p className="text-sm text-error">{error}</p>}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
