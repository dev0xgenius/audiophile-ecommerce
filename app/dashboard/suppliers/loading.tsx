export default function Loading() {
    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="h-8 w-48 rounded bg-muted animate-pulse" />
            <div className="h-10 w-72 rounded bg-muted animate-pulse" />
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
                ))}
            </div>
        </div>
    )
}
