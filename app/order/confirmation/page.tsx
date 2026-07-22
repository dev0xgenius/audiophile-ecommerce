import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrderConfirmationPage({
    searchParams,
}: {
    searchParams: Promise<{ reference?: string }>;
}) {
    const { reference } = await searchParams;

    if (!reference) {
        redirect("/");
    }

    const payment = await prisma.payment.findFirst({
        where: { pspPaymentIntentId: reference },
        include: {
            order: {
                include: {
                    items: { include: { variant: true } },
                    customer: true,
                },
            },
        },
    });

    if (!payment || !payment.order) {
        return (
            <div className="container mx-auto max-w-[1110px] px-6 py-24 text-center">
                <h1 className="text-h2 mb-4">Order Not Found</h1>
                <p className="text-accent-foreground mb-8">
                    We couldn't find an order with that reference. Please contact support.
                </p>
                <Link href="/" className="text-primary hover:underline">
                    Return to Home
                </Link>
            </div>
        );
    }

    const order = payment.order;

    return (
        <div className="container mx-auto max-w-[1110px] px-6 py-24">
            <div className="max-w-lg mx-auto">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-h3 mb-4">Order Confirmed</h1>
                    <p className="text-accent-foreground">
                        Thank you, {order.customer?.name ?? "Guest"}! Your order has been placed successfully.
                    </p>
                </div>

                <div className="bg-off-white rounded-lg p-6 md:p-8 mb-8">
                    <div className="flex justify-between items-center mb-6 pb-6 border-b border-border">
                        <div>
                            <p className="text-sm text-accent-foreground">Order ID</p>
                            <p className="font-semibold">#{order.id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-accent-foreground">Payment</p>
                            <p className="font-semibold text-primary capitalize">{payment.status}</p>
                        </div>
                    </div>

                    <div className="divide-y divide-border">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-medium">{item.variant?.name ?? "Item"}</span>
                                    <span className="text-sm text-accent-foreground">x{item.quantity}</span>
                                </div>
                                <span className="tabular-nums">${item.lineTotal.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-border pt-4 mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-accent-foreground">Subtotal</span>
                            <span className="tabular-nums">${order.subtotal.toLocaleString()}</span>
                        </div>
                        {order.shippingCost > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-accent-foreground">Shipping</span>
                                <span className="tabular-nums">${order.shippingCost.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span className="text-accent-foreground">Tax</span>
                            <span className="tabular-nums">${order.taxAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t border-border">
                            <span>Total</span>
                            <span className="tabular-nums">${order.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-accent-foreground mb-6">
                        You'll receive a confirmation email shortly.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/"
                            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
