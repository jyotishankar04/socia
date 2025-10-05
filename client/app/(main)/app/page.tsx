"use client"

import ChatInput from "@/components/custom/app/chat-input"
import { AppSidebar } from "@/components/custom/essenticals/app-sidebar"
import ThemeToggle from "@/components/custom/essenticals/theme-toggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Gem } from "lucide-react"

import WelcomeSection from "@/components/custom/app/welcome"
import Features from "@/components/custom/app/features"

export default function Page() {

    return (
        <div className="flex flex-col gap-4 p-4 w-full h-full items-center">
            <div className="max-w-3xl w-full max-h-screen min-h-3/4 flex flex-col items-center justify-center gap-16">
                <WelcomeSection />
                <ChatInput />
            </div>
            <div className="w-full max-w-4xl">
                <Features />
            </div>
        </div>
    )
}
