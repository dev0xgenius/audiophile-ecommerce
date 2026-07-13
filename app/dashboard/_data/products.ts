export interface Product {
    id: string
    name: string
    category: "headphone" | "earphone" | "speaker"
    price: number
    stockQuantity: number
    lowStockThreshold: number
    description: string
    isNew: boolean
    addedAt: string
}

export const products: Product[] = [
    {
        id: "prod-001",
        name: "XX99 Mark II Headphones",
        category: "headphone",
        price: 2999,
        stockQuantity: 15,
        lowStockThreshold: 5,
        description: "The new XX99 Mark II headphones is the pinnacle of pristine audio. It redefines your premium headphone experience by reproducing the balanced depth and precision of studio-quality sound.",
        isNew: true,
        addedAt: "2026-06-01T00:00:00Z",
    },
    {
        id: "prod-002",
        name: "XX99 Mark I Headphones",
        category: "headphone",
        price: 1750,
        stockQuantity: 3,
        lowStockThreshold: 5,
        description: "As the gold standard for headphones, the classic XX99 Mark I offers detailed and natural audio with an active noise cancellation design.",
        isNew: false,
        addedAt: "2026-05-15T00:00:00Z",
    },
    {
        id: "prod-003",
        name: "XX59 Headphones",
        category: "headphone",
        price: 899,
        stockQuantity: 22,
        lowStockThreshold: 5,
        description: "Enjoy your audio almost anywhere and customize it to your specific tastes with the XX59 headphones. The stylish yet durable versatile wireless headset is a brilliant companion.",
        isNew: false,
        addedAt: "2026-04-20T00:00:00Z",
    },
    {
        id: "prod-004",
        name: "ZX9 Speaker",
        category: "speaker",
        price: 4500,
        stockQuantity: 0,
        lowStockThreshold: 3,
        description: "Upgrade your sound system with the all new ZX9 active speaker. It's a bookshelf speaker system that offers truly wireless connectivity.",
        isNew: true,
        addedAt: "2026-06-10T00:00:00Z",
    },
    {
        id: "prod-005",
        name: "ZX7 Speaker",
        category: "speaker",
        price: 3500,
        stockQuantity: 8,
        lowStockThreshold: 5,
        description: "Stream high quality sound wirelessly with minimal loss. The ZX7 bookshelf speaker uses high-end audiophile components.",
        isNew: false,
        addedAt: "2026-03-05T00:00:00Z",
    },
    {
        id: "prod-006",
        name: "YX1 Wireless Earphones",
        category: "earphone",
        price: 599,
        stockQuantity: 4,
        lowStockThreshold: 5,
        description: "Tailor your listening experience with bespoke dynamic drivers from the new YX1 Wireless Earphones. Enjoy incredible high-fidelity sound even in noisy environments.",
        isNew: true,
        addedAt: "2026-06-15T00:00:00Z",
    },
]
