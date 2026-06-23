"use client"

import { cn } from "@/lib/utils"
import { Globe, Link2, Search, TrendingUp, User, Loader2 } from "lucide-react"
import type { SearchItem } from "@/types"
import { AnimatePresence, motion } from "motion/react"

const iconMap: Record<SearchItem["icon"], React.ComponentType<{ className?: string }>> = {
    web: Globe,
    url: Link2,
    person: User,
    platform: TrendingUp,
    trend: Search,
}

interface SearchIndicatorProps {
    searches: SearchItem[]
    className?: string
}

export function SearchIndicator({ searches, className }: SearchIndicatorProps) {
    if (!searches.length) return null

    // Show only the 3 most recent
    const recent = searches.slice(-3)

    return (
        <div className={cn("space-y-1.5 w-full", className)}>
            <AnimatePresence mode="popLayout">
                {recent.map((search, i) => {
                    const Icon = iconMap[search.icon] ?? Search
                    return (
                        <motion.div
                            key={`${search.label}-${i}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/40 border border-border/50 overflow-hidden"
                        >
                            <div className="w-6 h-6 rounded-md bg-background border border-border flex items-center justify-center shrink-0">
                                <Icon className="w-3 h-3 text-muted-foreground" />
                            </div>
                            <span className="text-xs text-muted-foreground truncate">{search.label}</span>
                            <Loader2 className="w-3 h-3 text-primary animate-spin shrink-0 ml-auto" />
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
    )
}
