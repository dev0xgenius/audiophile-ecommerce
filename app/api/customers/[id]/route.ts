import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateCustomerSchema } from "@/lib/validations/customer";
import { withPermission } from "@/lib/auth/permissions";

function getId(request: NextRequest): string {
    const id = request.nextUrl.pathname.split("/customers/")[1]?.split("/")[0];
    return id ?? "";
}

export const GET = withPermission(async (request: NextRequest) => {
    const id = getId(request);

    const customer = await prisma.customer.findUnique({
        where: { id },
        include: {
            addresses: true,
            customerNotes: {
                include: { author: { select: { id: true, name: true } } },
                orderBy: { createdAt: "desc" },
                take: 20,
            },
            orders: {
                include: {
                    items: {
                        include: {
                            variant: { select: { id: true, name: true, sku: true } },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: 20,
            },
        },
    });

    if (!customer) {
        return NextResponse.json(
            { error: "Customer not found", code: "NOT_FOUND" },
            { status: 404 },
        );
    }

    const lifetimeValue = customer.orders.reduce((sum, o) => sum + o.total, 0);

    return NextResponse.json({
        data: {
            ...customer,
            lifetimeValue,
        },
    });
}, "customers", "view");

export const PUT = withPermission(async (request: NextRequest, context) => {
    const id = getId(request);
    const body = await request.json();
    const data = updateCustomerSchema.parse(body);

    const allowedFields = ["notes", "flags"];
    const invalidFields = Object.keys(body).filter((k) => !allowedFields.includes(k));
    if (invalidFields.length > 0) {
        return NextResponse.json(
            {
                error: `Cannot edit fields: ${invalidFields.join(", ")}`,
                code: "READONLY_FIELD",
            },
            { status: 400 },
        );
    }

    const customer = await prisma.customer.update({
        where: { id },
        data,
    });

    await prisma.auditLogEntry.create({
        data: {
            actorId: context.userId,
            action: "customer.update",
            entityType: "customer",
            entityId: id,
            after: { notes: data.notes, flags: data.flags },
        },
    });

    return NextResponse.json({ data: customer });
}, "customers", "edit");

export const DELETE = withPermission(async (request: NextRequest, context) => {
    const id = getId(request);

    const customer = await prisma.customer.update({
        where: { id },
        data: {
            name: "",
            email: null,
            phone: null,
            flags: ["anonymized"],
            notes: null,
        },
    });

    await prisma.auditLogEntry.create({
        data: {
            actorId: context.userId,
            action: "customer.anonymize",
            entityType: "customer",
            entityId: id,
        },
    });

    return NextResponse.json({ data: { id: customer.id, anonymized: true } });
}, "customers", "delete");
