"use client"

import { useCallback, useEffect, useState } from "react"
import { AuditLogTable } from "@/components/dashboard/audit-log-table"

export interface AuditLogRow {
    id: string
    action: string
    entityType: string
    entityId: string | null
    before: unknown | null
    after: unknown | null
    actor: { id: string; name: string | null; email: string | null } | null
    createdAt: string
}

interface AuditLogsResponse {
    data: AuditLogRow[]
    meta: { page: number; pageSize: number; total: number; totalPages: number }
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLogRow[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [entityType, setEntityType] = useState("")
    const [actionFilter, setActionFilter] = useState("")

    const fetchLogs = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ page: String(page), pageSize: "20" })
            if (entityType) params.set("entityType", entityType)
            if (actionFilter) params.set("action", actionFilter)

            const res = await fetch(`/api/audit-logs?${params}`)
            if (!res.ok) throw new Error("Failed to fetch")
            const json: AuditLogsResponse = await res.json()
            setLogs(json.data)
            setTotalPages(json.meta.totalPages)
        } catch {
            // silent
        } finally {
            setLoading(false)
        }
    }, [page, entityType, actionFilter])

    useEffect(() => {
        fetchLogs()
    }, [fetchLogs])

    return (
        <div className="flex flex-1 flex-col gap-8 p-8 lg:p-10">
            <div className="space-y-1.5">
                <h2 className="text-2xl font-semibold tracking-tight gradient-text">Audit Log</h2>
                <p className="text-sm text-secondary">
                    Track all changes made across the system.
                </p>
            </div>
            <div className="flex items-center gap-4">
                <div className="grid gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Entity Type</label>
                    <select
                        className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm"
                        value={entityType}
                        onChange={(e) => { setEntityType(e.target.value); setPage(1) }}
                    >
                        <option value="">All</option>
                        <option value="user">User</option>
                        <option value="role">Role</option>
                        <option value="product">Product</option>
                        <option value="order">Order</option>
                        <option value="supplier">Supplier</option>
                        <option value="bundle">Bundle</option>
                        <option value="customer">Customer</option>
                    </select>
                </div>
                <div className="grid gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Action</label>
                    <input
                        className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm w-48"
                        placeholder="Filter by action..."
                        value={actionFilter}
                        onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}
                    />
                </div>
            </div>
            <AuditLogTable
                logs={logs}
                loading={loading}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </div>
    )
}
