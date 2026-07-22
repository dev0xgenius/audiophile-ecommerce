"use client"

import { Button } from "@/components/ui/button"

export default function Error({ reset }: { error: Error; reset: () => void }) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
            <p className="text-body">Something went wrong loading suppliers.</p>
            <Button onClick={reset}>Try again</Button>
        </div>
    )
}
