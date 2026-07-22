"use client"

import { useCallback, useEffect, useState } from "react"
import { IconPlus, IconCreditCard } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PspFormDialog } from "@/components/dashboard/psp-form"

interface PSPConnection {
    id: string
    provider: string
    label: string
    isEnabled: boolean
    isDefault: boolean
    priorityOrder: number
    liveMode: boolean
    restrictedCurrencies: string[]
    restrictedRegions: string[]
    createdAt: string
    updatedAt: string
}

export default function PaymentsPage() {
    const [connections, setConnections] = useState<PSPConnection[]>([])
    const [loading, setLoading] = useState(true)
    const [formOpen, setFormOpen] = useState(false)

    const fetchConnections = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/psp/connections")
            if (!res.ok) throw new Error("Failed to fetch")
            const json = await res.json()
            setConnections(json.data ?? [])
        } catch {
            // silent
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchConnections()
    }, [fetchConnections])

    return (
        <div className="flex flex-1 flex-col gap-8 p-8 lg:p-10">
            <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                    <h2 className="text-2xl font-semibold tracking-tight gradient-text">Payments</h2>
                    <p className="text-sm text-secondary">
                        Manage payment service provider connections.
                    </p>
                </div>
                <Button onClick={() => setFormOpen(true)} className="gap-1.5">
                    <IconPlus className="size-4" />
                    Add Provider
                </Button>
            </div>

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-32 animate-pulse rounded-xl glass" />
                    ))}
                </div>
            ) : connections.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-xl glass p-12 text-center">
                    <IconCreditCard className="size-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No payment providers connected yet.</p>
                    <Button variant="outline" onClick={() => setFormOpen(true)}>
                        Add your first provider
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {connections.map((conn) => (
                        <div key={conn.id} className="glass-card rounded-xl p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="font-medium capitalize">{conn.provider}</span>
                                <div className="flex gap-1.5">
                                    {conn.isDefault && (
                                        <Badge variant="secondary" className="text-xs">Default</Badge>
                                    )}
                                    <Badge
                                        variant={conn.isEnabled ? "default" : "outline"}
                                        className="text-xs"
                                    >
                                        {conn.isEnabled ? "Enabled" : "Disabled"}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className={`text-xs ${conn.liveMode ? "text-success" : "text-warning"}`}
                                    >
                                        {conn.liveMode ? "Live" : "Test"}
                                    </Badge>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{conn.label}</p>
                            <p className="text-xs text-muted-foreground">
                                Priority: {conn.priorityOrder}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <PspFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                onSuccess={fetchConnections}
            />
        </div>
    )
}
