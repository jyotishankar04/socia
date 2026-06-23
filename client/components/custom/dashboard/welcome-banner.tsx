"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useAuthStore } from "@/store/auth"
import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "motion/react"
import { useEffect, useState } from "react"

function getGreeting(): string {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
}

export function WelcomeBanner() {
    const { user } = useAuthStore()
    const [greeting, setGreeting] = useState("Good morning")
    const firstName = user?.name?.split(" ")[0] ?? "there"

    useEffect(() => {
        setGreeting(getGreeting())
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 overflow-hidden relative">
                <CardContent className="p-6 sm:p-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-primary/80">
                                {greeting}, <span className="text-primary font-semibold">{firstName}</span>
                            </p>
                            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                                Ready to create something great today?
                            </h2>
                            <p className="text-sm text-muted-foreground max-w-lg">
                                Generate platform-optimized social media content in seconds with AI. Pick a platform, describe your idea, and let AI do the rest.
                            </p>
                        </div>
                        <Link href="/app/chat" className="shrink-0">
                            <Button size="sm" className="gap-2 shadow-sm">
                                <Sparkles className="w-4 h-4" />
                                New Post
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
