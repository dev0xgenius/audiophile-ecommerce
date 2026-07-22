import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";

function getId(request: NextRequest): string {
    return request.nextUrl.pathname.split("/customers/")[1]?.split("/")[0] ?? "";
}

export const GET = withPermission(async (request: NextRequest) => {
    const id = getId(request);

    const customer = await prisma.customer.findUnique({
        where: { id },
        include: {
            addresses: true,
            customerNotes: {
                include: { author: { select: { id: true, name: true } } },
            },
            orders: {
                include: {
                    items: {
                        include: {
                            variant: { select: { id: true, name: true, sku: true } },
                        },
                    },
                    payments: true,
                    shipments: true,
                },
            },
        },
    });

    if (!customer) {
        return NextResponse.json(
            { error: "Customer not found", code: "NOT_FOUND" },
            { status: 404 },
        );
    }

    const filename = `customer-${customer.id}.json`;
    const json = JSON.stringify(customer, null, 2);

    return new NextResponse(json, {
        headers: {
            "Content-Type": "application/json",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    });
}, "customers", "view");
