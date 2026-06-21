import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import Hero from "@/components/ui/home/hero";
import AboutInfo from "@/components/ui/home/about-info";

export const metadata: Metadata = {
	title: "Audiophile — Premium Audio Equipment",
	description:
		"Premium headphones, speakers, and earphones for the discerning listener. Explore our collection of high-fidelity audio gear.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="">
			<body className={`antialiased leading-6`}>
				<Header>
					<Hero />
				</Header>
				{children}
				<Footer>
					<AboutInfo />
				</Footer>
			</body>
		</html>
	);
}
