import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/dashboard/login"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtected = protectedRoutes.some((route) =>
        pathname === route || pathname.startsWith(`${route}/`),
    );
    const isAuthPage = authRoutes.some((route) =>
        pathname === route || pathname.startsWith(`${route}/`),
    );

    if (!isProtected && !isAuthPage) return NextResponse.next();

    const sessionCookie = getSessionCookie(request);

    if (isAuthPage && sessionCookie) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isProtected && !sessionCookie && !isAuthPage) {
        const loginUrl = new URL("/dashboard/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
