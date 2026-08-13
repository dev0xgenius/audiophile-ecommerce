import "./dashboard.css";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "@/components/store-provider";

export default function DashboardLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <StoreProvider>
        <SidebarProvider
            className="dashboard-grid"
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset className="bg-gray">
                <SiteHeader />
                {children}
            </SidebarInset>
            <Toaster />
        </SidebarProvider>
        </StoreProvider>
    );
}
