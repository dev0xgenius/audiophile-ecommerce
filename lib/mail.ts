import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

type SendEmailParams = {
    to: string;
    subject: string;
    html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<void> {
    if (!resend) {
        console.warn("RESEND_API_KEY not set — skipping email");
        return;
    }

    try {
        await resend.emails.send({
            from: "Audiophile <orders@audiophile.com>",
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error("Failed to send email:", error);
    }
}

export function sendOrderConfirmationEmail(params: {
    email: string;
    orderId: string;
    customerName: string;
    items: { name: string; quantity: number; price: number }[];
    total: number;
}) {
    const itemsHtml = params.items
        .map(
            (item) =>
                `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">${item.name}</td><td style="text-align:center;padding:8px 0;border-bottom:1px solid #eee;">${item.quantity}</td><td style="text-align:right;padding:8px 0;border-bottom:1px solid #eee;">$${item.price.toFixed(2)}</td></tr>`
        )
        .join("");

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
    <div style="text-align:center;padding:30px 0;background:#101010;border-radius:8px 8px 0 0;">
        <h1 style="color:#D87D4A;margin:0;font-size:24px;letter-spacing:2px;">AUDIOPHILE</h1>
    </div>
    <div style="padding:30px;background:#fff;border:1px solid #eee;">
        <h2 style="margin:0 0 8px;font-size:20px;">Order Confirmed</h2>
        <p style="color:#666;margin:0 0 24px;">Hi ${params.customerName}, your order <strong>#${params.orderId}</strong> has been placed successfully.</p>
        <table style="width:100%;border-collapse:collapse;">
            <thead><tr><th style="text-align:left;padding:8px 0;border-bottom:2px solid #101010;">Item</th><th style="text-align:center;padding:8px 0;border-bottom:2px solid #101010;">Qty</th><th style="text-align:right;padding:8px 0;border-bottom:2px solid #101010;">Price</th></tr></thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot><tr><td colspan="2" style="text-align:right;padding:16px 0 0;font-weight:bold;">Total</td><td style="text-align:right;padding:16px 0 0;font-weight:bold;">$${params.total.toFixed(2)}</td></tr></tfoot>
        </table>
        <p style="color:#666;margin:24px 0 0;font-size:14px;">You'll receive a shipping confirmation when your order is on its way.</p>
    </div>
    <div style="text-align:center;padding:20px;color:#999;font-size:12px;">
        <p style="margin:0;">Audiophile — Premium Audio Equipment</p>
    </div>
</body>
</html>`;

    return sendEmail({ to: params.email, subject: `Order Confirmed — #${params.orderId}`, html });
}

export function sendOrderShippedEmail(params: {
    email: string;
    orderId: string;
    customerName: string;
    trackingNumber: string;
    carrier: string;
}) {
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
    <div style="text-align:center;padding:30px 0;background:#101010;border-radius:8px 8px 0 0;">
        <h1 style="color:#D87D4A;margin:0;font-size:24px;letter-spacing:2px;">AUDIOPHILE</h1>
    </div>
    <div style="padding:30px;background:#fff;border:1px solid #eee;">
        <h2 style="margin:0 0 8px;font-size:20px;">Your Order Has Shipped</h2>
        <p style="color:#666;margin:0 0 24px;">Hi ${params.customerName}, your order <strong>#${params.orderId}</strong> is on its way!</p>
        <div style="background:#f5f5f5;border-radius:8px;padding:16px;margin:16px 0;">
            <p style="margin:0 0 8px;"><strong>Carrier:</strong> ${params.carrier}</p>
            <p style="margin:0;"><strong>Tracking Number:</strong> ${params.trackingNumber}</p>
        </div>
        <p style="color:#666;margin:16px 0 0;font-size:14px;">Thank you for shopping with Audiophile.</p>
    </div>
    <div style="text-align:center;padding:20px;color:#999;font-size:12px;">
        <p style="margin:0;">Audiophile — Premium Audio Equipment</p>
    </div>
</body>
</html>`;

    return sendEmail({ to: params.email, subject: `Order Shipped — #${params.orderId}`, html });
}
