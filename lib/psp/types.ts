export interface PaymentIntentRequest {
    amount: number;
    currency: string;
    metadata?: Record<string, string>;
    description?: string;
    customerEmail?: string;
    callbackUrl?: string;
}

export interface PaymentIntentResult {
    pspPaymentIntentId: string;
    clientSecret?: string;
    status: string;
    raw: Record<string, unknown>;
}

export interface RefundRequest {
    pspPaymentIntentId: string;
    amount?: number;
    reason?: string;
}

export interface RefundResult {
    pspRefundId: string;
    status: string;
    raw: Record<string, unknown>;
}

export interface WebhookEvent {
    provider: string;
    pspEventId: string;
    type: string;
    raw: Record<string, unknown>;
}

export interface PSPAdapter {
    getProvider(): string;
    createPaymentIntent(req: PaymentIntentRequest): Promise<PaymentIntentResult>;
    refundPayment(req: RefundRequest): Promise<RefundResult>;
    parseWebhook(payload: string, signature: string): Promise<WebhookEvent>;
    validateCredentials(): Promise<boolean>;
}
