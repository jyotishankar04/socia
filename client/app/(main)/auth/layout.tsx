"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import ProtectionProvider from "@/providers/protection-provider"
import { IconBrandGithub, IconBrandGoogleFilled } from "@tabler/icons-react"
import { usePathname } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const ignorePaths = [
    "/auth/reset-password",
    "/auth/forgot-password",
    "/auth/otp-verification",
    "/auth/onboard",
]

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const pathname = usePathname()
    const showOAuthOptions = !ignorePaths.includes(pathname)

    return (
        <ProtectionProvider>
            <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 bg-background">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col items-center gap-3 mb-8">
                        <div className="flex flex-row items-baseline gap-1">
                            <h1 className="text-3xl font-bold">
                                <span className="text-primary">Q</span>wikish
                            </h1>
                            <span className="text-primary font-semibold text-lg">Socia</span>
                        </div>
                        <p className="text-xs text-muted-foreground">AI-powered social media content</p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        {children}
                    </div>

                    {showOAuthOptions && (
                        <>
                            <div className="flex items-center gap-3 my-5">
                                <Separator className="flex-1" />
                                <span className="text-xs text-muted-foreground px-1">or continue with</span>
                                <Separator className="flex-1" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="gap-2" disabled>
                                    <IconBrandGoogleFilled className="h-4 w-4" />
                                    Google
                                </Button>
                                <Button variant="outline" className="gap-2" disabled>
                                    <IconBrandGithub className="h-4 w-4" />
                                    GitHub
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground text-center mt-5 leading-relaxed">
                                By continuing, you agree to our{" "}
                                <span className="underline underline-offset-4 hover:text-foreground cursor-pointer transition-colors">
                                    Terms of Service
                                </span>{" "}
                                and{" "}
                                <span className="underline underline-offset-4 hover:text-foreground cursor-pointer transition-colors">
                                    Privacy Policy
                                </span>
                                .
                            </p>
                        </>
                    )}

                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </ProtectionProvider>
    )
}

export default AuthLayout
