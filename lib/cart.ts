export interface CartItem {
    variantId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

const CART_KEY = "audiophile_cart";

export function getCart(): CartItem[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function setCart(items: CartItem[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: CartItem): void {
    const cart = getCart();
    const existing = cart.find((i) => i.variantId === item.variantId);
    if (existing) {
        existing.quantity += item.quantity;
    } else {
        cart.push(item);
    }
    setCart(cart);
}

export function removeFromCart(variantId: string): void {
    const cart = getCart().filter((i) => i.variantId !== variantId);
    setCart(cart);
}

export function updateQuantity(variantId: string, quantity: number): void {
    const cart = getCart();
    const item = cart.find((i) => i.variantId === variantId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(variantId);
        } else {
            item.quantity = quantity;
            setCart(cart);
        }
    }
}

export function clearCart(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CART_KEY);
}

export function getCartTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
