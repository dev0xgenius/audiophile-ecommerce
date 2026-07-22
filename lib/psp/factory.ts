import { decrypt } from "@/lib/crypto";
import { PaystackAdapter } from "./paystack";
import type { PSPAdapter } from "./types";

export function createAdapter(provider: string, credentials: string): PSPAdapter {
    const decrypted = decrypt(credentials);
    const config = JSON.parse(decrypted);

    switch (provider) {
        case "paystack":
            return new PaystackAdapter(config.secretKey);
        default:
            throw new Error(`Unknown PSP provider: ${provider}`);
    }
}
