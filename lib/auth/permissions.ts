import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export type PermissionCheck = {
    resource: string;
    action: string;
};

export async function getUserPermissions(userId: string): Promise<PermissionCheck[]> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            roles: {
                include: {
                    role: {
                        include: {
                            permissions: {
                                include: {
                                    permission: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!user) return [];

    const permissions = new Map<string, PermissionCheck>();

    for (const userRole of user.roles) {
        for (const rp of userRole.role.permissions) {
            const key = `${rp.permission.resource}:${rp.permission.action}`;
            if (!permissions.has(key)) {
                permissions.set(key, {
                    resource: rp.permission.resource,
                    action: rp.permission.action,
                });
            }
        }
    }

    return Array.from(permissions.values());
}

export function hasPermission(
    permissions: PermissionCheck[],
    resource: string,
    action: string,
): boolean {
    return permissions.some(
        (p) => p.resource === resource && p.action === action,
    );
}

export function requirePermission(
    permissions: PermissionCheck[],
    resource: string,
    action: string,
): void {
    if (!hasPermission(permissions, resource, action)) {
        throw new Error(
            `Permission denied: ${resource}:${action}`,
        );
    }
}

export async function getSessionPermissions(
    headers: Headers,
): Promise<{ userId: string; permissions: PermissionCheck[] } | null> {
    const session = await auth.api.getSession({ headers });

    if (!session?.user?.id) return null;

    const permissions = await getUserPermissions(session.user.id);

    return { userId: session.user.id, permissions };
}

export function withPermission(
    handler: (req: NextRequest, context: { userId: string; permissions: PermissionCheck[] }) => Promise<NextResponse>,
    resource: string,
    action: string,
) {
    return async (request: NextRequest) => {
        const result = await getSessionPermissions(request.headers);

        if (!result) {
            return NextResponse.json(
                { error: "Unauthorized", code: "UNAUTHORIZED" },
                { status: 401 },
            );
        }

        if (!hasPermission(result.permissions, resource, action)) {
            return NextResponse.json(
                { error: "Forbidden", code: "FORBIDDEN" },
                { status: 403 },
            );
        }

        return handler(request, { userId: result.userId, permissions: result.permissions });
    };
}
