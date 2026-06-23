"use client"

import type { MediaAsset } from "@/types"
import { cn } from "@/lib/utils"
import { Heart, Trash2, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useQueryClient } from "@tanstack/react-query"
import { useDeleteAssetMutation, useToggleFavoriteMutation } from "@/lib/query"
import { toast } from "sonner"
import Image from "next/image"

interface Props {
    asset: MediaAsset
    onUseInPost?: (asset: MediaAsset) => void
}

export function MediaAssetCard({ asset, onUseInPost }: Props) {
    const queryClient = useQueryClient()
    const { mutateAsync: toggleFavorite } = useToggleFavoriteMutation()
    const { mutateAsync: deleteAsset } = useDeleteAssetMutation()

    const handleFavorite = async () => {
        try {
            await toggleFavorite(asset.id)
            queryClient.invalidateQueries({ queryKey: ["media-library"] })
        } catch {
            toast.error("Failed to update favorite")
        }
    }

    const handleDelete = async () => {
        try {
            await deleteAsset(asset.id)
            queryClient.invalidateQueries({ queryKey: ["media-library"] })
            toast.success("Asset deleted")
        } catch {
            toast.error("Failed to delete asset")
        }
    }

    const handleDownload = () => {
        const a = document.createElement("a")
        a.href = asset.url
        a.download = asset.name
        a.target = "_blank"
        a.click()
    }

    return (
        <div className="group relative rounded-xl overflow-hidden bg-muted aspect-square border border-border">
            <Image
                src={asset.url}
                alt={asset.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 20vw"
            />
            <div className={cn(
                "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2"
            )}>
                <div className="flex justify-end gap-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-white hover:text-white hover:bg-white/20"
                        onClick={handleFavorite}
                    >
                        <Heart className={cn("w-3.5 h-3.5", asset.isFavorite && "fill-red-500 text-red-500")} />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-white hover:text-white hover:bg-white/20"
                        onClick={handleDelete}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
                <div className="flex gap-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-white hover:text-white hover:bg-white/20"
                        onClick={handleDownload}
                        title="Download"
                    >
                        <Download className="w-3.5 h-3.5" />
                    </Button>
                    {onUseInPost && (
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-white hover:text-white hover:bg-white/20 gap-1"
                            onClick={() => onUseInPost(asset)}
                        >
                            <ExternalLink className="w-3 h-3" />
                            Use in Post
                        </Button>
                    )}
                </div>
            </div>
            <span className={cn(
                "absolute top-1.5 left-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                asset.source === "GENERATED" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
                {asset.source === "GENERATED" ? "AI" : "Upload"}
            </span>
        </div>
    )
}
