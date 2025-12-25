import { facebookIcon, instagramIcon, twitterIcon } from "@/lib/img-exports";
import Logo from "./logo";

import Image from "next/image";

export default function Footer({ children }: { children?: React.ReactNode }) {
	return (
		<footer className="flex flex-col gap-[120px] mt-24">
			<div className="px-6">{children}</div>
			<div className="container bg-black flex flex-col gap-12 items-center py-10 px-6 relative">
				<div className="absolute w-28 h-1 bg-primary top-0" />
				<Logo />
				<ul className="text-white flex flex-col gap-4 text-center font-semibold tracking-widest text-sm">
					<li>
						<a href="">HOME</a>
					</li>
					<li>
						<a href="">HEADPHONES</a>
					</li>
					<li>
						<a href="">SPEAKERS</a>
					</li>
					<li>
						<a href="">EARPHONES</a>
					</li>
				</ul>
				<p className="text-accent-foreground text-center">{`
					Audiophile is an all in one stop to fulfill your your audio needs.
					We're a small team of music lovers and sound specialists who are
					devoted to helping you get the most out of personal audio. Come and
					visit our demo facility - we're open 7 days a week.
			`}</p>
				<span className="font-semibold text-accent-foreground">
					Copyright 2025. All Rights Reserved.
				</span>
				<div className="flex gap-4 items-center">
					<span>
						<Image src={facebookIcon} width={24} height={24} alt="" />
					</span>
					<span>
						<Image src={twitterIcon} width={24} height={24} alt="" />
					</span>
					<span>
						<Image src={instagramIcon} width={24} height={24} alt="" />
					</span>
				</div>
			</div>
		</footer>
	);
}
