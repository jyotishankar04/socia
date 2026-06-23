"use client"

import React, { useEffect, useRef, memo } from "react"
import { SourcesCard } from "@/components/custom/shared/sources-card"
import { SearchIndicator } from "@/components/custom/shared/search-indicator"
import { Message, ResourceItem, SearchItem } from "@/types"
import { Sparkles, User, Eye, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Streamdown } from "streamdown"
import { Button } from "@/components/ui/button"

const Response = memo(
    function ResponseInner({ className, ...props }: React.ComponentProps<typeof Streamdown>) {
        return (
            <Streamdown
                className={cn("size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0", className)}
                {...props}
            />
        )
    },
    (prev, next) => prev.children === next.children
)

interface ChatMessagesProps {
    messages: Message[]
    isLoading?: boolean
    currentStep?: string | null
    currentSources?: string[]
    liveSearches?: SearchItem[]
    onSuggestionClick?: (suggestion: string) => void
    onPreviewDraft?: (content: string) => void
    onAcceptDraft?: (draftId: string) => void
    scrollToMessageId?: string | null
    selectedDraftId?: string | null
}

const suggestions = [
    "Write a thought leadership post about AI trends in 2025",
    "Create an engaging post about our product launch",
    "Draft a post celebrating a team milestone",
    "Write a post sharing an industry insight or data point",
]

const EmptyState = ({ onSuggestionClick }: { onSuggestionClick?: (s: string) => void }) => (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20">
            <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">Ready to create</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-8">
            Describe the post you want and I&apos;ll generate platform-optimized content for you.
        </p>
        <div className="grid w-full max-w-lg grid-cols-1 gap-2 md:grid-cols-2">
            {suggestions.map((suggestion, index) => (
                <button
                    key={index}
                    onClick={() => onSuggestionClick?.(suggestion)}
                    className="rounded-xl border border-border bg-card p-3.5 text-left text-sm transition-all duration-150 hover:bg-accent hover:border-primary/20 hover:shadow-sm active:scale-[0.98]"
                >
                    {suggestion}
                </button>
            ))}
        </div>
        <p className="mt-8 text-xs text-muted-foreground flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">Enter</kbd>
            to send ·
            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">Shift+Enter</kbd>
            new line
        </p>
    </div>
)

const TypingIndicator = ({ step, sources }: { step?: string | null; sources?: string[] }) => (
    <div className="flex items-start gap-3 px-4">
        <div className="h-8 w-8 mt-0.5 shrink-0 rounded-full bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div className="rounded-2xl rounded-tl-md px-4 py-3 bg-muted/60 border border-border/50">
            <div className="flex items-center gap-2 flex-wrap">
                {step && (
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {step}
                    </span>
                )}
                {sources && sources.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                        · Found {sources.length} source{sources.length > 1 ? "s" : ""}
                    </span>
                )}
                <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/30 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/30 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/30 animate-bounce" />
                </div>
            </div>
        </div>
    </div>
)

const UserAvatar = () => (
    <div className="h-8 w-8 mt-0.5 shrink-0 rounded-full bg-primary flex items-center justify-center ring-2 ring-primary/20">
        <User className="w-4 h-4 text-primary-foreground" />
    </div>
)

const AiAvatar = () => (
    <div className="h-8 w-8 mt-0.5 shrink-0 rounded-full bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
    </div>
)

function DraftActions({
    draft,
    onPreview,
    onAccept,
}: {
    draft: NonNullable<Message["post"]>
    onPreview?: (content: string) => void
    onAccept?: (draftId: string) => void
}) {
    return (
        <div className="flex items-center gap-2 mt-2">
            {draft.isAccepted ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Accepted · v{draft.version}
                </div>
            ) : (
                <>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1.5 rounded-lg"
                        onClick={() => onPreview?.(draft.content)}
                    >
                        <Eye className="w-3 h-3" />
                        Preview
                    </Button>
                    <Button
                        size="sm"
                        className="h-7 text-xs gap-1.5 rounded-lg"
                        onClick={() => onAccept?.(draft.id)}
                    >
                        <CheckCircle2 className="w-3 h-3" />
                        Accept Draft
                    </Button>
                    <span className="text-[10px] text-muted-foreground">v{draft.version}</span>
                </>
            )}
        </div>
    )
}

