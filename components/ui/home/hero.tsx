import { Button } from "../button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../card";

import Image from "next/image";

export default function Hero() {
	return (
		<div>
			<div className="relative py-28">
				<Card className="bg-transparent p-0 border-none text-center text-white shadow-none">
					<CardHeader>
						<CardDescription className="text-sm tracking-[10px]">
							NEW PRODUCT
						</CardDescription>
						<CardTitle className="text-4xl font-normal">
							XX99 MARK II HEADPHONES
						</CardTitle>
					</CardHeader>
					<CardContent className="text-accent">
						Experience natural, lifelike audio and exceptional build quality
						made for the passionate music enthusiast.
					</CardContent>
					<CardFooter className="flex justify-center">
						<CardAction>
							<Button size="lg">SEE PRODUCT</Button>
						</CardAction>
					</CardFooter>
				</Card>
				<div className="absolute -top-2 left-0 bottom-0 right-0 bg-black -z-10">
					<Image
						width={1240}
						height={720}
						src={"/image-header.jpg"}
						alt="A Headset"
						className="h-full object-cover align-middle"
					/>
				</div>
			</div>
		</div>
	);
}
