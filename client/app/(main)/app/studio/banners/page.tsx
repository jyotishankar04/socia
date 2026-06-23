"use client"

import { useState } from "react"
import { useGenerateBannerMutation, useUpdatePost } from "@/lib/query"
import { useImageStudio } from "@/store/use-image-studio"
import { StudioContextBanner } from "@/components/custom/studio/studio-context-banner"
import { AgentPipelineLoader } from "@/components/custom/studio/agent-pipeline-loader"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Download, Sparkles, CheckCircle2, Library, Paperclip } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import type { MediaAsset } from "@/types"
import Image from "next/image"

const BANNER_TYPES = [
    { label: "LinkedIn Header", value: "linkedin-header" },
    { label: "Twitter / X Banner", value: "twitter-header" },
    { label: "Social Post Banner", value: "social" },
    { label: "Product Launch", value: "product-launch" },
    { label: "Marketing Banner", value: "marketing" },
    { label: "Announcement", value: "announcement" },
    { label: "SaaS Hero", value: "saas-hero" },
]

const STYLES = [
    { label: "Professional", value: "professional" },
    { label: "Creative", value: "creative" },
    { label: "Minimal", value: "minimal" },
    { label: "Bold", value: "bold" },
    { label: "Elegant", value: "elegant" },
    { label: "Playful", value: "playful" },
]

export default function BannersPage() {
    const [prompt, setPrompt] = useState("")
    const [bannerType, setBannerType] = useState("linkedin-header")
    const [style, setStyle] = useState("professional")
    const [result, setResult] = useState<MediaAsset | null>(null)
    const [attaching, setAttaching] = useState(false)

    const { mutateAsync, isPending } = useGenerateBannerMutation()
    const { mutateAsync: updatePost } = useUpdatePost()
    const { context: studioCtx } = useImageStudio()
    const queryClient = useQueryClient()
    const router = useRouter()

    const handleGenerate = async () => {
        if (!prompt.trim()) return
        try {
            const res = await mutateAsync({ prompt, bannerType, style })
            setResult(res.data)
            queryClient.invalidateQueries({ queryKey: ["media-library"] })
            toast.success("Banner generated and saved to library")
        } catch {
            toast.error("Failed to generate banner")
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
            toast.success("Banner attached to post")
            queryClient.invalidateQueries({ queryKey: ["conversation", studioCtx.chatId] })
            router.push(`/app/editor/${studioCtx.chatId}`)
        } catch {
            toast.error("Failed to attach banner")
        } finally {
            setAttaching(false)
        }
    }

    return (
        <div className="flex flex-col h-full overflow-hidden text-zinc-100">
            <div className="px-6 py-5 border-b border-zinc-800 shrink-0">
                <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-0.5">AI Studio</p>
                <h1 className="text-xl font-bold text-white">Banner Generator</h1>
                <p className="text-sm text-zinc-400 mt-0.5">AI agent pipeline crafts professional banners with brand-aware composition</p>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                {/* Form */}
                <div className="w-full lg:w-96 shrink-0 border-r border-zinc-800 p-6 overflow-y-auto flex flex-col gap-5">
                    <StudioContextBanner />

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400">Banner Type</label>
                        <Select value={bannerType} onValueChange={setBannerType}>
                            <SelectTrigger className="bg-zinc-800/60 border-zinc-700 text-zinc-300 h-9 text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-200">
                                {BANNER_TYPES.map(t => <SelectItem key={t.value} value={t.value} className="text-sm">{t.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400">Style</label>
                        <div className="grid grid-cols-3 gap-1.5">
                            {STYLES.map(s => (
                                <button key={s.value} onClick={() => setStyle(s.value)}
                                    className={`px-2 py-1.5 rounded-lg text-xs border transition-all ${style === s.value ? "border-primary bg-primary/10 text-primary" : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"}`}>
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400">Description</label>
                        <Textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                            placeholder="Describe your banner (e.g. 'Futuristic SaaS product launch with gradient mesh and tech aesthetic')"
                            rows={4} className="resize-none bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 text-sm" />
                    </div>

                    <Button onClick={handleGenerate} disabled={isPending || !prompt.trim()} size="lg" className="w-full gap-2">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        {isPending ? "Running agents..." : "Generate Banner"}
                    </Button>
                </div>

                {/* Preview / Pipeline */}
                <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center">
                    {isPending ? (
                        <AgentPipelineLoader type="banner" />
                    ) : result ? (
                        <div className="w-full max-w-2xl space-y-4">
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-700 shadow-2xl">
                                <Image src={result.url} alt="Generated banner" fill className="object-cover" sizes="768px" priority />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm"
                                    className="gap-1.5 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                                    onClick={() => { const a = document.createElement("a"); a.href = result.url; a.download = result.name; a.target = "_blank"; a.click() }}>
                                    <Download className="w-3.5 h-3.5" />
                                    Download
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
                        <div className="flex flex-col items-center text-center gap-3 max-w-xs">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                                <Sparkles className="w-7 h-7 text-zinc-500" />
                            </div>
                            <p className="text-sm font-medium text-zinc-400">Your banner will appear here</p>
                            <p className="text-xs text-zinc-600">4-step AI pipeline: intent → composition → validation → generate</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
