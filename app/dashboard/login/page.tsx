"use client";

import { useState } from "react";
import { createAuthClient } from "better-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const authClient = createAuthClient();

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        console.log("Email: ", email);
        console.log("Password: ", password);
        const { error: signInError } = await authClient.signIn.email({
            email,
            password,
        });

        setLoading(false);

        if (signInError) {
            setError(signInError.message || "Invalid email or password");
            return;
        }

        router.push("/dashboard");
        router.refresh();
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <Card className="w-full max-w-sm glass-card">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl gradient-text">
                        Audiophile
                    </CardTitle>
                    <CardDescription>Sign in to your dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="rounded-lg bg-danger/10 border border-danger/20 px-3 py-2 text-sm text-error">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@audiophile.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
