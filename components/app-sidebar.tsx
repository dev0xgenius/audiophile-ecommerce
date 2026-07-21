"use client";

import {
    IconDashboard,
    IconDeviceAudioTape,
    IconHelp,
    IconPackage,
    IconPackages,
    IconSearch,
    IconSettings,
    IconShoppingBag,
    IconUsers,
    IconPhoto,
    IconCreditCard,
    IconTags,
    IconBuildingWarehouse,
    IconUserCog,
    IconShield,
    IconHistory,
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Overview",
            url: "",
            icon: IconDashboard,
        },
        {
            title: "Products",
            url: "products",
            icon: IconShoppingBag,
        },
        {
            title: "Orders",
            url: "orders",
            icon: IconPackages,
        },
        {
            title: "Inventory",
            url: "inventory",
            icon: IconPackage,
        },
        {
            title: "Customers",
            url: "customers",
            icon: IconUsers,
        },
        {
            title: "Payments",
            url: "payments",
            icon: IconCreditCard,
        },
        {
            title: "Gallery",
            url: "gallery",
            icon: IconPhoto,
        },
        {
            title: "Bundles",
            url: "bundles",
            icon: IconTags,
        },
        {
            title: "Suppliers",
            url: "suppliers",
            icon: IconBuildingWarehouse,
        },
        {
            title: "Users",
            url: "users",
            icon: IconUserCog,
        },
        {
            title: "Roles",
            url: "roles",
            icon: IconShield,
        },
        {
            title: "Audit Log",
            url: "audit-logs",
            icon: IconHistory,
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: IconSettings,
        },
        {
            title: "Get Help",
            url: "#",
            icon: IconHelp,
        },
        {
            title: "Search",
            url: "#",
            icon: IconSearch,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" className="glass-sidebar" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <a href="#">
                                <IconDeviceAudioTape className="size-5!" />
                                <span className="text-base font-semibold">
                                    Audiophile
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
