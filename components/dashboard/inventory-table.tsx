"use client"

import * as React from "react"
import {
    IconAdjustmentsHorizontal,
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
import { InventoryAdjustDialog } from "@/components/dashboard/inventory-adjust-dialog"
import type { Product } from "@/app/dashboard/_data/products"

interface InventoryTableProps {
    products: Product[]
    onAdjust: (productId: string, newQuantity: number) => void
}

export function InventoryTable({ products, onAdjust }: InventoryTableProps) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: "stockQuantity", desc: false },
    ])
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [adjustProduct, setAdjustProduct] = React.useState<Product | null>(null)

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Product" />
            ),
            cell: ({ row }) => (
                <div>
                    <p className="font-medium">{row.original.name}</p>
                    <Badge variant="outline" className="mt-0.5 capitalize text-xs">
                        {row.original.category}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "stockQuantity",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="In Stock" />
            ),
            cell: ({ row }) => {
                const qty = row.original.stockQuantity
                const threshold = row.original.lowStockThreshold
                const isLow = qty > 0 && qty <= threshold
                const isOut = qty === 0
                return (
                    <span
                        className={`tabular-nums text-lg font-bold ${
                            isOut ? "text-error" : isLow ? "text-amber-600" : ""
                        }`}
                    >
                        {qty}
                    </span>
                )
            },
        },
        {
            accessorKey: "lowStockThreshold",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Threshold" />
            ),
            cell: ({ row }) => (
                <span className="tabular-nums text-muted-foreground">
                    {row.original.lowStockThreshold}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const qty = row.original.stockQuantity
                const threshold = row.original.lowStockThreshold
                if (qty === 0)
                    return (
                        <Badge variant="destructive">
                            <span className="flex items-center gap-1">
                                <span className="size-1.5 rounded-full bg-current" />
                                Out of Stock
                            </span>
                        </Badge>
                    )
                if (qty <= threshold)
                    return (
                        <Badge
                            variant="outline"
                            className="border-amber-400 text-amber-700 bg-amber-50"
                        >
                            <span className="flex items-center gap-1">
                                <span className="size-1.5 rounded-full bg-amber-500" />
                                Low Stock
                            </span>
                        </Badge>
                    )
                return (
                    <Badge
                        variant="outline"
                        className="border-green-400 text-green-700 bg-green-50"
                    >
                        <span className="flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-green-500" />
                            In Stock
                        </span>
                    </Badge>
                )
            },
        },
        {
            accessorKey: "price",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Unit Price" />
            ),
            cell: ({ row }) => (
                <span className="tabular-nums">
                    ${row.original.price.toLocaleString()}
                </span>
            ),
        },
        {
            id: "stockValue",
            header: "Stock Value",
            cell: ({ row }) => (
                <span className="tabular-nums">
                    ${(row.original.stockQuantity * row.original.price).toLocaleString()}
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
                    onClick={() => setAdjustProduct(row.original)}
                >
                    <IconAdjustmentsHorizontal className="size-3" />
                    Adjust
                </Button>
            ),
        },
    ]

    const table = useReactTable({
        data: products,
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
                searchPlaceholder="Search inventory..."
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
                        <SelectTrigger size="sm" className="w-36">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Stock</SelectItem>
                            <SelectItem value="in">In Stock</SelectItem>
                            <SelectItem value="low">Low Stock</SelectItem>
                            <SelectItem value="out">Out of Stock</SelectItem>
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
                                    No inventory data found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between px-4">
                <div className="text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} product(s)
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
            <InventoryAdjustDialog
                open={!!adjustProduct}
                onOpenChange={(open) => !open && setAdjustProduct(null)}
                productName={adjustProduct?.name ?? ""}
                currentStock={adjustProduct?.stockQuantity ?? 0}
                onConfirm={(newQuantity) => {
                    if (adjustProduct) onAdjust(adjustProduct.id, newQuantity)
                    setAdjustProduct(null)
                }}
            />
        </div>
    )
}
