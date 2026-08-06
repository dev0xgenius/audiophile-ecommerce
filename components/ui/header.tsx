"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import CartDialog from "./cart-dialog";
import Logo from "./logo";
import { Dialog, DialogContent, DialogTitle } from "./dialog";
import CategoryList from "./home/category-list";
import { useState } from "react";
import { usePathname } from "next/navigation";

function HeaderContent({ onMenuToggle }: { onMenuToggle: () => void }) {
    const links = [
        { href: "/", label: "HOME" },
        { href: "/headphones", label: "HEADPHONES" },
        { href: "/speakers", label: "SPEAKERS" },
        { href: "/earphones", label: "EARPHONES" },
    ];

    return (
        <div className="flex items-center justify-between text-white px-6 xl:px-0 py-8 border-b border-white/20 w-full">
            <div className="flex items-center max-md:contents md:gap-11">
                <Button
                    variant={"ghost"}
                    className="p-0 w-fit lg:hidden"
                    onClick={onMenuToggle}
                    aria-label="Toggle navigation menu"
                >
                    <Image
                        src="/icon-hamburger.svg"
                        width={16}
                        height={16}
                        alt=""
                        className="w-full h-auto"
                    />
                </Button>
                <Link href="/">
                    <Logo />
                </Link>
            </div>
            <nav
                className="hidden lg:flex items-center gap-8 text-white text-sm font-semibold tracking-widest"
                aria-label="Main navigation"
            >
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="hover:text-primary focus-visible:ring-2 focus-visible:ring-ring rounded-md transition-colors outline-none"
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
            <CartDialog />
        </div>
    );
}

export default function Header({ children }: { children: React.ReactNode }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    if (pathname.startsWith("/dashboard")) {
        return <></>;
    }

    return (
        <header className="h-auto bg-secondary flex flex-col">
            <div className="container m-auto xl:max-w-[1110] ">
                <HeaderContent onMenuToggle={handleMenuToggle} />
                <Dialog modal={true} open={menuOpen} onOpenChange={setMenuOpen}>
                    <DialogContent
                        showCloseButton={false}
                        className="min-w-full p-0 border-0 translate-x-0 translate-y-0 left-0 top-0 rounded-b-xl"
                        aria-label="Navigation menu"
                    >
                        <div className="px-6 py-2">
                            <HeaderContent onMenuToggle={handleMenuToggle} />
                        </div>
                        <div className="px-6 py-8">
                            <DialogTitle className="sr-only">Menu</DialogTitle>
                            <CategoryList />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            {pathname == "/" && children}
        </header>
    );
}
