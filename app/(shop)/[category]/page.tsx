import { notFound } from "next/navigation";
import CategoryProductCard, {
    CategoryProductCardProps,
} from "./_components/category-product-card";

import xx99m2Mobile from "@/assets/product-xx99-mark-two-headphones/mobile/image-category-page-preview.jpg";
import xx99m2Tablet from "@/assets/product-xx99-mark-two-headphones/tablet/image-category-page-preview.jpg";
import xx99m2Desktop from "@/assets/product-xx99-mark-two-headphones/desktop/image-category-page-preview.jpg";
import xx99m1Mobile from "@/assets/product-xx99-mark-one-headphones/mobile/image-category-page-preview.jpg";
import xx99m1Tablet from "@/assets/product-xx99-mark-one-headphones/tablet/image-category-page-preview.jpg";
import xx99m1Desktop from "@/assets/product-xx99-mark-one-headphones/desktop/image-category-page-preview.jpg";
import xx59Mobile from "@/assets/product-xx59-headphones/mobile/image-category-page-preview.jpg";
import xx59Tablet from "@/assets/product-xx59-headphones/tablet/image-category-page-preview.jpg";
import xx59Desktop from "@/assets/product-xx59-headphones/desktop/image-category-page-preview.jpg";
import zx9Mobile from "@/assets/product-zx9-speaker/mobile/image-category-page-preview.jpg";
import zx9Tablet from "@/assets/product-zx9-speaker/tablet/image-category-page-preview.jpg";
import zx9Desktop from "@/assets/product-zx9-speaker/desktop/image-category-page-preview.jpg";
import zx7Mobile from "@/assets/product-zx7-speaker/mobile/image-category-page-preview.jpg";
import zx7Tablet from "@/assets/product-zx7-speaker/tablet/image-category-page-preview.jpg";
import zx7Desktop from "@/assets/product-zx7-speaker/desktop/image-category-page-preview.jpg";
import yx1Mobile from "@/assets/product-yx1-earphones/mobile/image-category-page-preview.jpg";
import yx1Tablet from "@/assets/product-yx1-earphones/tablet/image-category-page-preview.jpg";
import yx1Desktop from "@/assets/product-yx1-earphones/desktop/image-category-page-preview.jpg";

const products: Record<string, CategoryProductCardProps[]> = {
    headphones: [
        {
            src: { mobile: xx99m2Mobile, tablet: xx99m2Tablet, desktop: xx99m2Desktop },
            isNew: true,
            name: "xx99 mark ii headphones",
            description: "The new XX99 Mark II headphones is the pinnacle of pristine audio. It redefines your premium headphone experience by reproducing the balanced depth and precision of studio-quality sound.",
        },
        {
            src: { mobile: xx99m1Mobile, tablet: xx99m1Tablet, desktop: xx99m1Desktop },
            isNew: false,
            name: "xx99 mark i headphones",
            description: "As the gold standard for headphones, the classic XX99 Mark I offers detailed and natural audio with an active noise cancellation design. A truly one‑of‑a‑kind listening experience.",
        },
        {
            src: { mobile: xx59Mobile, tablet: xx59Tablet, desktop: xx59Desktop },
            isNew: false,
            name: "xx59 headphones",
            description: "Enjoy your audio almost anywhere and customize it to your specific tastes with the XX59 headphones. The stylish yet durable versatile wireless headset is a brilliant companion at home or on the move.",
        },
    ],
    speakers: [
        {
            src: { mobile: zx9Mobile, tablet: zx9Tablet, desktop: zx9Desktop },
            isNew: true,
            name: "zx9 speaker",
            description: "Upgrade your sound system with the all new ZX9 active speaker. It's a bookshelf speaker system that offers truly wireless connectivity -- creating new possibilities for more pleasing and practical audio setups.",
        },
        {
            src: { mobile: zx7Mobile, tablet: zx7Tablet, desktop: zx7Desktop },
            isNew: false,
            name: "zx7 speaker",
            description: "Stream high quality sound wirelessly with minimal loss. The ZX7 bookshelf speaker uses high-end audiophile components that represents the top of the line powered speakers for home or studio use.",
        },
    ],
    earphones: [
        {
            src: { mobile: yx1Mobile, tablet: yx1Tablet, desktop: yx1Desktop },
            isNew: true,
            name: "yx1 wireless earphones",
            description: "Tailor your listening experience with bespoke dynamic drivers from the new YX1 Wireless Earphones. Enjoy incredible high-fidelity sound even in noisy environments with its active noise cancellation feature.",
        },
    ],
};

const categories = ["headphones", "earphones", "speakers"];

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ category: string }>;
}) {
    const { category } = await params;
    if (!categories.includes(category)) notFound();

    const categoryProducts = products[category] || [];

    return (
        <div>
            <div className="bg-darker py-8 md:py-16">
                <h1 className="text-h2 md:text-h1 text-white text-center">
                    {category.toUpperCase()}
                </h1>
            </div>
            {categoryProducts.map((product, index) => (
                <CategoryProductCard
                    {...product}
                    metadataTitle={category}
                    index={index}
                    key={index}
                />
            ))}
        </div>
    );
}
