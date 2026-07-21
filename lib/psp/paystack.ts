import crypto from "node:crypto";
import type { PSPAdapter, PaymentIntentRequest, PaymentIntentResult, RefundRequest, RefundResult, WebhookEvent } from "./types";

const PAYSTACK_API = "https://api.paystack.co";

export class PaystackAdapter implements PSPAdapter {
    private secretKey: string;

    constructor(secretKey: string) {
        this.secretKey = secretKey;
    }

    getProvider(): string {
        return "paystack";
    }

    private async request(method: string, path: string, body?: unknown) {
        const res = await fetch(`${PAYSTACK_API}${path}`, {
            method,
            headers: {
                Authorization: `Bearer ${this.secretKey}`,
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : undefined,
        });
        const json = await res.json();
        if (!res.ok || json.status === false) {
            throw new Error(`Paystack API error: ${json.message ?? res.statusText}`);
        }
        return json;
    }

    async createPaymentIntent(req: PaymentIntentRequest): Promise<PaymentIntentResult> {
        const response = await this.request("POST", "/transaction/initialize", {
            amount: String(Math.round(req.amount * 100)),
            currency: req.currency.toUpperCase(),
            metadata: req.metadata,
            description: req.description,
            email: req.customerEmail ?? `customer-${Date.now()}@temp.com`,
            ...(req.callbackUrl ? { callback_url: req.callbackUrl } : {}),
        });

        return {
            pspPaymentIntentId: response.data.reference,
            clientSecret: response.data.access_code,
            status: "pending",
            raw: response,
        };
    }

    async refundPayment(req: RefundRequest): Promise<RefundResult> {
        const response = await this.request("POST", "/refund", {
            transaction: req.pspPaymentIntentId,
            amount: req.amount ? Math.round(req.amount * 100) : undefined,
        });

        return {
            pspRefundId: response.data.id.toString(),
            status: response.data.status,
            raw: response,
        };
    }

    async parseWebhook(payload: string, signature: string): Promise<WebhookEvent> {
        const hash = crypto
            .createHmac("sha512", this.secretKey)
            .update(payload)
            .digest("hex");

        if (hash !== signature) {
            throw new Error("Paystack webhook signature mismatch");
        }

        const parsed = JSON.parse(payload);
        return {
            provider: "paystack",
            pspEventId: parsed.id?.toString() ?? "",
            type: parsed.event ?? "unknown",
            raw: parsed,
        };
    }

    async validateCredentials(): Promise<boolean> {
        try {
            const response = await this.request("GET", "/balance");
            return response.status === true;
        } catch {
            return false;
        }
    }
}
