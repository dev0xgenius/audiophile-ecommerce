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
    getPaginationRowModel,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DataTableColumnHeader } from "@/components/dashboard/data-table-column-header"
import { DataTableToolbar } from "@/components/dashboard/data-table-toolbar"
import { OrderStatusUpdate } from "@/components/dashboard/order-status-update"
import { OrderDetailDialog } from "@/components/dashboard/order-detail-dialog"
import type { Order, OrderStatus } from "@/app/dashboard/_data/orders"

const statusBadge: Record<OrderStatus, { label: string; variant: "outline" | "secondary" | "default" | "destructive" }> = {
    pending: { label: "Pending", variant: "outline" },
    processing: { label: "Processing", variant: "secondary" },
    shipped: { label: "Shipped", variant: "default" },
    delivered: { label: "Delivered", variant: "default" },
    cancelled: { label: "Cancelled", variant: "destructive" },
}

interface OrderTableProps {
    orders: Order[]
    onStatusChange: (orderId: string, status: OrderStatus) => void
}

export function OrderTable({ orders, onStatusChange }: OrderTableProps) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: "createdAt", desc: true },
    ])
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [detailOrder, setDetailOrder] = React.useState<Order | null>(null)

    const columns: ColumnDef<Order>[] = [
        {
            accessorKey: "orderNumber",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Order" />
            ),
            cell: ({ row }) => (
                <span className="font-medium">#{row.original.orderNumber}</span>
            ),
        },
        {
            accessorKey: "customerName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Customer" />
            ),
            cell: ({ row }) => (
                <div>
                    <p className="font-medium">{row.original.customerName}</p>
                    <p className="text-xs text-muted-foreground">{row.original.customerEmail}</p>
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Date" />
            ),
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {new Date(row.original.createdAt).toLocaleDateString()}
                </span>
            ),
        },
        {
            accessorKey: "items",
            header: "Items",
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.original.items.length} item{row.original.items.length > 1 ? "s" : ""}
                </Badge>
            ),
        },
        {
            accessorKey: "total",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Total" />
            ),
            cell: ({ row }) => (
                <span className="tabular-nums font-medium">
                    ${row.original.total.toLocaleString()}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const info = statusBadge[row.original.status]
                return (
                    <Badge variant={info.variant} className="capitalize">
                        {info.label}
                    </Badge>
                )
            },
            filterFn: "equals",
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <OrderStatusUpdate
                        value={row.original.status}
                        onChange={(status) => onStatusChange(row.original.id, status)}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => setDetailOrder(row.original)}
                    >
                        <IconEye className="size-4" />
                        <span className="sr-only">View</span>
                    </Button>
                </div>
            ),
        },
    ]

    const table = useReactTable({
        data: orders,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
            globalFilter,
        },
        getRowId: (row) => row.id,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    return (
        <div className="flex flex-col gap-6">
            <DataTableToolbar
                searchPlaceholder="Search orders..."
                searchValue={globalFilter}
                onSearchChange={setGlobalFilter}
                filters={
                    <Select
                        value={
                            (table.getColumn("status")?.getFilterValue() as string) ?? "all"
                        }
                        onValueChange={(value) =>
                            table
                                .getColumn("status")
                                ?.setFilterValue(value === "all" ? "" : value)
                        }
                    >
                        <SelectTrigger size="sm" className="w-32">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                }
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
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
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
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between px-4">
                <div className="text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} order(s)
                </div>
                <div className="flex items-center gap-12">
                    <div className="hidden items-center gap-2 lg:flex">
                        <Label htmlFor="rows-per-page" className="text-sm font-medium">
                            Rows per page
                        </Label>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => table.setPageSize(Number(value))}
                        >
                            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                <SelectValue
                                    placeholder={table.getState().pagination.pageSize}
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </span>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                className="hidden size-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <IconChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <IconChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <IconChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <IconChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <OrderDetailDialog
                open={!!detailOrder}
                onOpenChange={(open) => !open && setDetailOrder(null)}
                order={detailOrder}
            />
        </div>
    )
}
