"use client"

import * as React from "react"
import {
    IconEdit,
    IconPackage,
    IconTrash,
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
import type { ProductRow } from "@/app/dashboard/products/page"

interface ProductTableProps {
    products: ProductRow[]
    loading?: boolean
    onEdit: (product: ProductRow) => void
    onDelete: (product: ProductRow) => void
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function ProductTable({ products, loading, onEdit, onDelete, page, totalPages, onPageChange }: ProductTableProps) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")

    const columns: ColumnDef<ProductRow>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <IconPackage className="size-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">{row.original.name}</span>
                </div>
            ),
        },
        {
            accessorKey: "brand",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Brand" />
            ),
            cell: ({ row }) => (
                <span className="text-muted-foreground">{row.original.brand ?? "—"}</span>
            ),
        },
        {
            accessorKey: "category",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Category" />
            ),
            cell: ({ row }) => (
                <Badge variant="outline" className="capitalize">
                    {row.original.category?.name ?? "—"}
                </Badge>
            ),
            filterFn: "equals",
        },
        {
            accessorKey: "basePrice",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Base Price" />
            ),
            cell: ({ row }) => (
                <div className="tabular-nums">
                    ${row.original.basePrice.toLocaleString()}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status
                if (status === "active")
                    return <Badge variant="outline" className="border-green-400 text-green-700 bg-green-50">Active</Badge>
                if (status === "archived")
                    return <Badge variant="destructive">Archived</Badge>
                return <Badge variant="outline">Draft</Badge>
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Created" />
            ),
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {new Date(row.original.createdAt).toLocaleDateString()}
                </span>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => onEdit(row.original)}
                    >
                        <IconEdit className="size-4" />
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-error hover:text-error"
                        onClick={() => onDelete(row.original)}
                    >
                        <IconTrash className="size-4" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
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
                searchPlaceholder="Search products..."
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
                                    {loading ? "Loading..." : "No products found."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between px-4">
                <div className="text-sm text-muted-foreground">
                    {products.length} product(s)
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
