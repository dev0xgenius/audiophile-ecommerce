import Image from "next/image";
import {
	Card,
	CardHeader,
	CardDescription,
	CardTitle,
	CardContent,
} from "../card";

export default function AboutInfo() {
	return (
		<Card className="p-0 shadow-none border-none text-center gap-12">
			<CardHeader className="p-0 gap-12">
				<CardDescription className="overflow-hidden rounded-2xl">
					<Image
						src="/shared/mobile/image-best-gear.jpg"
						width={360}
						height={720}
						alt="Man with quality headphones"
					/>
				</CardDescription>
				<CardTitle className="font-semibold text-3xl tracking-wide">
					BRINGING YOU THE <span className="text-primary">BEST</span> AUDIO GEAR
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<p className="text-balance text-accent-foreground tracking-tighter">
					Located at the heart of New York City. Audiophile is the premier store
					for high end headphones, earphones, speakers, and audio accessories.
					We have a large showroom and luxury demonstration rooms available for
					you to browse and experience a wide range of our products. Stop by our
					store to meet some of the fantastic people who make Audiophile the
					best place to buy your portable audio equipment.
				</p>
			</CardContent>
		</Card>
	);
}
