import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../card";

export interface CategoryCardProps {
	hoverImg: string | StaticImageData;
	category: string;
	link: string;
}

function CategoryCard({ hoverImg, category, link }: CategoryCardProps) {
	return (
		<Link href={link}>
			<Card className="rounded-2xl bg-gray border-none">
				<CardContent className="flex flex-col gap-9 items-center">
					{/* TODO: Add oval shaped shadow */}
					<span className="w-max block justify-center -mt-20">
						<Image
							src={hoverImg}
							width={360}
							height={360}
							className="w-max"
							alt={`${category} Category image`}
						/>
					</span>
					<div className="grid place-items-center gap-5">
						<span className="font-light tracking-widest">
							{category.toUpperCase()}
						</span>
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

export default function CategoryList({ data }: { data: CategoryCardProps[] }) {
	return (
		<ul className="flex flex-wrap gap-16">
			{data.map((category, i) => (
				<li key={i} className="min-w-full my-4">
					<CategoryCard {...category} />
				</li>
			))}
		</ul>
	);
}
