"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Upload, X, Film, Loader2, Pencil } from "lucide-react"
import { useMediaAuth } from "@/lib/query"
import { toast } from "sonner"
import type { MediaItem } from "@/types"

interface MediaUploadProps {
    media: MediaItem[]
    onMediaChange: (media: MediaItem[]) => void
    onEditImage?: (item: MediaItem) => void
    className?: string
}

export function MediaUpload({ media, onMediaChange, onEditImage, className }: MediaUploadProps) {
    const [uploading, setUploading] = useState(false)
    const { data: authData } = useMediaAuth()

    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files?.length || !authData?.data) return

        const auth = authData.data
        setUploading(true)

        const newMedia: MediaItem[] = []

        for (const file of Array.from(files)) {
            if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
                toast.error(`${file.name}: Only images and videos are supported`)
                continue
            }

            const formData = new FormData()
            formData.append("file", file)
            formData.append("publicKey", auth.publicKey)
            formData.append("signature", auth.signature)
            formData.append("expire", String(auth.expire))
            formData.append("token", auth.token)
            formData.append("fileName", file.name)
            formData.append("folder", "/socia-posts")

            try {
                const res = await fetch("https://upload.imagekit.io/api/v2/files/upload", {
                    method: "POST",
                    body: formData,
                })
                const result = await res.json()
                if (result.url) {
                    newMedia.push({
                        id: result.fileId || crypto.randomUUID(),
                        name: result.name || file.name,
                        url: result.url,
                        type: file.type.startsWith("video/") ? "video" : "image",
                        size: result.size || file.size,
                        width: result.width,
                        height: result.height,
                    })
                } else {
                    toast.error(`Failed to upload ${file.name}: ${result.message ?? "Unknown error"}`)
                }
            } catch {
                toast.error(`Failed to upload ${file.name}`)
            }
        }

        if (newMedia.length > 0) {
            onMediaChange([...media, ...newMedia])
            toast.success(`${newMedia.length} file${newMedia.length > 1 ? "s" : ""} uploaded`)
        }

        setUploading(false)
        e.target.value = ""
    }, [authData, media, onMediaChange])

    const removeMedia = (id: string) => {
        onMediaChange(media.filter((m) => m.id !== id))
    }

    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-foreground">Media</p>
                <span className="text-xs text-muted-foreground">{media.length} item{media.length !== 1 ? "s" : ""}</span>
            </div>

            {media.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                    {media.map((item) => (
                        <div key={item.id} className="relative group rounded-lg overflow-hidden border border-border bg-muted">
                            {item.type === "image" ? (
                                <img src={item.url} alt={item.name} className="w-full h-24 object-cover" />
                            ) : (
                                <div className="w-full h-24 flex items-center justify-center bg-black/20">
                                    <Film className="w-8 h-8 text-muted-foreground" />
                                </div>
                            )}
                            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.type === "image" && onEditImage && (
                                    <button
                                        onClick={() => onEditImage(item)}
                                        className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                                    >
                                        <Pencil className="w-2.5 h-2.5" />
                                    </button>
                                )}
                                <button
                                    onClick={() => removeMedia(item.id)}
                                    className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                            <p className="text-[10px] text-muted-foreground truncate px-1.5 py-1">{item.name}</p>
                        </div>
                    ))}
                </div>
            )}

            <label>
                <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="hidden"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 text-xs h-8"
                    disabled={uploading}
                    asChild
                >
                    <span>
                        {uploading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Upload className="w-3.5 h-3.5" />
                        )}
                        {uploading ? "Uploading..." : "Upload images or videos"}
                    </span>
                </Button>
            </label>
        </div>
    )
}
