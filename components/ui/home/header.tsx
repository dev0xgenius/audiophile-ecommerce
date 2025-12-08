import HamburgerIcon from "../hamburger-icon";

export default function Header({ children }: React.ComponentProps<"header">) {
    return (
        <header className="bg-transparent flex flex-col">
            <div className="container px-6 py-8 border-b border-accent-foreground bg-black">
                <HamburgerIcon />
            </div>
            {children}
        </header>
    );
}
