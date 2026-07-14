export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export interface OrderItem {
    productName: string
    quantity: number
    unitPrice: number
}

export interface Order {
    id: string
    orderNumber: number
    customerName: string
    customerEmail: string
    status: OrderStatus
    total: number
    items: OrderItem[]
    createdAt: string
}

export const orders: Order[] = [
    {
        id: "ord-001",
        orderNumber: 1001,
        customerName: "Alex Morgan",
        customerEmail: "alex@example.com",
        status: "delivered",
        total: 2999,
        items: [{ productName: "XX99 Mark II Headphones", quantity: 1, unitPrice: 2999 }],
        createdAt: "2026-07-01T10:30:00Z",
    },
    {
        id: "ord-002",
        orderNumber: 1002,
        customerName: "Sarah Chen",
        customerEmail: "sarah@example.com",
        status: "shipped",
        total: 5398,
        items: [
            { productName: "XX99 Mark I Headphones", quantity: 1, unitPrice: 1750 },
            { productName: "YX1 Wireless Earphones", quantity: 1, unitPrice: 599 },
            { productName: "XX59 Headphones", quantity: 1, unitPrice: 899 },
        ],
        createdAt: "2026-07-02T14:00:00Z",
    },
    {
        id: "ord-003",
        orderNumber: 1003,
        customerName: "James Wilson",
        customerEmail: "james@example.com",
        status: "processing",
        total: 4500,
        items: [{ productName: "ZX9 Speaker", quantity: 1, unitPrice: 4500 }],
        createdAt: "2026-07-03T09:15:00Z",
    },
    {
        id: "ord-004",
        orderNumber: 1004,
        customerName: "Emily Davis",
        customerEmail: "emily@example.com",
        status: "pending",
        total: 899,
        items: [{ productName: "XX59 Headphones", quantity: 1, unitPrice: 899 }],
        createdAt: "2026-07-04T11:45:00Z",
    },
    {
        id: "ord-005",
        orderNumber: 1005,
        customerName: "Michael Brown",
        customerEmail: "michael@example.com",
        status: "delivered",
        total: 3500,
        items: [{ productName: "ZX7 Speaker", quantity: 1, unitPrice: 3500 }],
        createdAt: "2026-06-28T16:20:00Z",
    },
    {
        id: "ord-006",
        orderNumber: 1006,
        customerName: "Jessica Taylor",
        customerEmail: "jessica@example.com",
        status: "cancelled",
        total: 599,
        items: [{ productName: "YX1 Wireless Earphones", quantity: 1, unitPrice: 599 }],
        createdAt: "2026-06-25T08:00:00Z",
    },
    {
        id: "ord-007",
        orderNumber: 1007,
        customerName: "David Kim",
        customerEmail: "david@example.com",
        status: "shipped",
        total: 3248,
        items: [
            { productName: "XX99 Mark I Headphones", quantity: 1, unitPrice: 1750 },
            { productName: "XX59 Headphones", quantity: 1, unitPrice: 899 },
            { productName: "YX1 Wireless Earphones", quantity: 1, unitPrice: 599 },
        ],
        createdAt: "2026-07-05T13:10:00Z",
    },
    {
        id: "ord-008",
        orderNumber: 1008,
        customerName: "Olivia Martinez",
        customerEmail: "olivia@example.com",
        status: "processing",
        total: 7498,
        items: [
            { productName: "ZX9 Speaker", quantity: 1, unitPrice: 4500 },
            { productName: "XX99 Mark II Headphones", quantity: 1, unitPrice: 2999 },
        ],
        createdAt: "2026-07-06T10:00:00Z",
    },
    {
        id: "ord-009",
        orderNumber: 1009,
        customerName: "Daniel Lee",
        customerEmail: "daniel@example.com",
        status: "pending",
        total: 1750,
        items: [{ productName: "XX99 Mark I Headphones", quantity: 1, unitPrice: 1750 }],
        createdAt: "2026-07-07T15:30:00Z",
    },
    {
        id: "ord-010",
        orderNumber: 1010,
        customerName: "Sophia Anderson",
        customerEmail: "sophia@example.com",
        status: "delivered",
        total: 5398,
        items: [
            { productName: "XX59 Headphones", quantity: 2, unitPrice: 899 },
            { productName: "YX1 Wireless Earphones", quantity: 2, unitPrice: 599 },
            { productName: "XX99 Mark II Headphones", quantity: 1, unitPrice: 2999 },
        ],
        createdAt: "2026-06-20T09:45:00Z",
    },
    {
        id: "ord-011",
        orderNumber: 1011,
        customerName: "William Thompson",
        customerEmail: "william@example.com",
        status: "shipped",
        total: 899,
        items: [{ productName: "XX59 Headphones", quantity: 1, unitPrice: 899 }],
        createdAt: "2026-07-08T12:00:00Z",
    },
    {
        id: "ord-012",
        orderNumber: 1012,
        customerName: "Emma Garcia",
        customerEmail: "emma@example.com",
        status: "pending",
        total: 3500,
        items: [{ productName: "ZX7 Speaker", quantity: 1, unitPrice: 3500 }],
        createdAt: "2026-07-09T08:20:00Z",
    },
    {
        id: "ord-013",
        orderNumber: 1013,
        customerName: "Alex Morgan",
        customerEmail: "alex@example.com",
        status: "processing",
        total: 4500,
        items: [{ productName: "ZX9 Speaker", quantity: 1, unitPrice: 4500 }],
        createdAt: "2026-07-10T14:50:00Z",
    },
    {
        id: "ord-014",
        orderNumber: 1014,
        customerName: "Noah Robinson",
        customerEmail: "noah@example.com",
        status: "cancelled",
        total: 2999,
        items: [{ productName: "XX99 Mark II Headphones", quantity: 1, unitPrice: 2999 }],
        createdAt: "2026-06-30T11:10:00Z",
    },
    {
        id: "ord-015",
        orderNumber: 1015,
        customerName: "Isabella Clark",
        customerEmail: "isabella@example.com",
        status: "delivered",
        total: 599,
        items: [{ productName: "YX1 Wireless Earphones", quantity: 1, unitPrice: 599 }],
        createdAt: "2026-06-15T16:30:00Z",
    },
    {
        id: "ord-016",
        orderNumber: 1016,
        customerName: "Sarah Chen",
        customerEmail: "sarah@example.com",
        status: "pending",
        total: 1750,
        items: [{ productName: "XX99 Mark I Headphones", quantity: 1, unitPrice: 1750 }],
        createdAt: "2026-07-11T10:25:00Z",
    },
]
