import {
	ProductAction,
	ProductCard,
	ProductContent,
	ProductDescription,
	ProductImage,
	ProductTitle,
} from "../product-card";

import SpeakerZX7Image from "@/assets/home/mobile/image-speaker-zx7.jpg";
import SpeakerZX9Image from "@/assets/home/mobile/image-speaker-zx9.png";
import EarphoneYX1Image from "@/assets/home/mobile/image-earphones-yx1.jpg";

export default function ProductList() {
	return (
		<ul className="grid gap-6">
			<li>
				<ProductCard className="bg-primary text-white">
					<div className="relative w-full flex justify-center items-center m-auto">
						<ProductImage src={SpeakerZX9Image} alt="" />
						{/* TODO: Fix circle borders */}
						<div className="border size-80 rounded-full border-gray-300 absolute" />
						<div className="border size-[279px] rounded-full border-gray-300 absolute" />
					</div>
					<ProductContent className="text-center p-0">
						<ProductTitle className="tracking-wider px-5 pt-4">
							ZX9 SPEAKER
						</ProductTitle>
						<ProductDescription>
							Upgrade to premium speakers that are phenomenally built to deliver
							truly remarkable sound.
						</ProductDescription>
						<ProductAction className="bg-black" />
					</ProductContent>
				</ProductCard>
			</li>
			<li>
				<ProductCard className="relative items-start p-0">
					<ProductImage src={SpeakerZX7Image} className="w-full" alt="" />
					<ProductContent className="absolute">
						<ProductTitle className="text-3xl tracking-wider">
							ZX7 SPEAKER
						</ProductTitle>
						<ProductAction variant={"outline"} />
					</ProductContent>
				</ProductCard>
			</li>
			<li>
				<ProductCard className="p-0 shadow-none border-none">
					<ProductImage src={EarphoneYX1Image} alt="" className="rounded-2xl" />
					<ProductContent className="flex items-start rounded-2xl gap-8 p-6 py-10 bg-accent">
						<ProductTitle className="tracking-[2px] text-3xl">
							YX1 EARPHONES
						</ProductTitle>
						<ProductAction variant={"outline"} />
					</ProductContent>
				</ProductCard>
			</li>
		</ul>
	);
}
