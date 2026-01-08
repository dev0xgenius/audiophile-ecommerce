export default function Counter() {
	return (
		<span className="flex w-full justify-between items-center h-12 rounded-md px-6 has-[>svg]:px-4 bg-accent-foreground/20">
			<span className="text-accent-foreground">-</span>
			<span>1</span>
			<span className="text-accent-foreground">+</span>
		</span>
	);
}
