"use client"

import { IconArrowDown, IconArrowUp, IconArrowsSort } from "@tabler/icons-react"
import type { Column } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.ComponentProps<"div"> {
    column: Column<TData, TValue>
    title: string
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[sorting=true]:text-accent-foreground"
            data-sorting={column.getIsSorted() !== false}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
                <IconArrowDown className="ml-2 size-4" />
            ) : column.getIsSorted() === "asc" ? (
                <IconArrowUp className="ml-2 size-4" />
            ) : (
                <IconArrowsSort className="ml-2 size-4" />
            )}
        </Button>
    )
}
