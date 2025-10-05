"use client"

import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import AiLoader from "./AiLoader"
import { Response } from "@/components/ai-elements/response"


export interface Message {
    id: string
    role: "user" | "assistant"
    content: string
}

interface ChatMessagesProps {
    messages: Message[]
    isLoading?: boolean
}

const EmptyState = ({ onSuggestionClick }: { onSuggestionClick?: (suggestion: string) => void }) => {
    const suggestions = [
        "Tell me about your projects",
        "What technologies do you use?",
        "View your resume",
        "How can I contact you?",
    ]

    return (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <div className="relative mb-6">
                <div className="bg-primary/10 rounded-full p-4 inline-flex items-center justify-center">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src="/office.png" className="object-cover" alt="Profile" />
                        <AvatarFallback className="text-primary">AI</AvatarFallback>
                    </Avatar>
                </div>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-foreground">Welcome</h3>
            <p className="text-muted-foreground max-w-md mb-6">
                Ask anything about the work, skills, and experience. Or try one of these:
            </p>

            <div className="grid w-full max-w-lg grid-cols-1 gap-2 md:grid-cols-2">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => onSuggestionClick?.(suggestion)}
                        className="rounded-lg border border-input bg-background p-3 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>

            <p className="mt-6 text-xs text-muted-foreground">Tip: Press Enter to send, Shift+Enter for a new line.</p>
        </div>
    )
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null)
    const bottomRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, [messages, isLoading])

    return (
        <div ref={scrollContainerRef} className=" overflow-y-auto" aria-live="polite" aria-relevant="additions">
            {messages.length === 0 ? (
                <EmptyState/>
            ) : (
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4">
                    {messages.map((message) => {
                        const isUser = message.role === "user"
                        return (
                            <div key={message.id} className={`flex items-start gap-1 md:gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                                {!isUser && (
                                    <Avatar className="h-8 w-8 mt-0.5 shrink-0">
                                        <AvatarImage src="/office.png" className="object-cover w-full" alt="Assistant" />
                                        <AvatarFallback>AI</AvatarFallback>
                                    </Avatar>
                                )}

                                <div
                                    className={[
                                        "max-w-[90%] px-2 py-2 md:max-w-[80%]",
                                        isUser
                                            ? "bg-primary text-primary-foreground rounded-br-md rounded-2xl"
                                            : "",
                                    ].join(" ")}
                                >
                                    <Response className="w-full overflow-x-auto">{message.content}</Response>
                                    
                                </div>

                                {isUser && (
                                    <Avatar className="h-8 w-8 mt-0.5 shrink-0">
                                        <AvatarImage src="/placeholder-user.jpg" alt="You" />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        )
                    })}

                    {isLoading && (
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 mt-0.5 shrink-0">
                                <AvatarImage src="/office.png" className="object-cover w-full" alt="Assistant" />
                                <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                            <div className="rounded-2xl px-4 py-2 shadow-sm">
                                {/* <AiLoader /> */}Loading...
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} className="h-px w-full" />
                </div>
            )}
        </div>
    )
}