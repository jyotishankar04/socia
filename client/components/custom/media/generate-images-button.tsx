"use client"

import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props {
    chatId: string
    draftId?: string
}

export function GenerateImagesButton({ chatId, draftId }: Props) {
    const router = useRouter()

    const handleClick = () => {
        const params = new URLSearchParams({ chatId })
        if (draftId) params.set("draftId", draftId)
        router.push(`/app/studio?${params.toString()}`)
    }

    return (
        <Button
            variant="outline"
            size="sm"
            className="w-full gap-1.5"
            onClick={handleClick}
        >
            <Wand2 className="w-4 h-4" />
            Open AI Studio
        </Button>
    )
}
