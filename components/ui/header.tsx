import Image from "next/image";
import { Button } from "./button";

export default function Header({ children }: React.ComponentProps<"header">) {
	return (
		<header className="bg-transparent flex flex-col">
			<div className="flex justify-between items-baseline-last text-white container px-6 py-8 border-b border-accent-foreground bg-black">
				<Button variant={"ghost"} className="p-0 w-fit">
					<Image
						src="/icon-hamburger.svg"
						width={16}
						height={16}
						alt="menu icon"
					/>
				</Button>
				<span className="text-3xl font-black tracking-tight">audiophile</span>
				<Button variant={"ghost"} className="p-0 w-fit">
					<Image src="/icon-cart.svg" width={24} height={24} alt="cart icon" />
				</Button>
			</div>
			{children}
		</header>
	);
}
