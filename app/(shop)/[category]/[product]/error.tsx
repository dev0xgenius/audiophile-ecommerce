"use client"

import { Button } from "@/components/ui/button";

export default function ProductError({
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
            <h2 className="text-h3">Failed to load product</h2>
            <p className="text-accent-foreground max-w-md">
                {error.message || "We couldn't load this product. Please try again."}
            </p>
            <Button onClick={reset}>Try Again</Button>
        </div>
    );
}
