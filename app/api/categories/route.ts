import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCategorySchema } from "@/lib/validations/category";
import { withPermission } from "@/lib/auth/permissions";

export const GET = withPermission(async () => {
    const categories = await prisma.category.findMany({
        include: {
            children: {
                include: {
                    children: true,
                },
                orderBy: { sortOrder: "asc" },
            },
        },
        where: { parentId: null },
        orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ data: categories });
}, "products", "view");

export const POST = withPermission(async (request: NextRequest) => {
    const body = await request.json();
    const data = createCategorySchema.parse(body);

    const category = await prisma.category.create({
        data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            parentId: data.parentId,
            sortOrder: data.sortOrder,
            imageUrl: data.imageUrl,
        },
        include: {
            children: true,
            parent: true,
        },
    });

    return NextResponse.json({ data: category }, { status: 201 });
}, "products", "create");
