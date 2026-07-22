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

const statusBadge: Record<string, { label: string; variant: "outline" | "secondary" | "default" | "destructive" }> = {
    pending_payment: { label: "Pending Payment", variant: "outline" },
    paid: { label: "Paid", variant: "secondary" },
    processing: { label: "Processing", variant: "secondary" },
    shipped: { label: "Shipped", variant: "default" },
    delivered: { label: "Delivered", variant: "default" },
    cancelled: { label: "Cancelled", variant: "destructive" },
    refunded: { label: "Refunded", variant: "destructive" },
    partially_refunded: { label: "Partially Refunded", variant: "outline" },
}

interface RecentOrder {
    id: string
    orderNumber: number
    customerName: string
    status: string
    total: number
    createdAt: string
}

export function RecentOrders({ orders }: { orders: RecentOrder[] }) {
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
                        {orders.map((order) => {
                            const info = statusBadge[order.status] ?? { label: order.status, variant: "outline" as const }
                            return (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                                    <TableCell>{order.customerName}</TableCell>
                                    <TableCell>
                                        <Badge variant={info.variant} className="capitalize">
                                            {info.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        ${order.total.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
