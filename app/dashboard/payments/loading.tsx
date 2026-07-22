export default function PaymentsLoading() {
    return (
        <div className="flex flex-1 flex-col gap-8 p-8 lg:p-10">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
                ))}
            </div>
        </div>
    )
}
