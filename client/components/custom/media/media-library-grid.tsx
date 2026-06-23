"use client"

import { useMediaLibraryQuery } from "@/lib/query"
import { MediaAssetCard } from "./media-asset-card"
import { Button } from "@/components/ui/button"
import { Images, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import type { MediaAsset } from "@/types"

interface Props {
    params: { page: number; limit: number; type?: string; source?: string; favorite?: boolean; q?: string }
    onPageChange: (page: number) => void
    onUseInPost?: (asset: MediaAsset) => void
}

export function MediaLibraryGrid({ params, onPageChange, onUseInPost }: Props) {
    const { data, isLoading } = useMediaLibraryQuery(params)
    const result = data?.data

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!result?.items?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-4">
                    <Images className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">No assets yet</p>
                <p className="text-xs text-muted-foreground">Generate or upload your first image to get started.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {result.items.map((asset: MediaAsset) => (
                    <MediaAssetCard key={asset.id} asset={asset} onUseInPost={onUseInPost} />
                ))}
            </div>
            {result.pages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={params.page <= 1}
                        onClick={() => onPageChange(params.page - 1)}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground">
                        Page {result.page} of {result.pages}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={params.page >= result.pages}
                        onClick={() => onPageChange(params.page + 1)}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}
