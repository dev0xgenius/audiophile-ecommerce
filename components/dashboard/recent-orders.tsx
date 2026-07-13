import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import type { Order, OrderStatus } from "@/app/dashboard/_data/orders"

const statusBadge: Record<OrderStatus, { label: string; variant: "outline" | "secondary" | "default" | "destructive" }> = {
    pending: { label: "Pending", variant: "outline" },
    processing: { label: "Processing", variant: "secondary" },
    shipped: { label: "Shipped", variant: "default" },
    delivered: { label: "Delivered", variant: "default" },
    cancelled: { label: "Cancelled", variant: "destructive" },
}

export function RecentOrders({ orders }: { orders: Order[] }) {
    return (
        <Card className="glass-card card-accent">
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell>
                                    <Badge variant={statusBadge[order.status].variant} className="capitalize">
                                        {statusBadge[order.status].label}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                    ${order.total.toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
