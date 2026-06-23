"use client"

import { AppSidebar } from "@/components/custom/essenticals/app-sidebar";
import ThemeToggle from "@/components/custom/essenticals/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ProtectionProvider from "@/providers/protection-provider";
import { useAuthStore } from "@/store/auth";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function Breadcrumbs() {
    const pathname = usePathname()
    const segments = pathname.split("/").filter(Boolean)

    if (segments.length <= 1) return null

    const breadcrumbs = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/")
        const label = segment.charAt(0).toUpperCase() + segment.slice(1)
        const isLast = index === segments.length - 1
        return { href, label, isLast }
    })

    return (
        <nav className="flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center gap-1">
                    {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                    {crumb.isLast ? (
                        <span className="text-foreground font-medium">{crumb.label}</span>
                    ) : (
                        <Link
                            href={crumb.href}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {crumb.label}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    )
}

function AppLayoutInner({ children }: { children: React.ReactNode }) {
    const { user } = useAuthStore()
    const pathname = usePathname()
    const firstName = user?.name?.split(" ")[0] ?? "there"
    const isDashboard = pathname === "/app"

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="h-screen">
                <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4 bg-background/95 backdrop-blur-sm">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-4" />
                        {isDashboard ? (
                            <span className="text-sm text-muted-foreground truncate">
                                Hi, <span className="font-medium text-foreground">{firstName}</span>
                            </span>
                        ) : (
                            <Breadcrumbs />
                        )}
                    </div>
                    <div className="flex gap-2 items-center shrink-0">
                        <ThemeToggle />
                    </div>
                </header>
                <div className="flex-1 w-full h-full overflow-y-auto">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ProtectionProvider>
            <AppLayoutInner>{children}</AppLayoutInner>
        </ProtectionProvider>
    );
}
