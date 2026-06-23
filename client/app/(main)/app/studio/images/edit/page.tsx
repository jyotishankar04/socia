"use client"

import { StudioCanvas } from "@/components/custom/media/studio-canvas"
import { StudioLeftSidebar } from "@/components/custom/media/studio-left-sidebar"
import { StudioRightSidebar } from "@/components/custom/media/studio-right-sidebar"
import { StudioPromptBar } from "@/components/custom/media/studio-prompt-bar"
import { StudioContextBanner } from "@/components/custom/studio/studio-context-banner"

export default function ImageEditPage() {
    return (
        <div className="flex flex-col h-full bg-zinc-950 overflow-hidden">
            <StudioContextBanner />
            <div className="flex flex-1 overflow-hidden">
                <StudioLeftSidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 flex items-center justify-center p-4 overflow-hidden min-h-0">
                        <StudioCanvas />
                    </div>
                    <StudioPromptBar />
                </div>
                <StudioRightSidebar />
            </div>
        </div>
    )
}
