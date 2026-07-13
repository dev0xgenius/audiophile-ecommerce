import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { orders } from "./_data/orders";
import { products } from "./_data/products";
import { customers } from "./_data/customers";
import { RecentOrders } from "@/components/dashboard/recent-orders";

export default function Page() {
    const totalRevenue = orders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter(
        (o) => o.status === "pending" || o.status === "processing",
    ).length;
    const inStockProducts = products.filter((p) => p.stockQuantity > 0).length;
    const totalCustomers = customers.length;

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-10 py-10 md:gap-14 md:py-14">
                    <SectionCards
                        revenue={{
                            value: `$${totalRevenue.toLocaleString()}`,
                            badge: `${orders.length} orders`,
                        }}
                        orders={{
                            value: String(orders.length),
                            badge: `${pendingOrders} pending`,
                        }}
                        products={{
                            value: String(products.length),
                            badge: `${inStockProducts} in stock`,
                        }}
                        customers={{
                            value: String(totalCustomers),
                            badge: "active",
                        }}
                    />
                    <div className="px-4 lg:px-8">
                        <ChartAreaInteractive />
                    </div>
                    <div className="px-4 lg:px-8">
                        <RecentOrders orders={orders.slice(0, 5)} />
                    </div>
                </div>
            </div>
        </div>
    );
}
