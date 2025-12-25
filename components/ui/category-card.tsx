import { Card, CardContent } from "./card";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";

export interface CategoryCardProps {
	hoverImg: string | StaticImageData;
	category: string;
	link: string;
}

export default function CategoryCard({
	hoverImg,
	category,
	link,
}: CategoryCardProps) {
	return (
		<Link href={link}>
			<Card className="shadow-none rounded-2xl bg-gray border-none">
				<CardContent className="flex flex-col items-center">
					<span className="w-max block justify-center -mt-20">
						<Image
							src={hoverImg}
							width={1024}
							height={720}
							className="max-w-full w-40"
							alt={`${category} Category image`}
						/>
					</span>
					<div className="grid place-items-center gap-4 font-semibold">
						<span className="tracking-widest">{category.toUpperCase()}</span>
						<span className="flex gap-3 text-accent-foreground items-center">
							<span>SHOP</span>
							<span>
								<svg
									width="7.081"
									height="11.414"
									viewBox="0 0 7.081 11.414"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M0 1.41421L4.26878 5.70711L0 10L1.40627 11.4142L6.3782 6.41422L7.08133 5.70711L6.3782 5L1.40627 0L0 1.41421L0 1.41421Z"
										fillRule="evenodd"
										transform="translate(-0 0)"
										className="fill-primary"
									/>
								</svg>
							</span>
						</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
