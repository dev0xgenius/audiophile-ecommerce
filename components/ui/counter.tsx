import { cn } from "@/lib/utils";

export default function Counter({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"flex w-full justify-between items-center rounded-md px-6 gap-6 bg-accent-foreground/20",
				className,
			)}
		>
			<span className="text-accent-foreground">-</span>
			<span>1</span>
			<span className="text-accent-foreground">+</span>
		</span>
	);
}
