"use client"

import { useEffect, useState } from "react"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

interface LedgerEntry {
    id: string
    delta: number
    reason: string
    reasonDetail: string | null
    beforeQuantity: number
    afterQuantity: number
    actor: { id: string; name: string } | null
    timestamp: string
}

interface StockLedgerProps {
    variantId: string | null
    open: boolean
}

export function StockLedger({ variantId, open }: StockLedgerProps) {
    const [entries, setEntries] = useState<LedgerEntry[]>([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        if (!open || !variantId) return
        let active = true
        fetch(`/api/stock/ledger?variantId=${variantId}&page=${page}&pageSize=10`)
            .then((r) => r.json())
            .then((j) => {
                if (active) {
                    setEntries(j.data ?? [])
                    setTotalPages(j.meta?.totalPages ?? 1)
                    setLoading(false)
                }
            })
            .catch(() => {
                if (active) {
                    setEntries([])
                    setLoading(false)
                }
            })
        return () => { active = false }
    }, [variantId, page, open])

    if (!variantId) return null

    const reasonBadge = (reason: string) => {
        const colors: Record<string, string> = {
            restock: "text-success",
            sale: "text-error",
            adjustment: "text-warning",
            return: "text-info",
            damaged: "text-error",
            correction: "text-muted-foreground",
        }
        return <span className={`text-xs font-medium capitalize ${colors[reason] ?? ""}`}>{reason}</span>
    }

    return (
        <div className="space-y-3">
            <p className="text-sm font-medium">Stock Movement History</p>
            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-10 animate-pulse rounded bg-muted" />
                    ))}
                </div>
            ) : entries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No stock movements recorded.</p>
            ) : (
                <>
                    <div className="divide-y rounded-lg border text-sm">
                        {entries.map((e) => (
                            <div key={e.id} className="flex items-center justify-between px-3 py-2.5">
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`tabular-nums font-bold ${
                                            e.delta > 0 ? "text-success" : "text-error"
                                        }`}
                                    >
                                        {e.delta > 0 ? "+" : ""}{e.delta}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {e.beforeQuantity} → {e.afterQuantity}
                                    </span>
                                    {reasonBadge(e.reason)}
                                    {e.reasonDetail && (
                                        <span className="text-xs text-muted-foreground" title={e.reasonDetail}>
                                            — {e.reasonDetail}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span>{e.actor?.name ?? "System"}</span>
                                    <span>{new Date(e.timestamp).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="size-8 p-0"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                            >
                                <IconChevronLeft className="size-4" />
                            </Button>
                            <span className="text-xs text-muted-foreground">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                className="size-8 p-0"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                            >
                                <IconChevronRight className="size-4" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
