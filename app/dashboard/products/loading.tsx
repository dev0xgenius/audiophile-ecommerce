export default function Loading() {
    return (
        <div className="flex flex-1 flex-col gap-8 p-8 lg:p-10">
            <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                    <div className="h-8 w-48 rounded-lg bg-muted animate-pulse" />
                    <div className="h-4 w-64 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-9 w-32 rounded-lg bg-muted animate-pulse" />
            </div>
            <div className="rounded-xl border border-muted">
                <div className="p-8 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    )
}
