"use client"

import { Button } from "@/components/ui/button"

export default function GalleryError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
            <p className="text-sm text-error">Failed to load gallery.</p>
            <p className="text-xs text-muted-foreground">{error.message}</p>
            <Button variant="outline" onClick={reset}>
                Try Again
            </Button>
        </div>
    )
}
