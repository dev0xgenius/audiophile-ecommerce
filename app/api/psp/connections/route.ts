import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";
import { z } from "zod";
import { withPermission } from "@/lib/auth/permissions";

const createConnectionSchema = z.object({
    provider: z.enum(["paystack"]),
    label: z.string().min(1).max(100),
    secretKey: z.string().min(1),
    isDefault: z.boolean().default(false),
    liveMode: z.boolean().default(false),
    restrictedCurrencies: z.array(z.string()).default([]),
    restrictedRegions: z.array(z.string()).default([]),
});

export const GET = withPermission(async () => {
    const connections = await prisma.pSPConnection.findMany({
        orderBy: { priorityOrder: "asc" },
    });

    const sanitized = connections.map((c) => ({
        id: c.id,
        provider: c.provider,
        label: c.label,
        isEnabled: c.isEnabled,
        isDefault: c.isDefault,
        priorityOrder: c.priorityOrder,
        liveMode: c.liveMode,
        restrictedCurrencies: c.restrictedCurrencies,
        restrictedRegions: c.restrictedRegions,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
    }));

    return NextResponse.json({ data: sanitized });
}, "payments", "view");

export const POST = withPermission(async (request: NextRequest) => {
    const body = await request.json();
    const data = createConnectionSchema.parse(body);

    const payload = JSON.stringify({
        secretKey: data.secretKey,
    });
    const encrypted = encrypt(payload);

    const connection = await prisma.pSPConnection.create({
        data: {
            provider: data.provider,
            label: data.label,
            credentials: encrypted,
            isDefault: data.isDefault,
            liveMode: data.liveMode,
            restrictedCurrencies: data.restrictedCurrencies,
            restrictedRegions: data.restrictedRegions,
        },
    });

    return NextResponse.json(
        {
            data: {
                id: connection.id,
                provider: connection.provider,
                label: connection.label,
                isEnabled: connection.isEnabled,
                isDefault: connection.isDefault,
                createdAt: connection.createdAt,
            },
        },
        { status: 201 },
    );
}, "payments", "create");
