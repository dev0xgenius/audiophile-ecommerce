"use client";

import { facebookIcon, instagramIcon, twitterIcon } from "@/lib/img-exports";
import Logo from "./logo";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer({ children }: { children?: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname.startsWith("/dashboard")) {
        return <></>;
    }

    return (
        <footer className="flex flex-col gap-[120px] ">
            {pathname != "/checkout" && <div className="px-6">{children}</div>}
            <div className="container bg-darker flex flex-col gap-12 items-center md:items-start py-10 px-6 relative">
                <div className="absolute w-28 h-1 bg-primary top-0" />
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <Logo />
                </Link>
                <ul className="text-white flex flex-col md:flex-row gap-4 text-center font-semibold tracking-widest text-sm">
                    <li>
                        <Link href="/" className="hover:text-primary focus-visible:ring-2 focus-visible:ring-ring rounded-md transition-colors outline-none">HOME</Link>
                    </li>
                    <li>
                        <Link href="/headphones" className="hover:text-primary focus-visible:ring-2 focus-visible:ring-ring rounded-md transition-colors outline-none">HEADPHONES</Link>
                    </li>
                    <li>
                        <Link href="/speakers" className="hover:text-primary focus-visible:ring-2 focus-visible:ring-ring rounded-md transition-colors outline-none">SPEAKERS</Link>
                    </li>
                    <li>
                        <Link href="/earphones" className="hover:text-primary focus-visible:ring-2 focus-visible:ring-ring rounded-md transition-colors outline-none">EARPHONES</Link>
                    </li>
                </ul>
                <p className="text-accent-foreground text-center md:text-left">{`
					Audiophile is an all in one stop to fulfill your your audio needs.
					We're a small team of music lovers and sound specialists who are
					devoted to helping you get the most out of personal audio. Come and
					visit our demo facility - we're open 7 days a week.
			`}</p>
                <div className="w-full flex flex-col gap-4 md:flex-row md:justify-between">
                    <span className="font-semibold text-accent-foreground block">
                        Copyright 2025. All Rights Reserved.
                    </span>
                    <div className="flex gap-4 items-center">
                        <a href="#" className="hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring rounded-md transition-opacity outline-none">
                            <Image
                                src={facebookIcon}
                                width={24}
                                height={24}
                                alt="Facebook"
                            />
                        </a>
                        <a href="#" className="hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring rounded-md transition-opacity outline-none">
                            <Image
                                src={twitterIcon}
                                width={24}
                                height={24}
                                alt="Twitter"
                            />
                        </a>
                        <a href="#" className="hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring rounded-md transition-opacity outline-none">
                            <Image
                                src={instagramIcon}
                                width={24}
                                height={24}
                                alt="Instagram"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
