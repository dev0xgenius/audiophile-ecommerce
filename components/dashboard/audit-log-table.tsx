"use client"

import * as React from "react"
import {
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconHistory,
} from "@tabler/icons-react"
import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
    type ColumnDef,
    type Row,
} from "@tanstack/react-table"

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
import { DataTableColumnHeader } from "@/components/dashboard/data-table-column-header"
import type { AuditLogRow } from "@/app/dashboard/audit-logs/page"

interface AuditLogTableProps {
    logs: AuditLogRow[]
    loading?: boolean
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

function DiffView({ before, after }: { before: unknown; after: unknown }) {
    if (!before && !after) return <span className="text-muted-foreground">No data</span>

    const beforeStr = before ? JSON.stringify(before, null, 2) : null
    const afterStr = after ? JSON.stringify(after, null, 2) : null

    return (
        <div className="grid grid-cols-2 gap-4 p-3 text-xs font-mono">
            {beforeStr && (
                <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Before</p>
                    <pre className="whitespace-pre-wrap rounded bg-muted p-2 max-h-48 overflow-y-auto">{beforeStr}</pre>
                </div>
            )}
            {afterStr && (
                <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">After</p>
                    <pre className="whitespace-pre-wrap rounded bg-muted p-2 max-h-48 overflow-y-auto">{afterStr}</pre>
                </div>
            )}
        </div>
    )
}

export function AuditLogTable({ logs, loading, page, totalPages, onPageChange }: AuditLogTableProps) {
    const columns: ColumnDef<AuditLogRow>[] = [
        {
            accessorKey: "timestamp",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Timestamp" />
            ),
            cell: ({ row }) => (
                <span className="text-sm whitespace-nowrap">
                    {new Date(row.original.createdAt).toLocaleString()}
                </span>
            ),
        },
        {
            accessorKey: "actor",
            header: "Actor",
            cell: ({ row }) => {
                const actor = row.original.actor
                return (
                    <span className="text-sm">
                        {actor ? (actor.name ?? actor.email ?? "Unknown") : "System"}
                    </span>
                )
            },
        },
        {
            accessorKey: "action",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Action" />
            ),
            cell: ({ row }) => (
                <Badge variant="outline" className="font-mono text-xs">
                    {row.original.action}
                </Badge>
            ),
        },
        {
            accessorKey: "entityType",
            header: "Entity",
            cell: ({ row }) => (
                <span className="text-sm capitalize">{row.original.entityType}</span>
            ),
        },
        {
            accessorKey: "entityId",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Entity ID" />
            ),
            cell: ({ row }) => (
                <span className="text-xs text-muted-foreground font-mono">
                    {row.original.entityId ? row.original.entityId.slice(0, 12) + "..." : "—"}
                </span>
            ),
        },
    ]

    const table = useReactTable({
        data: logs,
        columns,
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    })

    return (
        <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-xl glass-table">
                <Table>
                    <TableHeader className="sticky top-0 z-10 bg-muted">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row: Row<AuditLogRow>) => (
                                <React.Fragment key={row.id}>
                                    <TableRow
                                        className="cursor-pointer"
                                        onClick={() => row.toggleExpanded()}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {row.getIsExpanded() && (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="p-0">
                                                <DiffView
                                                    before={row.original.before}
                                                    after={row.original.after}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    {loading ? (
                                        "Loading..."
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <IconHistory className="size-4" />
                                            No audit log entries found.
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end gap-2 px-4">
                <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        className="hidden size-8 p-0 lg:flex"
                        onClick={() => onPageChange(1)}
                        disabled={page <= 1}
                    >
                        <IconChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => onPageChange(page - 1)}
                        disabled={page <= 1}
                    >
                        <IconChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages}
                    >
                        <IconChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden size-8 lg:flex"
                        size="icon"
                        onClick={() => onPageChange(totalPages)}
                        disabled={page >= totalPages}
                    >
                        <IconChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}
