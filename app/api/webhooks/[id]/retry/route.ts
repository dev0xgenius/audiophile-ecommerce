import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";
import { createAdapter } from "@/lib/psp/factory";

export const POST = withPermission(async (request: NextRequest, _context) => {
    const id = request.nextUrl.pathname.split("/webhooks/")[1]?.split("/")[0] ?? "";

    const event = await prisma.webhookEvent.findUnique({ where: { id } });
    if (!event) {
        return NextResponse.json(
            { error: "Webhook event not found", code: "NOT_FOUND" },
            { status: 404 },
        );
    }

    const connection = event.pspConnectionId
        ? await prisma.pSPConnection.findUnique({ where: { id: event.pspConnectionId } })
        : null;

    if (!connection) {
        return NextResponse.json(
            { error: "PSP connection not found for this webhook event", code: "CONNECTION_NOT_FOUND" },
            { status: 400 },
        );
    }

    try {
        const adapter = createAdapter(connection.provider, connection.credentials as unknown as string);

        const rawBody = event.rawBody ? JSON.stringify(event.rawBody) : "{}";
        const signature = event.headers
            ? ((event.headers as Record<string, string>)["x-paystack-signature"] ?? "")
            : "";

        await adapter.parseWebhook(rawBody, signature);

        await prisma.webhookEvent.update({
            where: { id },
            data: {
                status: "processed",
                processedAt: new Date(),
                errorMessage: null,
            },
        });

        return NextResponse.json({ data: { id, status: "processed" } });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Retry failed";

        await prisma.webhookEvent.update({
            where: { id },
            data: {
                status: "failed",
                errorMessage: message,
            },
        });

        return NextResponse.json(
            { error: message, code: "RETRY_FAILED" },
            { status: 400 },
        );
    }
}, "payments", "edit");
