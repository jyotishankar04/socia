"use client"

import { useState } from "react"
import { CheckCircle2, Eye, Sparkles, Globe, TrendingUp, User, AtSign, ExternalLink, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Draft, ResourceItem, SourceRef } from "@/types"
import { useAcceptDraft } from "@/lib/query"
import { useQueryClient } from "@tanstack/react-query"

interface DraftCardProps {
    draft: Draft
    conversationId: string
    score?: number | null
    onPreview: (content: string) => void
    isSelected?: boolean
    contextSources?: string[]
    resources?: ResourceItem[]
}

const SOURCE_ICONS: Record<string, React.ReactNode> = {
    "Website Research": <Globe className="w-3 h-3" />,
    "Web Research": <Globe className="w-3 h-3" />,
    "Trend Research": <TrendingUp className="w-3 h-3" />,
    "Platform Research": <TrendingUp className="w-3 h-3" />,
    "Profile Lookup": <AtSign className="w-3 h-3" />,
    "User Instructions": <User className="w-3 h-3" />,
}

const TYPE_ICON: Record<string, React.ReactNode> = {
    web: <Globe className="w-3.5 h-3.5" />,
    url: <Globe className="w-3.5 h-3.5" />,
    person: <AtSign className="w-3.5 h-3.5" />,
    platform: <TrendingUp className="w-3.5 h-3.5" />,
    trend: <TrendingUp className="w-3.5 h-3.5" />,
}

function Favicon({ domain }: { domain: string }) {
    const [error, setError] = useState(false)
    if (error) return <Globe className="w-3 h-3 text-muted-foreground shrink-0" />
    return (
        <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
            alt=""
            width={12}
            height={12}
            className="w-3 h-3 rounded-sm shrink-0"
            onError={() => setError(true)}
        />
    )
}

function SourceChip({ ref: r, index }: { ref: SourceRef; index: number }) {
    return (
        <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs border border-border rounded-lg px-2 py-1 bg-background/60 hover:bg-accent hover:border-primary/30 transition-colors min-w-0 max-w-[160px]"
        >
            <span className="text-muted-foreground font-medium shrink-0">{index + 1}</span>
            <Favicon domain={r.domain} />
            <span className="truncate text-muted-foreground">{r.domain}</span>
        </a>
    )
}

