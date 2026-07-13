import { IconTrendingUp, IconPackages, IconShoppingBag, IconUsers } from "@tabler/icons-react"
import { StatCard, type StatCardData } from "@/components/dashboard/stat-card"

export function SectionCards({
    revenue,
    orders,
    products,
    customers,
}: {
    revenue: { value: string; badge: string }
    orders: { value: string; badge: string }
    products: { value: string; badge: string }
    customers: { value: string; badge: string }
}) {
    const cards: StatCardData[] = [
        {
            title: "Total Revenue",
            value: revenue.value,
            badge: revenue.badge,
            badgeVariant: "outline",
            icon: IconTrendingUp,
        },
        {
            title: "Orders",
            value: orders.value,
            badge: orders.badge,
            badgeVariant: "outline",
            icon: IconPackages,
        },
        {
            title: "Products",
            value: products.value,
            badge: products.badge,
            badgeVariant: "outline",
            icon: IconShoppingBag,
        },
        {
            title: "Customers",
            value: customers.value,
            badge: customers.badge,
            badgeVariant: "outline",
            icon: IconUsers,
        },
    ]

    return (
        <div className="grid grid-cols-1 gap-6 px-4 lg:px-8 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {cards.map((card) => (
                <StatCard key={card.title} {...card} />
            ))}
        </div>
    )
}
