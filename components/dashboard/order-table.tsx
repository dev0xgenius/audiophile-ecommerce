"use client"

import * as React from "react"
import {
    IconEye,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconDownload,
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Checkbox } from "@/components/ui/checkbox"
import type { OrderRow } from "@/app/dashboard/orders/page"

const statusOptions = [
    "all", "pending_payment", "paid", "processing", "shipped", "delivered", "cancelled", "refunded",
]

const statusBadge: Record<string, { label: string; variant: "outline" | "secondary" | "default" | "destructive" }> = {
    pending_payment: { label: "Pending Payment", variant: "outline" },
    paid: { label: "Paid", variant: "secondary" },
    processing: { label: "Processing", variant: "secondary" },
    shipped: { label: "Shipped", variant: "default" },
    delivered: { label: "Delivered", variant: "default" },
    cancelled: { label: "Cancelled", variant: "destructive" },
    refunded: { label: "Refunded", variant: "destructive" },
    partially_refunded: { label: "Partially Refunded", variant: "outline" },
}

interface OrderTableProps {
    orders: OrderRow[]
    onStatusChange: (orderId: string, status: string) => void
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function OrderTable({ orders, onStatusChange, page, totalPages, onPageChange }: OrderTableProps) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: "createdAt", desc: true },
    ])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [detailOrderId, setDetailOrderId] = React.useState<string | null>(null)

    const columns: ColumnDef<OrderRow>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            size: 28,
        },
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
            accessorKey: "itemCount",
            header: "Items",
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.original.itemCount} item{row.original.itemCount !== 1 ? "s" : ""}
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
                const info = statusBadge[row.original.status] ?? { label: row.original.status, variant: "outline" as const }
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
                        onClick={() => setDetailOrderId(row.original.id)}
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

    const selectedCount = table.getSelectedRowModel().rows.length;

    const handleBulkAction = async (value: string) => {
        const selectedIds = table.getSelectedRowModel().rows.map((r) => r.original.id);
        if (selectedIds.length === 0) return;

        let action: string;
        let status: string | undefined;

        if (value.startsWith("status:")) {
            action = "status";
            status = value.replace("status:", "");
        } else {
            action = value;
        }

        try {
            const res = await fetch("/api/orders/batch", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderIds: selectedIds, action, status }),
            });
            if (!res.ok) throw new Error("Batch operation failed");
            table.resetRowSelection();
            onStatusChange("", ""); // trigger refresh
        } catch {
            // silent
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <IconDownload className="size-4 mr-2" />
                            Export
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => window.open("/api/orders/export?format=csv")}>
                            CSV (filtered)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open("/api/orders/export?format=csv&pageSize=10000")}>
                            CSV (all)
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {selectedCount > 0 && (
                <div className="flex items-center gap-2 px-1">
                    <span className="text-sm text-muted-foreground">{selectedCount} selected</span>
                    <Select onValueChange={(value) => handleBulkAction(value)}>
                        <SelectTrigger className="w-40 h-8 text-xs">
                            <SelectValue placeholder="Bulk actions" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.filter(s => s !== "all").map((s) => (
                                <SelectItem key={s} value={`status:${s}`} className="text-xs capitalize">
                                    Set {s.replace(/_/g, " ")}
                                </SelectItem>
                            ))}
                            <SelectItem value="refund" className="text-xs">Refund selected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
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
                    {orders.length} order(s)
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
            <OrderDetailDialog
                open={!!detailOrderId}
                onOpenChange={(open) => !open && setDetailOrderId(null)}
                orderId={detailOrderId}
            />
        </div>
    )
}
