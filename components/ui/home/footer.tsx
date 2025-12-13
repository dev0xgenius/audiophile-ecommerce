export default function Footer({ children }: { children?: React.ReactNode }) {
	return (
		<footer className="flex flex-col gap-8">
			<div className="container"></div>
			{children}
		</footer>
	);
}
