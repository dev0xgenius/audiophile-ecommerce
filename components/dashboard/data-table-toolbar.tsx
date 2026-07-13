import { IconSearch, IconX } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface DataTableToolbarProps {
    searchPlaceholder?: string
    searchValue: string
    onSearchChange: (value: string) => void
    filters?: React.ReactNode
}

export function DataTableToolbar({
    searchPlaceholder = "Search...",
    searchValue,
    onSearchChange,
    filters,
}: DataTableToolbarProps) {
    return (
        <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
                <IconSearch className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-10 pl-9"
                />
                {searchValue && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 size-10"
                        onClick={() => onSearchChange("")}
                    >
                        <IconX className="size-4" />
                    </Button>
                )}
            </div>
            {filters}
        </div>
    )
}
