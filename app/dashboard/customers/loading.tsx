export default function CustomersLoading() {
    return (
        <div className="flex flex-1 flex-col gap-8 p-8 lg:p-10">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
                ))}
            </div>
        </div>
    )
}
