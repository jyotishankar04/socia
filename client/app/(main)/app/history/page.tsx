"use client"

import { PageHeader } from "@/components/custom/shared/page-header"
import { EmptyState } from "@/components/custom/shared/empty-state"
import { useConversationsQuery } from "@/lib/query"
import { Conversation } from "@/types"
import { MessageSquare, Search, Trash2, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "motion/react"

export default function HistoryPage() {
    const { data: conversationsData, isLoading, isSuccess } = useConversationsQuery()
    const router = useRouter()
    const [search, setSearch] = useState("")

    const conversations: Conversation[] = isSuccess ? (conversationsData?.data ?? []) : []
    const filtered = conversations.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-6 space-y-6 max-w-5xl w-full mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <PageHeader
                    title="History"
                    description={`${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}`}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="relative"
            >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search conversations..."
                    className="pl-9 bg-card"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </motion.div>

            {isLoading ? (
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-border">
                            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <Skeleton className="h-4 w-64" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <Skeleton className="h-4 w-16" />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={search ? Search : Clock}
                    title={search ? "No results found" : "No conversations yet"}
                    description={search ? "Try a different search term" : "Your conversation history will appear here"}
                />
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-1.5"
                >
                    {filtered.map((conversation, index) => (
                        <motion.div
                            key={conversation.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                        >
                            <div
                                onClick={() => router.push(`/app/chat/${conversation.id}`)}
                                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent/40 hover:border-primary/20 transition-all duration-200 cursor-pointer group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                                    <MessageSquare className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {conversation.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                        <Clock className="w-3 h-3" />
                                        {formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                    }}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    )
}
