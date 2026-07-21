import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    plugins: [nextCookies()],
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24 * 7,
        },
        fields: {
            token: "sessionToken",
            expiresAt: "expires",
        },
    },
    user: {
        additionalFields: {
            isActive: {
                type: "boolean",
                defaultValue: true,
                required: false,
                input: false,
            },
        },
    },
    account: {
        fields: {
            providerId: "provider",
            accountId: "providerAccountId",
        },
    },
});
