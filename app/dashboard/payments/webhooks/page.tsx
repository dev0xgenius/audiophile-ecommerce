"use client"

import { useCallback, useEffect, useState } from "react"
import { IconRefresh } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface WebhookEvent {
    id: string
    provider: string
    eventType: string
    pspEventId: string | null
    status: string
    errorMessage: string | null
    rawBody: unknown
    headers: unknown
    createdAt: string
    processedAt: string | null
}

const statusBadge: Record<string, { label: string; variant: "outline" | "secondary" | "default" | "destructive" }> = {
    received: { label: "Received", variant: "outline" },
    processed: { label: "Processed", variant: "default" },
    failed: { label: "Failed", variant: "destructive" },
    skipped: { label: "Skipped", variant: "secondary" },
}

export default function WebhooksPage() {
    const [events, setEvents] = useState<WebhookEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState("")
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const fetchEvents = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (statusFilter) params.set("status", statusFilter)
            const res = await fetch(`/api/webhooks?${params.toString()}`)
            if (!res.ok) throw new Error("Failed to fetch")
            const json = await res.json()
            setEvents(json.data ?? [])
        } catch {
            // silent
        } finally {
            setLoading(false)
        }
    }, [statusFilter])

    useEffect(() => {
        fetchEvents()
    }, [fetchEvents])

    const handleRetry = async (id: string) => {
        try {
            const res = await fetch(`/api/webhooks/${id}/retry`, { method: "POST" })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? "Retry failed")
            }
            toast.success("Webhook retried successfully")
            fetchEvents()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Retry failed")
        }
    }

    return (
        <div className="flex flex-1 flex-col gap-8 p-8 lg:p-10">
            <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                    <h2 className="text-2xl font-semibold tracking-tight gradient-text">Webhook Events</h2>
                    <p className="text-sm text-secondary">
                        Monitor and retry webhook events from payment providers.
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchEvents} className="gap-1.5">
                    <IconRefresh className="size-3" />
                    Refresh
                </Button>
            </div>

            <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={(v: string) => setStatusFilter(v)}>
                    <SelectTrigger size="sm" className="w-36">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="received">Received</SelectItem>
                        <SelectItem value="processed">Processed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="skipped">Skipped</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
                    ))}
                </div>
            ) : events.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-xl glass p-12 text-center">
                    <p className="text-sm text-muted-foreground">No webhook events yet.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl glass-table">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event Type</TableHead>
                                <TableHead>Provider</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map((event) => {
                                const badge = statusBadge[event.status] ?? { label: event.status, variant: "outline" as const }
                                return (
                                    <>
                                        <TableRow
                                            key={event.id}
                                            className="cursor-pointer"
                                            onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                                        >
                                            <TableCell className="font-medium">{event.eventType}</TableCell>
                                            <TableCell className="capitalize">{event.provider}</TableCell>
                                            <TableCell>
                                                <Badge variant={badge.variant}>{badge.label}</Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(event.createdAt).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                {event.status === "failed" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => { e.stopPropagation(); handleRetry(event.id) }}
                                                    >
                                                        Retry
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        {expandedId === event.id && (
                                            <TableRow key={`${event.id}-detail`}>
                                                <TableCell colSpan={5} className="bg-muted/30 p-4">
                                                    <div className="grid gap-3 text-sm">
                                                        {event.errorMessage && (
                                                            <div>
                                                                <p className="font-medium text-error mb-1">Error</p>
                                                                <p className="text-muted-foreground">{event.errorMessage}</p>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium mb-1">Raw Body</p>
                                                            <pre className="max-h-48 overflow-auto rounded-lg bg-black/20 p-3 text-xs">
                                                                {JSON.stringify(event.rawBody, null, 2)}
                                                            </pre>
                                                        </div>
                                                        {event.processedAt && (
                                                            <p className="text-xs text-muted-foreground">
                                                                Processed: {new Date(event.processedAt).toLocaleString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}
