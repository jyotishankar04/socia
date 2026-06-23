"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Heart, Sparkles, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MediaAssetType } from "@/types"

const TYPE_CHIPS: Array<{ label: string; value: MediaAssetType | "" }> = [
    { label: "All", value: "" },
    { label: "Images", value: "IMAGE" },
    { label: "Videos", value: "VIDEO" },
    { label: "Banners", value: "BANNER" },
    { label: "Carousels", value: "CAROUSEL" },
    { label: "Documents", value: "DOCUMENT" },
]

interface Props {
    q: string
    type: string
    source: string
    favorite: boolean
    onQChange: (v: string) => void
    onTypeChange: (v: string) => void
    onSourceChange: (v: string) => void
    onFavoriteChange: (v: boolean) => void
}

export function MediaLibraryFilters({ q, type, source, favorite, onQChange, onTypeChange, onSourceChange, onFavoriteChange }: Props) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                    placeholder="Search assets..."
                    value={q}
                    onChange={e => onQChange(e.target.value)}
                    className="pl-8 h-8 text-sm"
                />
            </div>
            <div className="flex gap-1 flex-wrap">
                {TYPE_CHIPS.map(chip => (
                    <Button
                        key={chip.value}
                        size="sm"
                        variant={type === chip.value ? "default" : "outline"}
                        className="h-7 text-xs px-2.5"
                        onClick={() => onTypeChange(chip.value)}
                    >
                        {chip.label}
                    </Button>
                ))}
            </div>
            <div className="flex gap-1">
                <Button
                    size="sm"
                    variant={source === "GENERATED" ? "default" : "outline"}
                    className="h-7 text-xs px-2.5 gap-1"
                    onClick={() => onSourceChange(source === "GENERATED" ? "" : "GENERATED")}
                >
                    <Sparkles className="w-3 h-3" /> AI
                </Button>
                <Button
                    size="sm"
                    variant={source === "UPLOADED" ? "default" : "outline"}
                    className="h-7 text-xs px-2.5 gap-1"
                    onClick={() => onSourceChange(source === "UPLOADED" ? "" : "UPLOADED")}
                >
                    <Upload className="w-3 h-3" /> Uploaded
                </Button>
                <Button
                    size="sm"
                    variant={favorite ? "default" : "outline"}
                    className={cn("h-7 text-xs px-2.5 gap-1", favorite && "text-red-500")}
                    onClick={() => onFavoriteChange(!favorite)}
                >
                    <Heart className={cn("w-3 h-3", favorite && "fill-red-500")} />
                </Button>
            </div>
        </div>
    )
}
