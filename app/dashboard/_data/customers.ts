export interface Customer {
    name: string
    email: string
    orderCount: number
    totalSpent: number
}

export const customers: Customer[] = [
    { name: "Alex Morgan", email: "alex@example.com", orderCount: 2, totalSpent: 7499 },
    { name: "Sarah Chen", email: "sarah@example.com", orderCount: 2, totalSpent: 7148 },
    { name: "James Wilson", email: "james@example.com", orderCount: 1, totalSpent: 4500 },
    { name: "Emily Davis", email: "emily@example.com", orderCount: 1, totalSpent: 899 },
    { name: "Michael Brown", email: "michael@example.com", orderCount: 1, totalSpent: 3500 },
    { name: "Jessica Taylor", email: "jessica@example.com", orderCount: 1, totalSpent: 599 },
    { name: "David Kim", email: "david@example.com", orderCount: 1, totalSpent: 3248 },
    { name: "Olivia Martinez", email: "olivia@example.com", orderCount: 1, totalSpent: 7498 },
    { name: "Daniel Lee", email: "daniel@example.com", orderCount: 1, totalSpent: 1750 },
    { name: "Sophia Anderson", email: "sophia@example.com", orderCount: 1, totalSpent: 5398 },
    { name: "William Thompson", email: "william@example.com", orderCount: 1, totalSpent: 899 },
    { name: "Emma Garcia", email: "emma@example.com", orderCount: 1, totalSpent: 3500 },
    { name: "Noah Robinson", email: "noah@example.com", orderCount: 1, totalSpent: 2999 },
    { name: "Isabella Clark", email: "isabella@example.com", orderCount: 1, totalSpent: 599 },
]
