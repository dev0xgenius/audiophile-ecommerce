import { cn } from "@/lib/utils";

export default function Counter({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"flex w-full justify-between items-center rounded-md px-6 gap-6 bg-gray",
				className,
			)}
		>
            <button
                type="button"
                className="text-accent-foreground hover:text-primary transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-ring rounded-sm outline-none"
                aria-label="Decrease quantity"
            >
                -
            </button>
            <span>1</span>
            <button
                type="button"
                className="text-accent-foreground hover:text-primary transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-ring rounded-sm outline-none"
                aria-label="Increase quantity"
            >
                +
            </button>
		</span>
	);
}
