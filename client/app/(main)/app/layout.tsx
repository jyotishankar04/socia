import { AppSidebar } from "@/components/custom/essenticals/app-sidebar";
import ThemeToggle from "@/components/custom/essenticals/theme-toggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ProtectionProvider from "@/providers/protection-provider";
import { Gem } from "lucide-react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<ProtectionProvider>

        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="h-screen">
                <header className="flex  h-16 shrink-0 items-center gap-2 border-b px-4">
                    <div className="flex flex-1 h-5 items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" />
                        <h1>Hi Jyotishankar</h1>
                    </div>
                    <div className="flex gap-2 items-center">
                        {
                            false ? <>
                                <Button variant={"outline"}>
                                    <span>SignIn</span>
                                </Button>
                                <Button>
                                    <span>SignUp</span>
                                </Button>
                            </> : <>
                                {
                                    false ? (<>
                                        <ThemeToggle />
                                        <Button variant={"destructive"}>
                                            <span>SignOut</span>
                                        </Button>
                                    </>) : (
                                        <>
                                            <Button className="bg-accent text-accent-foreground">
                                                <Gem className="mr-2 h-4 w-4" />
                                                Upgrade to Pro</Button>
                                            <ThemeToggle />
                                        </>
                                    )
                                }
                            </>
                        }
                    </div>
                </header>
                <div className="flex-1 w-full h-full overflow-y-auto">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    </ProtectionProvider>
    );
}
