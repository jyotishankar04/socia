"use client"

import { useConversationsQuery } from "@/lib/query"
import { Conversation } from "@/types"
import { MessageSquare, ChevronRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/custom/shared/empty-state"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SectionHeader } from "@/components/custom/shared/section-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function RecentActivity() {
    const { data: conversationsData, isLoading, isSuccess } = useConversationsQuery()
    const router = useRouter()

    const conversations: Conversation[] = isSuccess ? (conversationsData?.data ?? []) : []
    const recent = conversations.slice(0, 5)

    return (
        <Card>
            <CardHeader className="pb-3">
                <SectionHeader
                    title="Recent Conversations"
                    description="Continue where you left off"
                    action={
                        conversations.length > 5 && (
                            <Button variant="ghost" size="sm" className="text-xs" asChild>
                                <Link href="/app/history">
                                    View all
                                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                </Link>
                            </Button>
                        )
                    }
                />
            </CardHeader>
            <CardContent className="pt-0">
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3">
                                <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : recent.length === 0 ? (
                    <EmptyState
                        icon={MessageSquare}
                        title="No conversations yet"
                        description="Start your first conversation to generate AI-powered social media content."
                        action={
                            <Button size="sm" asChild>
                                <Link href="/app/chat">Start a conversation</Link>
                            </Button>
                        }
                        className="py-10"
                    />
                ) : (
                    <div className="space-y-1">
                        {recent.map((conversation) => (
                            <button
                                key={conversation.id}
                                onClick={() => router.push(`/app/chat/${conversation.id}`)}
                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors text-left group"
                            >
                                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                                    <MessageSquare className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {conversation.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
