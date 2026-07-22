"use client"

import { Button } from "@/components/ui/button";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
            <div className="size-16 rounded-full bg-error/10 flex items-center justify-center">
                <span className="text-2xl">!</span>
            </div>
            <h2 className="text-h3">Something went wrong</h2>
            <p className="text-accent-foreground max-w-md">
                {error.message || "An unexpected error occurred. Please try again."}
            </p>
            <Button onClick={reset}>Try Again</Button>
        </div>
    );
}
