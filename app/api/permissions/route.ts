import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";

export const GET = withPermission(async () => {
    const permissions = await prisma.permission.findMany({
        orderBy: [{ resource: "asc" }, { action: "asc" }],
    });

    return NextResponse.json({ data: permissions });
}, "roles", "view");
