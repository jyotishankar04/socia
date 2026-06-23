"use client"

import { useState } from "react"
import { MediaLibraryGrid } from "@/components/custom/media/media-library-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Wand2, Search, Heart, Images, Video, LayoutTemplate, LayoutGrid, Sparkles, Upload, FolderOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Tab {
    label: string
    icon: React.ComponentType<{ className?: string }>
    type?: string
    source?: string
    favorite?: boolean
}

const TABS: Tab[] = [
    { label: "All", icon: FolderOpen },
    { label: "Generated", icon: Sparkles, source: "GENERATED" },
    { label: "Uploaded", icon: Upload, source: "UPLOADED" },
    { label: "Images", icon: Images, type: "IMAGE" },
    { label: "Banners", icon: LayoutTemplate, type: "BANNER" },
    { label: "Carousels", icon: LayoutGrid, type: "CAROUSEL" },
    { label: "Videos", icon: Video, type: "VIDEO" },
    { label: "Favorites", icon: Heart, favorite: true },
]

export default function MediaPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState(0)
    const [q, setQ] = useState("")
    const [page, setPage] = useState(1)

    const tab = TABS[activeTab]

    const handleTabChange = (i: number) => {
        setActiveTab(i)
        setPage(1)
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background">
            {/* Header */}
            <div className="shrink-0 border-b border-border px-6 py-4 bg-background/95 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-lg font-semibold">Media Library</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">All your generated and uploaded assets</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={() => router.push("/app/studio/images/generate")}>
                            <Wand2 className="w-3.5 h-3.5" />
                            AI Studio
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-px">
                    {TABS.map((t, i) => (
                        <button
                            key={t.label}
                            onClick={() => handleTabChange(i)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0",
                                activeTab === i
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            <t.icon className="w-3.5 h-3.5" />
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="shrink-0 px-6 py-3 border-b border-border">
                <div className="relative max-w-sm">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                        placeholder={`Search ${tab.label.toLowerCase()}...`}
                        value={q}
                        onChange={e => { setQ(e.target.value); setPage(1) }}
                        className="pl-8 h-8 text-sm"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
                <MediaLibraryGrid
                    params={{
                        page,
                        limit: 24,
                        type: tab.type,
                        source: tab.source,
                        favorite: tab.favorite,
                        q: q || undefined,
                    }}
                    onPageChange={setPage}
                />
            </div>
        </div>
    )
}