export default function ChatMessages({
    messages,
    isLoading,
    currentStep,
    currentSources,
    liveSearches,
    onSuggestionClick,
    onPreviewDraft,
    onAcceptDraft,
    scrollToMessageId,
    selectedDraftId,
}: ChatMessagesProps) {
    const bottomRef = useRef<HTMLDivElement | null>(null)
    const prevMessageCount = useRef(messages.length)
    const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map())

    useEffect(() => {
        const el = bottomRef.current
        if (!el) return
        const behavior = prevMessageCount.current !== messages.length ? "smooth" : "instant"
        prevMessageCount.current = messages.length
        el.scrollIntoView({ behavior, block: "end" })
    }, [messages])

    useEffect(() => {
        if (scrollToMessageId) {
            const ref = messageRefs.current.get(scrollToMessageId)
            if (ref) {
                ref.scrollIntoView({ behavior: "smooth", block: "center" })
            }
        }
    }, [scrollToMessageId])

    useEffect(() => {
        if (isLoading) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
        }
    }, [isLoading, liveSearches])

    const setMessageRef = (id: string) => (el: HTMLDivElement | null) => {
        if (el) messageRefs.current.set(id, el)
        else messageRefs.current.delete(id)
    }

    return (
        <div className="overflow-y-auto h-full" aria-live="polite" aria-relevant="additions">
            {messages.length === 0 ? (
                <EmptyState onSuggestionClick={onSuggestionClick} />
            ) : (
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-1 p-4">
                    {messages.map((message) => {
                        const isUser = message.role === "USER"
                        const resources = message.metadata?.resources as ResourceItem[] | undefined
                        const hasResources = resources && resources.length > 0
                        const draft = message.post
                        const isSelectedDraft = selectedDraftId != null && selectedDraftId === draft?.id

                        return (
                            <div key={message.id} ref={setMessageRef(message.id)}>
                                <div
                                    className={cn(
                                        "flex items-start gap-3 py-2",
                                        isUser ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {!isUser && <AiAvatar />}

                                    <div
                                        className={cn(
                                            "max-w-[85%] md:max-w-[75%]",
                                            isUser
                                                ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5 text-sm leading-relaxed shadow-sm"
                                                : "text-sm leading-relaxed",
                                        )}
                                    >
                                        {isUser ? (
                                            message.content
                                        ) : (
                                            <div className={cn(
                                                "rounded-2xl bg-card border p-4 shadow-sm",
                                                isSelectedDraft && "border-primary ring-1 ring-primary/20"
                                            )}>
                                                <Response className="prose prose-sm dark:prose-invert max-w-none
                                                    prose-headings:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed
                                                    prose-strong:text-foreground prose-li:text-foreground/90
                                                    prose-a:text-primary prose-code:text-foreground/80 prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                                                    prose-pre:bg-muted prose-pre:border prose-pre:border-border">
                                                    {message.content}
                                                </Response>
                                                {draft && (
                                                    <DraftActions
                                                        draft={draft}
                                                        onPreview={onPreviewDraft}
                                                        onAccept={onAcceptDraft}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {isUser && <UserAvatar />}
                                </div>

                                {!isUser && hasResources && (
                                    <div className="ml-11">
                                        <SourcesCard resources={resources!} className="max-w-[85%] md:max-w-[75%]" />
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {isLoading && liveSearches && liveSearches.length > 0 && (
                        <div className="px-4 py-2">
                            <SearchIndicator searches={liveSearches} className="max-w-[85%] md:max-w-[75%]" />
                        </div>
                    )}

                    {isLoading && <TypingIndicator step={currentStep} sources={currentSources} />}

                    <div ref={bottomRef} className="h-px w-full" />
                </div>
            )}
        </div>
    )
}
