export default function GalleryLoading() {
    return (
        <div className="flex flex-1 flex-col gap-8 p-8 lg:p-10">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
                ))}
            </div>
        </div>
    )
}