function SourcesModal({ resources, open, onClose }: { resources: ResourceItem[]; open: boolean; onClose: () => void }) {
    const allRefs: Array<SourceRef & { resourceTitle: string; resourceType: string }> = []
    for (const r of resources) {
        if (r.url && !r.refs?.length) {
            let domain = r.url
            try { domain = new URL(r.url).hostname.replace(/^www\./, "") } catch {}
            allRefs.push({ title: r.title, url: r.url, domain, resourceTitle: r.title, resourceType: r.type })
        }
        for (const ref of r.refs ?? []) {
            allRefs.push({ ...ref, resourceTitle: r.title, resourceType: r.type })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-sm">
                        <BookOpen className="w-4 h-4 text-primary" />
                        Sources consulted
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-2">
                    <div className="space-y-1 pb-1">
                        {resources.map((r, ri) => (
                            <div key={ri} className="space-y-1">
                                <div className="flex items-center gap-1.5 pt-2 first:pt-0">
                                    <span className="text-primary/70">{TYPE_ICON[r.type]}</span>
                                    <span className="text-xs font-medium text-muted-foreground truncate">{r.title}</span>
                                </div>
                                {(r.refs ?? (r.url ? [{ title: r.title, url: r.url, domain: (() => { try { return new URL(r.url!).hostname.replace(/^www\./, "") } catch { return r.url! } })() }] : [])).map((ref, rfi) => (
                                    <a
                                        key={rfi}
                                        href={ref.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-2 pl-5 py-1.5 rounded-lg hover:bg-muted/60 transition-colors group"
                                    >
                                        <Favicon domain={ref.domain} />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-foreground truncate group-hover:text-primary transition-colors">{ref.title}</p>
                                            <p className="text-xs text-muted-foreground truncate">{ref.domain}</p>
                                        </div>
                                        <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                ))}
                            </div>
                        ))}
                        {allRefs.length === 0 && (
                            <p className="text-xs text-muted-foreground text-center py-4">No external sources were fetched.</p>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export function DraftCard({ draft, conversationId, score, onPreview, isSelected, contextSources, resources }: DraftCardProps) {
    const [sourcesOpen, setSourcesOpen] = useState(false)
    const queryClient = useQueryClient()
    const { mutate: accept, isPending } = useAcceptDraft()

    const handleAccept = () => {
        accept(
            { conversationId, postId: draft.id },
            { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] }) }
        )
    }

    // Collect all SourceRef items across all resources for the chips row
    const allSourceRefs: SourceRef[] = []
    for (const r of resources ?? []) {
        if (r.url && !r.refs?.length) {
            let domain = r.url
            try { domain = new URL(r.url).hostname.replace(/^www\./, "") } catch {}
            allSourceRefs.push({ title: r.title, url: r.url, domain })
        }
        allSourceRefs.push(...(r.refs ?? []))
    }
    const visibleRefs = allSourceRefs.slice(0, 3)
    const hiddenCount = allSourceRefs.length - visibleRefs.length

    return (
        <>
            <div className={[
                "mt-2 rounded-xl border p-3 space-y-2.5 transition-colors",
                isSelected ? "border-primary/60 bg-primary/5" : "border-border bg-muted/40",
            ].join(" ")}>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                            <Sparkles className={`w-3.5 h-3.5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                            {draft.platform.charAt(0).toUpperCase() + draft.platform.slice(1).toLowerCase()} Post
                        </div>
                        <Badge variant={isSelected ? "default" : "secondary"} className="text-xs px-1.5 py-0">
                            v{draft.version}
                        </Badge>
                        {score != null && (
                            <Badge variant="outline" className="text-xs px-1.5 py-0 text-muted-foreground">
                                {score.toFixed(1)}/10
                            </Badge>
                        )}
                    </div>

                    {draft.isAccepted && (
                        <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Accepted
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button size="sm" variant={isSelected ? "default" : "outline"} className="h-7 text-xs gap-1.5" onClick={() => onPreview(draft.content)}>
                        <Eye className="w-3 h-3" />
                        Preview
                    </Button>

                    {!draft.isAccepted && (
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" onClick={handleAccept} disabled={isPending}>
                            <CheckCircle2 className="w-3 h-3" />
                            {isPending ? "Accepting…" : "Accept Draft"}
                        </Button>
                    )}

                    <span className="text-xs text-muted-foreground ml-auto">
                        Type to refine →
                    </span>
                </div>

                {contextSources && contextSources.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border/50">
                        {contextSources.map((source) => (
                            <div key={source} className="flex items-center gap-1 text-xs text-muted-foreground">
                                {SOURCE_ICONS[source] ?? <CheckCircle2 className="w-3 h-3" />}
                                {source}
                            </div>
                        ))}
                    </div>
                )}

                {/* Perplexity-style source row */}
                {visibleRefs.length > 0 && (
                    <div className="pt-1.5 border-t border-border/50 space-y-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {visibleRefs.map((ref, i) => (
                                <SourceChip key={i} ref={ref} index={i} />
                            ))}
                            {hiddenCount > 0 && (
                                <button
                                    onClick={() => setSourcesOpen(true)}
                                    className="inline-flex items-center gap-1 text-xs border border-dashed border-border rounded-lg px-2 py-1 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                                >
                                    +{hiddenCount} more
                                </button>
                            )}
                            <button
                                onClick={() => setSourcesOpen(true)}
                                className="text-xs text-muted-foreground hover:text-primary transition-colors ml-auto flex items-center gap-1"
                            >
                                <BookOpen className="w-3 h-3" />
                                View sources
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {resources && resources.length > 0 && (
                <SourcesModal resources={resources} open={sourcesOpen} onClose={() => setSourcesOpen(false)} />
            )}
        </>
    )
}
