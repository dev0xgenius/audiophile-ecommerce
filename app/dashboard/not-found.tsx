import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AppSidebar } from "@/components/app-sidebar"

export default function NotFound() {
    return (
        <div className="flex min-h-screen">
            <AppSidebar />
            <main className="flex-1 flex items-center justify-center p-8">
                <div className="flex flex-col items-center gap-4 text-center">
                    <h2 className="text-lg font-semibold">Page not found</h2>
                    <p className="text-sm text-muted-foreground">
                        The dashboard page you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <Button asChild variant="outline">
                        <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                </div>
            </main>
        </div>
    )
}
