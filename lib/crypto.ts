import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;

function getKey(): Buffer {
    const hex = process.env.ENCRYPTION_KEY;
    if (!hex) throw new Error("ENCRYPTION_KEY is not set");
    return Buffer.from(hex, "hex");
}

export function encrypt(plaintext: string): string {
    const key = getKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(plaintext, "utf8", "hex");
    encrypted += cipher.final("hex");
    const tag = cipher.getAuthTag().toString("hex");
    return `${iv.toString("hex")}:${tag}:${encrypted}`;
}

export function decrypt(payload: string): string {
    const key = getKey();
    const [ivHex, tagHex, encrypted] = payload.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    let plain = decipher.update(encrypted, "hex", "utf8");
    plain += decipher.final("utf8");
    return plain;
}
