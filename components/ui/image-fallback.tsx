import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

export default function ImageFallback({
    className,
}: {
    className?: string;
}) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                "flex items-center justify-center bg-gray text-accent-foreground/40",
                className,
            )}
        >
            <ImageIcon className="size-8 shrink-0" />
        </div>
    );
}