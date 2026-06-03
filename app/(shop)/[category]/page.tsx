import yx1Earphone from "@/assets/product-yx1-earphones/mobile/image-product.jpg";
import { notFound } from "next/navigation";
import CategoryProductCard, {
    CategoryProductCardProps,
} from "./_components/category-product-card";

const earphoneProducts: CategoryProductCardProps[] = [
    {
        src: yx1Earphone,
        isNew: true,
        description: `Tailor your listening experience with bespoke dynamic drivers from the new YX1 Wireless Earphones. Enjoy incredible high-fidelity sound even in noisy environments with its active noise cancellation feature.`,
        name: "yx1 wireless earphones",
    },
];

interface SearchParamsProps {
    name: string;
}

const categories = ["headphones", "earphones", "speakers"];

export default async function CategoryPage({
    params,
    searchParams,
}: {
    params: Promise<{ category: string }>;
    searchParams: Promise<SearchParamsProps>;
}) {
    const { category } = await params;
    if (!categories.includes(category)) notFound();

    // TODO: add logic for fetching products within the category

    return (
        <div>
            <span className="font-medium text-center w-full block bg-black py-8 text-white text-3xl">
                {category.toUpperCase()}
            </span>
            {earphoneProducts.map((earphoneProduct, index) => (
                <CategoryProductCard
                    {...earphoneProduct}
                    metadataTitle={category}
                    key={index}
                />
            ))}
        </div>
    );
}
