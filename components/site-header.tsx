"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const titles: Record<string, string> = {
    "/dashboard": "Overview",
    "/dashboard/products": "Products",
    "/dashboard/orders": "Orders",
    "/dashboard/inventory": "Inventory",
};

export function SiteHeader() {
    const pathname = usePathname();
    const isOverview = pathname === "/dashboard";
    const title = titles[pathname];

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                {isOverview ? (
                    <h1 className="text-sm font-semibold uppercase tracking-wider ml-2">
                        {title}
                    </h1>
                ) : (
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/dashboard">Dashboard</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                )}
            </div>
        </header>
    );
}
