"use client"

import * as React from "react"
import {
    IconEye,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
} from "@tabler/icons-react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
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
import { Label } from "@/components/ui/label"
import { DataTableColumnHeader } from "@/components/dashboard/data-table-column-header"
import { DataTableToolbar } from "@/components/dashboard/data-table-toolbar"

interface CustomerRow {
    id: string
    name: string
    email: string | null
    phone: string | null
    flags: string[]
    orderCount: number
    totalSpent: number
    createdAt: string
}

interface CustomerTableProps {
    customers: CustomerRow[]
    loading?: boolean
    onSelect: (customer: CustomerRow) => void
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function CustomerTable({ customers, loading, onSelect, page, totalPages, onPageChange }: CustomerTableProps) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: "createdAt", desc: true },
    ])
    const [globalFilter, setGlobalFilter] = React.useState("")

    const columns: ColumnDef<CustomerRow>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => (
                <div>
                    <p className="font-medium">{row.original.name}</p>
                    {row.original.email && (
                        <p className="text-xs text-muted-foreground">{row.original.email}</p>
                    )}
                </div>
            ),
        },
        {
            id: "phone",
            header: "Phone",
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">{row.original.phone ?? "—"}</span>
            ),
        },
        {
            id: "orderCount",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Orders" />
            ),
            cell: ({ row }) => (
                <span className="tabular-nums">{row.original.orderCount}</span>
            ),
        },
        {
            id: "totalSpent",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Total Spent" />
            ),
            cell: ({ row }) => (
                <span className="tabular-nums">${row.original.totalSpent.toLocaleString()}</span>
            ),
        },
        {
            id: "flags",
            header: "Flags",
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {row.original.flags.map((f) => (
                        <Badge key={f} variant={f === "VIP" ? "default" : "destructive"} className="text-xs capitalize">
                            {f}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Customer Since" />
            ),
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">
                    {new Date(row.original.createdAt).toLocaleDateString()}
                </span>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => onSelect(row.original)}
                >
                    <IconEye className="size-3" />
                    View
                </Button>
            ),
        },
    ]

    const table = useReactTable({
        data: customers,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination: { pageIndex: page - 1, pageSize: 20 },
            globalFilter,
        },
        getRowId: (row) => row.id,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    return (
        <div className="flex flex-col gap-6">
            <DataTableToolbar
                searchPlaceholder="Search customers..."
                searchValue={globalFilter}
                onSearchChange={setGlobalFilter}
            />
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
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {columns.map((_, j) => (
                                        <TableCell key={j}>
                                            <div className="h-5 animate-pulse rounded bg-muted" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="cursor-pointer"
                                    onClick={() => onSelect(row.original)}
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
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between px-4">
                <div className="text-sm text-muted-foreground">
                    {customers.length} customer(s)
                </div>
                <div className="flex items-center gap-12">
                    <div className="hidden items-center gap-2 lg:flex">
                        <Label className="text-sm font-medium">
                            Rows per page: 20
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
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
            </div>
        </div>
    )
}
