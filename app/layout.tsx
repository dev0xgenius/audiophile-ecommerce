import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import AboutInfo from "@/components/ui/home/about-info";

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
		<html lang="en" className="">
			<body className={`antialiased leading-6`}>
				<Header />
				{children}
				<Footer>
					<AboutInfo />
				</Footer>
			</body>
		</html>
	);
}
