import { cn } from "@/lib/utils";

export default function Counter({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"flex justify-between items-center bg-gray w-[120px] h-12",
				className,
			)}
		>
            <button
                type="button"
                className="flex-1 h-full text-sm font-bold tracking-widest uppercase text-accent-foreground hover:text-primary transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-ring rounded-sm outline-none"
                aria-label="Decrease quantity"
            >
                -
            </button>
            <span className="text-sm font-bold tracking-widest">1</span>
            <button
                type="button"
                className="flex-1 h-full text-sm font-bold tracking-widest uppercase text-accent-foreground hover:text-primary transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-ring rounded-sm outline-none"
                aria-label="Increase quantity"
            >
                +
            </button>
		</span>
	);
}
