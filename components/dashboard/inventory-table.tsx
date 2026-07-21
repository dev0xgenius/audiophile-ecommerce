"use client"

import * as React from "react"
import {
    IconChevronDown,
    IconChevronRight,
    IconAdjustmentsHorizontal,
    IconChevronLeft,
    IconChevronRight as IconChevronRight2,
    IconChevronsLeft,
    IconChevronsRight,
} from "@tabler/icons-react"
import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type ExpandedState,
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

interface VariantRow {
    id: string
    sku: string
    name: string
    priceDelta: number
    stock: number
    lowStockThreshold: number
    weightDelta: number | null
    isActive: boolean
}

interface ProductRow {
    id: string
    name: string
    sku: string | null
    brand: string | null
    category: { id: string; name: string; slug: string } | null
    variants: VariantRow[]
    basePrice: number
    status: string
}

interface InventoryTableProps {
    products: ProductRow[]
    onAdjust: (variantId: string, variantName: string, currentStock: number) => void
}

export function InventoryTable({ products, onAdjust }: InventoryTableProps) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: "name", desc: false },
    ])
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [expanded, setExpanded] = React.useState<ExpandedState>({})

    const columns: ColumnDef<ProductRow>[] = [
        {
            id: "expander",
            header: () => null,
            cell: ({ row }) => {
                if (!row.original.variants?.length) return null
                return (
                    <button
                        onClick={(e) => { e.stopPropagation(); row.toggleExpanded() }}
                        className="p-1 hover:text-primary"
                    >
                        {row.getIsExpanded() ? (
                            <IconChevronDown className="size-4" />
                        ) : (
                            <IconChevronRight className="size-4" />
                        )}
                    </button>
                )
            },
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Product" />
            ),
            cell: ({ row }) => (
                <div>
                    <p className="font-medium">{row.original.name}</p>
                    {row.original.category && (
                        <Badge variant="outline" className="mt-0.5 capitalize text-xs">
                            {row.original.category.name}
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            id: "totalStock",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Total Stock" />
            ),
            cell: ({ row }) => {
                const total = row.original.variants?.reduce((s, v) => s + v.stock, 0) ?? 0
                return (
                    <span className="tabular-nums text-lg font-bold">{total}</span>
                )
            },
        },
        {
            id: "variants",
            header: "Variants",
            cell: ({ row }) => (
                <span className="text-muted-foreground">
                    {row.original.variants?.length ?? 0}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status
                if (status === "active") return <Badge variant="default">Active</Badge>
                if (status === "draft") return <Badge variant="outline">Draft</Badge>
                return <Badge variant="secondary">Archived</Badge>
            },
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
            expanded,
        },
        getRowId: (row) => row.id,
        getRowCanExpand: (row) => (row.original.variants?.length ?? 0) > 0,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        onExpandedChange: setExpanded,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
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
                        onValueChange={(value: string) =>
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
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
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
                                <React.Fragment key={row.id}>
                                    <TableRow>
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
                                            <TableCell colSpan={columns.length} className="bg-muted/30 p-0">
                                                <div className="divide-y border-t">
                                                    {row.original.variants?.map((v) => (
                                                        <div key={v.id} className="flex items-center justify-between px-10 py-3 text-sm">
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-medium">{v.name}</span>
                                                                <span className="text-muted-foreground">({v.sku})</span>
                                                            </div>
                                                            <div className="flex items-center gap-6">
                                                                <span
                                                                    className={`tabular-nums font-bold ${
                                                                        v.stock === 0 ? "text-error" :
                                                                        v.stock <= v.lowStockThreshold ? "text-warning" : ""
                                                                    }`}
                                                                >
                                                                    {v.stock}
                                                                </span>
                                                                <span className="text-muted-foreground">
                                                                    Threshold: {v.lowStockThreshold}
                                                                </span>
                                                                <span className="tabular-nums text-muted-foreground">
                                                                    {v.priceDelta >= 0 ? "+" : ""}${v.priceDelta.toFixed(2)}
                                                                </span>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="gap-1"
                                                                    onClick={() => onAdjust(v.id, `${row.original.name} - ${v.name}`, v.stock)}
                                                                >
                                                                    <IconAdjustmentsHorizontal className="size-3" />
                                                                    Adjust
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
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
                            onValueChange={(value: string) => table.setPageSize(Number(value))}
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
                                <IconChevronRight2 />
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
        </div>
    )
}
