"use client";

import Image from "next/image";
import { Button } from "./button";
import CartDialog from "./cart-dialog";
import Logo from "./logo";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import CategoryList from "./home/category-list";
import { useState } from "react";

function HeaderContent({ onMenuToggle }: { onMenuToggle: () => void }) {
    return (
        <div className="flex justify-between items-center text-white container px-6 py-8 border-b border-accent-foreground bg-black">
            <Button
                variant={"ghost"}
                className="p-0 w-fit"
                onClick={onMenuToggle}
            >
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
    );
}

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className="bg-transparent flex flex-col gap-2 justify-center">
            <HeaderContent onMenuToggle={handleMenuToggle} />
            <Dialog modal={true} open={menuOpen}>
                <DialogContent
                    showCloseButton={false}
                    className="min-w-full p-0 border-none translate-x-0 translate-y-0 left-0 top-0 rounded-b-xl"
                >
                    <DialogHeader>
                        <HeaderContent onMenuToggle={handleMenuToggle} />
                    </DialogHeader>
                    <div className="px-6 py-8">
                        <DialogTitle className="hidden">Menu</DialogTitle>
                        <CategoryList />
                    </div>
                </DialogContent>
            </Dialog>
        </header>
    );
}
