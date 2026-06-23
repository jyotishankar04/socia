"use client"

import { useImageStudio } from "@/store/use-image-studio"
import { Button } from "@/components/ui/button"
import { BookmarkPlus, Link2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useUpdatePost } from "@/lib/query"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function StudioRightSidebar() {
    const { history, historyIndex, image, context, isLoading, saveToLibrary } = useImageStudio()
    const { mutateAsync: updatePost } = useUpdatePost()
    const queryClient = useQueryClient()
    const router = useRouter()

    const handleSaveToLibrary = async () => {
        try {
            await saveToLibrary()
            toast.success("Saved to Media Library")
            queryClient.invalidateQueries({ queryKey: ["media-library"] })
        } catch {
            toast.error("Failed to save to library")
        }
    }

    const handleAttachToPost = async () => {
        if (!context?.chatId || !context?.draftId) return
        try {
            const asset = await saveToLibrary()
            await updatePost({
                conversationId: context.chatId,
                postId: context.draftId,
                data: {
                    media: [{ id: asset.id, name: asset.name, url: asset.url, type: "image", size: asset.size ?? 0, width: asset.width, height: asset.height }],
                },
            })
            queryClient.invalidateQueries({ queryKey: ["conversation", context.chatId] })
            toast.success("Image attached to post")
            router.push(`/app/editor/${context.chatId}`)
        } catch {
            toast.error("Failed to attach image")
        }
    }

    return (
        <div className="flex flex-col h-full bg-zinc-900 border-l border-zinc-800 w-44 shrink-0">
            <div className="p-3 border-b border-zinc-800">
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">History</p>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {history.length === 0 && (
                    <p className="text-[11px] text-zinc-600 text-center mt-4">No history yet</p>
                )}
                {[...history].reverse().map((src, i) => {
                    const idx = history.length - 1 - i
                    return (
                        <button
                            key={idx}
                            className={cn(
                                "w-full aspect-square rounded-lg overflow-hidden border-2 transition-colors relative",
                                historyIndex === idx ? "border-primary" : "border-zinc-700 hover:border-zinc-500"
                            )}
                            onClick={() => useImageStudio.setState({ historyIndex: idx, image: history[idx] })}
                        >
                            <Image src={src} alt={`History ${idx + 1}`} fill className="object-cover" sizes="120px" />
                        </button>
                    )
                })}
            </div>
            <div className="p-3 space-y-2 border-t border-zinc-800">
                <Button
                    size="sm"
                    className="w-full gap-1.5 text-xs"
                    onClick={handleSaveToLibrary}
                    disabled={!image || isLoading}
                >
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                    Save to Library
                </Button>
                {context?.draftId && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-1.5 text-xs border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800"
                        onClick={handleAttachToPost}
                        disabled={!image || isLoading}
                    >
                        <Link2 className="w-3.5 h-3.5" />
                        Attach to Post
                    </Button>
                )}
            </div>
        </div>
    )
}
