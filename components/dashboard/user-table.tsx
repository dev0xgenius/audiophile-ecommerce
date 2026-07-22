"use client"

import * as React from "react"
import {
    IconEdit,
    IconTrash,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconUser,
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
import type { UserRow } from "@/app/dashboard/users/page"

interface UserTableProps {
    users: UserRow[]
    loading?: boolean
    onEdit: (user: UserRow) => void
    onDelete: (user: UserRow) => void
}

export function UserTable({ users, loading, onEdit, onDelete }: UserTableProps) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
    const [globalFilter, setGlobalFilter] = React.useState("")

    const columns: ColumnDef<UserRow>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <IconUser className="size-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">{row.original.name ?? row.original.email}</span>
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Email" />
            ),
            cell: ({ row }) => (
                <span className="text-muted-foreground">{row.original.email ?? "—"}</span>
            ),
        },
        {
            accessorKey: "roles",
            header: "Roles",
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.roles.length > 0
                        ? row.original.roles.map((r) => (
                            <Badge key={r} variant="outline" className="capitalize text-xs">
                                {r}
                            </Badge>
                        ))
                        : <span className="text-muted-foreground">—</span>
                    }
                </div>
            ),
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => {
                const active = row.original.isActive
                return active
                    ? <Badge variant="outline" className="border-green-400 text-green-700 bg-green-50">Active</Badge>
                    : <Badge variant="destructive">Inactive</Badge>
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
        data: users,
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
                searchPlaceholder="Search users..."
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
                                    {loading ? "Loading..." : "No users found."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between px-4">
                <div className="text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} user(s)
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
        </div>
    )
}
