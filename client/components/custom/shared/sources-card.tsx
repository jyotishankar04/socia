"use client"

import { cn } from "@/lib/utils"
import { ChevronDown, ExternalLink, Globe, Link2, Search, TrendingUp, User, FileText } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"
import type { ResourceItem, SourceRef } from "@/types"

const iconMap: Record<ResourceItem["type"], React.ComponentType<{ className?: string }>> = {
    web: Globe,
    url: Link2,
    person: User,
    platform: TrendingUp,
    trend: Search,
}

const typeLabel: Record<ResourceItem["type"], string> = {
    web: "Web Search",
    url: "Website",
    person: "Profile",
    platform: "Platform",
    trend: "Trends",
}

function getDomain(url: string): string {
    try {
        return new URL(url).hostname.replace("www.", "")
    } catch {
        return url
    }
}

function SourceLink({ title, url, domain, iconType }: { title: string; url: string; domain: string; iconType?: ResourceItem["type"] }) {
    const Icon = iconType ? iconMap[iconType] : Globe
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-2 py-2 rounded-lg text-xs transition-colors group hover:bg-accent cursor-pointer"
        >
            <div className="w-6 h-6 rounded-md bg-background border border-border flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
                <Icon className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{title || domain}</p>
                <p className="text-muted-foreground text-[10px] mt-0.5 truncate">{domain}</p>
            </div>
            <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
    )
}

interface SourcesCardProps {
    resources: ResourceItem[]
    className?: string
}

export function SourcesCard({ resources, className }: SourcesCardProps) {
    const [open, setOpen] = useState(true)

    if (!resources.length) return null

    // Flatten: if a resource has refs, show each ref as an individual link.
    // Otherwise show the resource itself as a link if it has a URL.
    const links: { title: string; url: string; domain: string; iconType: ResourceItem["type"] }[] = []

    for (const resource of resources) {
        if (resource.refs && resource.refs.length > 0) {
            for (const ref of resource.refs) {
                links.push({
                    title: ref.title,
                    url: ref.url,
                    domain: ref.domain,
                    iconType: resource.type,
                })
            }
        } else if (resource.url) {
            links.push({
                title: resource.title,
                url: resource.url,
                domain: getDomain(resource.url),
                iconType: resource.type,
            })
        }
    }

    if (!links.length) return null

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <div className={cn("rounded-xl border border-border bg-muted/30 overflow-hidden mt-2", className)}>
                <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2.5 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-2 text-xs">
                        <FileText className="w-3.5 h-3.5 text-primary" />
                        <span className="font-medium text-foreground">Sources</span>
                        <span className="text-muted-foreground">· {links.length}</span>
                    </div>
                    <ChevronDown className={cn(
                        "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
                        open && "rotate-180"
                    )} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="border-t border-border px-2 py-1.5 max-h-64 overflow-y-auto">
                        {links.map((link, i) => (
                            <SourceLink key={i} {...link} />
                        ))}
                    </div>
                </CollapsibleContent>
            </div>
        </Collapsible>
    )
}
