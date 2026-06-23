"use client"

import { useSearchParams } from "next/navigation"
import { useGetConversation } from "@/lib/query"
import { useImageStudio } from "@/store/use-image-studio"
import { useEffect } from "react"
import { ArrowLeft, Users, MessageSquare, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { Draft, Message } from "@/types"

export function StudioContextBanner() {
    const searchParams = useSearchParams()
    const chatId = searchParams.get("chatId") ?? undefined
    const draftId = searchParams.get("draftId") ?? undefined
    const router = useRouter()
    const { setContext, context } = useImageStudio()

    const { data: conversationData } = useGetConversation(chatId ?? "")

    useEffect(() => {
        if (!chatId) { setContext(null); return }

        const messages: Message[] = conversationData?.data?.messages ?? []
        const platform: string = conversationData?.data?.platform ?? "linkedin"

        const targetDraft = draftId
            ? messages.find(m => m.post?.id === draftId)?.post as Draft | undefined
            : messages.find(m => m.role === "ASSISTANT" && m.post?.isAccepted)?.post as Draft | undefined

        // Extract audience/tone from message metadata if available
        const draftMsg = messages.find(m => m.post?.id === (targetDraft?.id ?? draftId))
        const meta = draftMsg?.metadata as Record<string, unknown> | undefined

        setContext({
            chatId,
            draftId: targetDraft?.id ?? draftId,
            postTitle: conversationData?.data?.title ?? "Untitled Post",
            platform,
            version: targetDraft?.version,
            audience: (meta?.audience as string) ?? undefined,
            tone: (meta?.tone as string) ?? undefined,
        })
    }, [chatId, draftId, conversationData, setContext])

    if (!context?.chatId) return null

    return (
        <div className="w-full border-b border-primary/20 bg-primary/5 px-4 py-2.5">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="min-w-0">
                        <p className="text-[10px] text-primary/60 uppercase tracking-wider font-semibold mb-0.5">Generating assets for</p>
                        <p className="text-xs font-semibold text-primary truncate">
                            {context.postTitle}
                            {context.version != null && (
                                <span className="ml-1.5 px-1.5 py-0.5 rounded bg-primary/15 text-[10px] font-medium">v{context.version}</span>
                            )}
                            {context.platform && (
                                <span className="ml-1.5 text-primary/60 capitalize font-normal">· {context.platform}</span>
                            )}
                        </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-3 text-[11px] text-primary/70">
                        {context.audience && (
                            <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {context.audience}
                            </span>
                        )}
                        {context.tone && (
                            <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {context.tone}
                            </span>
                        )}
                        {context.platform && (
                            <span className="flex items-center gap-1">
                                <Hash className="w-3 h-3" />
                                {context.platform}
                            </span>
                        )}
                    </div>
                </div>

                <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10 shrink-0"
                    onClick={() => router.push(`/app/editor/${context.chatId}`)}
                >
                    <ArrowLeft className="w-3 h-3" />
                    Back to Editor
                </Button>
            </div>
        </div>
    )
}
