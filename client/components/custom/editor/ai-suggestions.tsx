"use client"

import { useRouter } from "next/navigation"
import { Sparkles, LayoutTemplate, LayoutGrid, ImageIcon, Video, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Props {
    chatId: string
    draftId: string
    platform?: string
}

const SUGGESTIONS = [
    { label: "LinkedIn Banner", icon: LayoutTemplate, route: "/app/studio/banners" },
    { label: "Carousel Slides", icon: LayoutGrid, route: "/app/studio/carousels" },
    { label: "Product Graphic", icon: ImageIcon, route: "/app/studio/images/generate" },
    { label: "Video Teaser", icon: Video, route: "/app/studio/video" },
]

export function AiSuggestions({ chatId, draftId, platform }: Props) {
    const router = useRouter()
    const [dismissed, setDismissed] = useState(false)

    if (dismissed) return null

    const handleClick = (route: string) => {
        const params = new URLSearchParams({ chatId, draftId })
        router.push(`${route}?${params.toString()}`)
    }

    return (
        <div className="relative mx-3 mb-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
            <button
                onClick={() => setDismissed(true)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
            >
                <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-start gap-2 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <div>
                    <p className="text-xs font-semibold text-foreground">
                        This {platform ?? "post"} would perform better with visuals
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Generate assets for this draft in one click</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
                {SUGGESTIONS.map(s => (
                    <Button
                        key={s.label}
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px] gap-1.5 justify-start border-border hover:border-primary/40 hover:bg-primary/5"
                        onClick={() => handleClick(s.route)}
                    >
                        <s.icon className="w-3 h-3 text-primary shrink-0" />
                        {s.label}
                    </Button>
                ))}
            </div>
        </div>
    )
}
