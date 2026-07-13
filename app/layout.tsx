import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import AboutInfo from "@/components/ui/home/about-info";
import Hero from "@/components/ui/home/hero";

export const metadata: Metadata = {
    title: {
        default: "Audiophile Ecommerce Shop",
        template: "%s | Audiophile Ecommerce Shop",
    },
    description:
        "Get the best offers for your earphones, headphones and speakers.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} font-sans`}>
            <body className={`antialiased leading-6 flex flex-col min-h-dvh`}>
                <Header>
                    <Hero />
                </Header>
                <div className="flex-1">{children}</div>
                <Footer>
                    <AboutInfo />
                </Footer>
            </body>
        </html>
    );
}
