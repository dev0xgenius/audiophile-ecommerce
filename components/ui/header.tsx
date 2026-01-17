"use client";

import Image from "next/image";
import { Button } from "./button";
import Logo from "./logo";
import CartDialog from "./cart-dialog";

export default function Header() {
	return (
		<header className="bg-transparent flex flex-col">
			<div className="flex justify-between items-center  text-white container px-6 py-8 border-b border-accent-foreground bg-black">
				<Button variant={"ghost"} className="p-0 w-fit">
					<Image
						src="/icon-hamburger.svg"
						width={16}
						height={16}
						alt="menu icon"
					/>
				</Button>
				<Logo />
				<CartDialog />
			</div>
		</header>
	);
}
