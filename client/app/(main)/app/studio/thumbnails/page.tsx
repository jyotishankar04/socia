"use client"

import { useState, useRef } from "react"
import { useGenerateThumbnailMutation, useUpdatePost } from "@/lib/query"
import { useImageStudio } from "@/store/use-image-studio"
import { StudioContextBanner } from "@/components/custom/studio/studio-context-banner"
import { AgentPipelineLoader } from "@/components/custom/studio/agent-pipeline-loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles, Download, Pencil, Paperclip, CheckCircle2, Library, Upload, X, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import type { MediaAsset } from "@/types"
import Image from "next/image"
import { cn } from "@/lib/utils"

const PLATFORMS = [
    { label: "YouTube", value: "youtube", desc: "1280×720" },
    { label: "Blog / OG", value: "blog", desc: "1200×630" },
    { label: "LinkedIn Article", value: "linkedin-article", desc: "1200×627" },
    { label: "Twitter / X", value: "twitter-post", desc: "1200×675" },
]

const STYLES = ["photorealistic", "cinematic", "illustrated", "minimal", "bold graphic", "flat design"]

export default function ThumbnailsPage() {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [title, setTitle] = useState("")
    const [context, setContext] = useState("")
    const [platform, setPlatform] = useState("youtube")
    const [style, setStyle] = useState("cinematic")
    const [result, setResult] = useState<MediaAsset | null>(null)
    const [attaching, setAttaching] = useState(false)
    const [referenceImage, setReferenceImage] = useState<string | null>(null)
    const [referencePreview, setReferencePreview] = useState<string | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)

    const { mutateAsync, isPending } = useGenerateThumbnailMutation()
    const { mutateAsync: updatePost } = useUpdatePost()
    const { pushHistory, context: studioCtx } = useImageStudio()
    const queryClient = useQueryClient()

    const loadReferenceFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file")
            return
        }
        const reader = new FileReader()
        reader.onload = (e) => {
            const src = e.target?.result as string
            setReferenceImage(src)
            setReferencePreview(src)
        }
        reader.readAsDataURL(file)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) loadReferenceFile(file)
    }

    const handleGenerate = async () => {
        if (!title.trim()) return
        const prompt = `${style} thumbnail for "${title}"${context ? `. Context: ${context}` : ""}. Platform: ${PLATFORMS.find(p => p.value === platform)?.label ?? platform}.`
        try {
            const res = await mutateAsync({
                prompt,
                platform,
                referenceImage: referenceImage ?? undefined,
            })
            setResult(res.data)
            queryClient.invalidateQueries({ queryKey: ["media-library"] })
            toast.success("Thumbnail generated and saved to library")
        } catch {
            toast.error("Failed to generate thumbnail")
        }
    }

    const handleEditInStudio = async () => {
        if (!result) return
        try {
            const res = await fetch(result.url)
            const blob = await res.blob()
            const reader = new FileReader()
            reader.onload = (e) => {
                pushHistory(e.target?.result as string)
                router.push("/app/studio/images/edit")
            }
            reader.readAsDataURL(blob)
        } catch {
            toast.error("Failed to load image for editing")
        }
    }

    const handleAttachToPost = async () => {
        if (!studioCtx?.chatId || !studioCtx?.draftId || !result) return
        setAttaching(true)
        try {
            await updatePost({
                conversationId: studioCtx.chatId,
                postId: studioCtx.draftId,
                data: {
                    media: [{ id: result.id, name: result.name, url: result.url, type: "image" as const, size: 0 }],
                },
            })
            toast.success("Thumbnail attached to post")
            queryClient.invalidateQueries({ queryKey: ["conversation", studioCtx.chatId] })
            router.push(`/app/editor/${studioCtx.chatId}`)
        } catch {
            toast.error("Failed to attach thumbnail")
        } finally {
            setAttaching(false)
        }
    }

    return (
        <div className="flex flex-col h-full overflow-hidden text-zinc-100">
            <div className="px-6 py-5 border-b border-zinc-800 shrink-0">
                <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-0.5">AI Studio</p>
                <h1 className="text-xl font-bold text-white">Thumbnail Generator</h1>
                <p className="text-sm text-zinc-400 mt-0.5">AI agent pipeline crafts scroll-stopping thumbnails optimised per platform</p>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                {/* Form */}
                <div className="w-full lg:w-96 shrink-0 border-r border-zinc-800 p-6 overflow-y-auto flex flex-col gap-5">
                    <StudioContextBanner />

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400">Platform</label>
                        <div className="grid grid-cols-2 gap-1.5">
                            {PLATFORMS.map(p => (
                                <button key={p.value} onClick={() => setPlatform(p.value)}
                                    className={`px-2 py-2.5 rounded-lg text-left border transition-all ${platform === p.value ? "border-primary bg-primary/10" : "border-zinc-700 hover:border-zinc-500"}`}>
                                    <p className={`text-xs font-semibold ${platform === p.value ? "text-primary" : "text-zinc-300"}`}>{p.label}</p>
                                    <p className="text-[10px] text-zinc-500 mt-0.5">{p.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400">Title / Headline</label>
                        <Input value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. '10 AI Tools That 10x Productivity'"
                            className="bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 text-sm h-9" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400">
                            Context <span className="text-zinc-600 font-normal">(optional)</span>
                        </label>
                        <Textarea value={context} onChange={e => setContext(e.target.value)}
                            placeholder="What is the content about? Any visual preferences?"
                            rows={2} className="resize-none bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 text-sm" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400">Visual Style</label>
                        <div className="flex flex-wrap gap-1.5">
                            {STYLES.map(s => (
                                <button key={s} onClick={() => setStyle(s)}
                                    className={`px-2.5 py-1 rounded-full text-[11px] border transition-all capitalize ${style === s ? "border-primary bg-primary/10 text-primary" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reference image upload */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-zinc-400">
                                Reference Image <span className="text-zinc-600 font-normal">(optional)</span>
                            </label>
                            {referencePreview && (
                                <button
                                    onClick={() => { setReferenceImage(null); setReferencePreview(null) }}
                                    className="text-[10px] text-zinc-500 hover:text-red-400 flex items-center gap-0.5 transition-colors"
                                >
                                    <X className="w-3 h-3" /> Remove
                                </button>
                            )}
                        </div>

                        {referencePreview ? (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-zinc-700">
                                <Image src={referencePreview} alt="Reference" fill className="object-cover" sizes="384px" />
                                <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                                    <span className="text-[10px] text-zinc-300 bg-black/60 px-1.5 py-0.5 rounded">Reference photo</span>
                                </div>
                            </div>
                        ) : (
                            <div
                                className={cn(
                                    "w-full border-2 border-dashed rounded-lg py-5 flex flex-col items-center gap-2 cursor-pointer transition-colors",
                                    isDragOver ? "border-primary bg-primary/5" : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/30"
                                )}
                                onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
                                onDragLeave={() => setIsDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={e => { const f = e.target.files?.[0]; if (f) loadReferenceFile(f) }}
                                />
                                <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                                    <ImageIcon className="w-4 h-4 text-zinc-500" />
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-zinc-400">Drop your photo or click to upload</p>
                                    <p className="text-[10px] text-zinc-600 mt-0.5">AI will incorporate it into the thumbnail</p>
                                </div>
                                <div className="flex items-center gap-1 text-zinc-600">
                                    <Upload className="w-3 h-3" />
                                    <span className="text-[10px]">PNG, JPG, WEBP</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <Button onClick={handleGenerate} disabled={isPending || !title.trim()} size="lg" className="w-full gap-2">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        {isPending ? "Running agents..." : "Generate Thumbnail"}
                    </Button>
                </div>

                {/* Preview / Pipeline */}
                <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center">
                    {isPending ? (
                        <AgentPipelineLoader type="thumbnail" />
                    ) : result ? (
                        <div className="w-full max-w-2xl space-y-4">
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-700 shadow-2xl">
                                <Image src={result.url} alt="Generated thumbnail" fill className="object-cover" sizes="768px" priority />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm"
                                    className="gap-1.5 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                                    onClick={() => { const a = document.createElement("a"); a.href = result.url; a.download = result.name; a.target = "_blank"; a.click() }}>
                                    <Download className="w-3.5 h-3.5" />
                                    Download
                                </Button>
                                <Button variant="outline" size="sm"
                                    className="gap-1.5 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                                    onClick={handleEditInStudio}>
                                    <Pencil className="w-3.5 h-3.5" />
                                    Edit in Studio
                                </Button>
                                <Button variant="outline" size="sm"
                                    className="gap-1.5 border-green-700/50 text-green-400 hover:text-green-300 hover:bg-zinc-800"
                                    onClick={() => router.push("/app/media")}>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Saved to Library
                                </Button>
                                {studioCtx?.chatId && studioCtx?.draftId && (
                                    <Button size="sm" className="gap-1.5" onClick={handleAttachToPost} disabled={attaching}>
                                        {attaching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Paperclip className="w-3.5 h-3.5" />}
                                        {attaching ? "Attaching..." : "Attach to Post"}
                                    </Button>
                                )}
                                {!studioCtx?.chatId && (
                                    <Button variant="outline" size="sm"
                                        className="gap-1.5 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                                        onClick={() => router.push("/app/media")}>
                                        <Library className="w-3.5 h-3.5" />
                                        View in Library
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                                <Sparkles className="w-7 h-7 text-zinc-500" />
                            </div>
                            <p className="text-sm font-medium text-zinc-400">Thumbnail will appear here</p>
                            <p className="text-xs text-zinc-600">4-step AI pipeline runs on every generation</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
