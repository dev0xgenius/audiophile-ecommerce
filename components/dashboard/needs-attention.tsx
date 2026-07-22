"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { IconAlertTriangle, IconCircleCheck, IconAlertCircle } from "@tabler/icons-react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface AttentionItem {
    type: string
    label: string
    link: string
}

const typeIcons: Record<string, React.ElementType> = {
    low_stock: IconAlertTriangle,
    pending_payment: IconAlertCircle,
    unfulfilled: IconAlertCircle,
    webhook_error: IconAlertTriangle,
}

const typeColors: Record<string, string> = {
    low_stock: "text-warning",
    pending_payment: "text-info",
    unfulfilled: "text-warning",
    webhook_error: "text-danger",
}

export function NeedsAttention() {
    const [items, setItems] = useState<AttentionItem[]>([])
    const [counts, setCounts] = useState({ lowStock: 0, pendingPayments: 0, unfulfilled: 0, webhookErrors: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/dashboard/needs-attention")
            .then((r) => r.json())
            .then((j) => {
                const d = j.data ?? {}
                setItems(d.items ?? [])
                setCounts({
                    lowStock: d.lowStockCount ?? 0,
                    pendingPayments: d.pendingPaymentCount ?? 0,
                    unfulfilled: d.unfulfilledCount ?? 0,
                    webhookErrors: d.webhookErrorCount ?? 0,
                })
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    const totalIssues = counts.lowStock + counts.pendingPayments + counts.unfulfilled + counts.webhookErrors

    return (
        <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Needs Attention</CardTitle>
                {!loading && totalIssues === 0 && (
                    <IconCircleCheck className="size-5 text-success" />
                )}
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-6 rounded bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">All clear — no issues need attention.</p>
                ) : (
                    <div className="space-y-2">
                        {totalIssues > 0 && (
                            <div className="flex gap-3 text-xs text-muted-foreground mb-3 flex-wrap">
                                {counts.lowStock > 0 && <span>{counts.lowStock} low stock</span>}
                                {counts.pendingPayments > 0 && <span>{counts.pendingPayments} unpaid</span>}
                                {counts.unfulfilled > 0 && <span>{counts.unfulfilled} stuck</span>}
                                {counts.webhookErrors > 0 && <span>{counts.webhookErrors} webhook errors</span>}
                            </div>
                        )}
                        {items.map((item, i) => {
                            const Icon = typeIcons[item.type] ?? IconAlertCircle
                            const color = typeColors[item.type] ?? "text-muted-foreground"
                            return (
                                <Link
                                    key={i}
                                    href={item.link}
                                    className="flex items-center gap-2 rounded-lg p-2 text-sm hover:bg-accent transition-colors"
                                >
                                    <Icon className={`size-4 shrink-0 ${color}`} />
                                    <span className="truncate">{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
