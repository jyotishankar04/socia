"use client"

import { useImageStudio } from "@/store/use-image-studio"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function StudioContextBanner() {
    const { context } = useImageStudio()
    const router = useRouter()

    if (!context?.chatId) return null

    return (
        <div className="flex items-center justify-between px-4 py-2 bg-primary/10 border-b border-primary/20 text-xs text-primary">
            <span>
                Generating for:{" "}
                <strong>{context.postTitle ?? "Untitled Post"}</strong>
                {context.version != null && ` · v${context.version}`}
                {context.platform && ` · ${context.platform}`}
            </span>
            <Button
                size="sm"
                variant="ghost"
                className="h-6 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10"
                onClick={() => router.push(`/app/editor/${context.chatId}`)}
            >
                <ArrowLeft className="w-3 h-3" />
                Back to Editor
            </Button>
        </div>
    )
}
