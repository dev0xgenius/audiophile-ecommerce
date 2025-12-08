import ProductCard from "../product-card";

export default function ProductList() {
    return (
        <ul className="grid gap-4">
            <li>
                <ProductCard />
                <ProductCard />
            </li>
        </ul>
    );
}
