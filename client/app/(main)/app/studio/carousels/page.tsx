"use client"

import { useState } from "react"
import { useGenerateCarouselMutation, useUpdatePost } from "@/lib/query"
import { StudioContextBanner } from "@/components/custom/studio/studio-context-banner"
import { useImageStudio } from "@/store/use-image-studio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ChevronLeft, ChevronRight, Sparkles, Save, Layers, Paperclip, CheckCircle2 } from "lucide-react"
import { AgentPipelineLoader } from "@/components/custom/studio/agent-pipeline-loader"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import type { CarouselSlide, MediaAsset } from "@/types"
import Image from "next/image"

const CAROUSEL_TYPES = [
    { label: "LinkedIn Carousel", value: "linkedin" },
    { label: "Instagram Carousel", value: "instagram" },
    { label: "Educational Slides", value: "educational" },
    { label: "Product Showcase", value: "product" },
]

const TONES = ["professional", "casual", "educational", "inspirational", "humorous"]
const AUDIENCES = ["general", "business", "developers", "marketers", "students", "executives"]

export default function CarouselsPage() {
    const [topic, setTopic] = useState("")
    const [slideCount, setSlideCount] = useState("5")
    const [audience, setAudience] = useState("general")
    const [tone, setTone] = useState("professional")
    const [carouselType, setCarouselType] = useState("linkedin")
    const [slides, setSlides] = useState<CarouselSlide[]>([])
    const [savedAsset, setSavedAsset] = useState<MediaAsset | null>(null)
    const [savedSlides, setSavedSlides] = useState<Set<number>>(new Set())
    const [currentSlide, setCurrentSlide] = useState(0)
    const [attaching, setAttaching] = useState(false)
    const { mutateAsync, isPending } = useGenerateCarouselMutation()
    const { mutateAsync: updatePost } = useUpdatePost()
    const { context } = useImageStudio()
    const queryClient = useQueryClient()
    const router = useRouter()

    const handleGenerate = async () => {
        if (!topic) return
        try {
            const res = await mutateAsync({ topic, slideCount: Number(slideCount), audience, tone })
            setSlides(res.data.slides)
            setSavedAsset(res.data.asset)
            setSavedSlides(new Set())
            setCurrentSlide(0)
            queryClient.invalidateQueries({ queryKey: ["media-library"] })
            toast.success(`${res.data.slides.length} slides generated`)
        } catch {
            toast.error("Failed to generate carousel")
        }
    }

    const handleSaveCurrent = () => {
        if (!slides[currentSlide]) return
        setSavedSlides(prev => new Set(prev).add(currentSlide))
        toast.success(`Slide ${currentSlide + 1} saved to Media Library`)
    }

    const handleSaveAll = () => {
        if (!slides.length) return
        setSavedSlides(new Set(slides.map((_, i) => i)))
        toast.success(`All ${slides.length} slides saved to Media Library`)
    }

    const handleAttachToPost = async () => {
        if (!context?.chatId || !context?.draftId || !savedAsset) return
        setAttaching(true)
        try {
            const indicesToAttach = savedSlides.size > 0 ? [...savedSlides] : slides.map((_, i) => i)
            const mediaItems = indicesToAttach
                .map(i => slides[i])
                .filter(s => s?.imageUrl)
                .map(s => ({ id: s.assetId, name: `Slide ${s.slide}`, url: s.imageUrl, type: "image" as const, size: 0 }))
            await updatePost({
                conversationId: context.chatId,
                postId: context.draftId,
                data: { media: mediaItems },
            })
            toast.success("Carousel attached to post")
            queryClient.invalidateQueries({ queryKey: ["conversation", context.chatId] })
            router.push(`/app/editor/${context.chatId}`)
        } catch {
            toast.error("Failed to attach carousel to post")
        } finally {
            setAttaching(false)
        }
    }

    const slide = slides[currentSlide]
    const allSaved = slides.length > 0 && savedSlides.size === slides.length
    const currentSaved = savedSlides.has(currentSlide)

    return (
        <div className="flex flex-col h-full overflow-hidden text-zinc-100">
            <div className="px-6 py-5 border-b border-zinc-800 shrink-0">
                <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-0.5">AI Studio</p>
                <h1 className="text-xl font-bold text-white">Carousel Generator</h1>
                <p className="text-sm text-zinc-400 mt-0.5">Generate multi-slide carousels for LinkedIn, Instagram, and more</p>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                {/* Form */}
                <div className="w-full lg:w-96 shrink-0 border-r border-zinc-800 p-6 overflow-y-auto flex flex-col gap-5">
                    <StudioContextBanner />

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400">Carousel Type</label>
                        <div className="grid grid-cols-2 gap-1.5">
                            {CAROUSEL_TYPES.map(t => (
                                <button key={t.value} onClick={() => setCarouselType(t.value)}
                                    className={`px-2 py-2 rounded-lg text-xs border text-left transition-all ${carouselType === t.value ? "border-primary bg-primary/10 text-primary" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400">Topic</label>
                        <Textarea
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            placeholder="e.g. '5 ways AI is transforming content marketing in 2025'"
                            rows={3}
                            className="resize-none bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-400">Slides</label>
                            <Input type="number" min={3} max={10} value={slideCount} onChange={e => setSlideCount(e.target.value)}
                                className="bg-zinc-800/60 border-zinc-700 text-zinc-300 h-9 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-400">Audience</label>
                            <Select value={audience} onValueChange={setAudience}>
                                <SelectTrigger className="bg-zinc-800/60 border-zinc-700 text-zinc-300 h-9 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-200">
                                    {AUDIENCES.map(a => <SelectItem key={a} value={a} className="text-xs capitalize">{a}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-400">Tone</label>
                            <Select value={tone} onValueChange={setTone}>
                                <SelectTrigger className="bg-zinc-800/60 border-zinc-700 text-zinc-300 h-9 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-200">
                                    {TONES.map(t => <SelectItem key={t} value={t} className="text-xs capitalize">{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button onClick={handleGenerate} disabled={isPending || !topic} size="lg" className="w-full gap-2">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        {isPending ? "Generating slides..." : "Generate Carousel"}
                    </Button>
                </div>

                {/* Preview */}
                <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center">
                    {isPending ? (
                        <AgentPipelineLoader type="carousel" />
                    ) : slides.length > 0 && slide ? (
                        <div className="max-w-lg mx-auto space-y-4">
                            {/* Navigation header */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-zinc-500">
                                    Slide {currentSlide + 1} of {slides.length}
                                    {savedSlides.size > 0 && (
                                        <span className="ml-2 text-green-400">· {savedSlides.size} saved</span>
                                    )}
                                </span>
                                <div className="flex gap-1">
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                                        disabled={currentSlide === 0} onClick={() => setCurrentSlide(i => i - 1)}>
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                                        disabled={currentSlide === slides.length - 1} onClick={() => setCurrentSlide(i => i + 1)}>
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Slide card — full Canva-style layout */}
                            <div
                                className="rounded-xl overflow-hidden shadow-2xl relative"
                                style={{ aspectRatio: "4/5", background: slide.style?.bgColor ?? "#1E1E1E" }}
                            >
                                {slide.imageUrl ? (
                                    <Image src={slide.imageUrl} alt={slide.title} fill className="object-cover" sizes="512px" priority />
                                ) : (
                                    <div className="absolute inset-0" style={{ background: slide.style?.bgColor ?? "#1E1E1E" }} />
                                )}

                                {/* Slide number badge */}
                                <div
                                    className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center font-black text-base z-10"
                                    style={{
                                        background: slide.style?.accentColor ?? "#CCFF00",
                                        color: slide.style?.presetName === "cream_orange" || slide.style?.presetName === "orange_bold" ? "#1A1A1A" : slide.style?.accentColor === "#FFFFFF" ? "#1A1A1A" : "#1A1A1A",
                                        borderRadius: slide.style?.badgeStyle === "circle" ? "9999px" : slide.style?.badgeStyle === "pill" ? "9999px" : "4px",
                                    }}
                                >
                                    {String(slide.slide).padStart(2, "0")}
                                </div>

                                {/* Swipe indicator top-right */}
                                <div className="absolute top-4 right-4 z-10 flex items-center gap-0.5" style={{ color: slide.style?.accentColor ?? "#CCFF00" }}>
                                    <span className="text-[10px] font-semibold uppercase tracking-widest opacity-80">Swipe</span>
                                    <ChevronRight className="w-3 h-3" />
                                    <ChevronRight className="w-3 h-3 -ml-1.5" />
                                </div>

                                {/* Title overlay — top section */}
                                <div className="absolute left-0 right-0 px-5 z-10" style={{ top: "18%" }}>
                                    <p
                                        className="font-black text-2xl leading-tight uppercase tracking-tight drop-shadow-lg"
                                        style={{ color: slide.style?.textColor ?? "#FFFFFF" }}
                                    >
                                        {slide.title}
                                    </p>
                                </div>

                                {/* Body text — bottom gradient overlay */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 px-5 py-5 z-10"
                                    style={{
                                        background: `linear-gradient(to top, ${slide.style?.bgColor ?? "#1E1E1E"}EE 60%, transparent)`,
                                    }}
                                >
                                    <p
                                        className="text-xs leading-relaxed font-medium"
                                        style={{ color: slide.style?.textColor ?? "#FFFFFF", opacity: 0.9 }}
                                    >
                                        {slide.body}
                                    </p>
                                </div>

                                {/* Saved badge */}
                                {currentSaved && (
                                    <div className="absolute top-2 right-12 bg-green-500/90 backdrop-blur-sm rounded-full p-1 z-20">
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-1.5 overflow-x-auto py-1">
                                {slides.map((s, i) => (
                                    <button key={i} onClick={() => setCurrentSlide(i)}
                                        className="relative shrink-0 w-12 h-16 rounded-lg overflow-hidden transition-all"
                                        style={{
                                            border: `2px solid ${i === currentSlide ? (s.style?.accentColor ?? "#a855f7") : "#3f3f46"}`,
                                            background: s.style?.bgColor ?? "#1E1E1E",
                                        }}>
                                        {s.imageUrl
                                            ? <Image src={s.imageUrl} alt={`Slide ${i + 1}`} width={48} height={64} className="object-cover w-full h-full" />
                                            : <div className="w-full h-full flex items-center justify-center text-[10px]" style={{ color: s.style?.accentColor ?? "#CCFF00" }}>{i + 1}</div>
                                        }
                                        {savedSlides.has(i) && (
                                            <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-green-300" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Save actions */}
                            <div className="flex flex-wrap gap-2 pt-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`gap-1.5 border-zinc-700 hover:bg-zinc-800 transition-colors ${currentSaved ? "text-green-400 border-green-700/50 hover:text-green-300" : "text-zinc-300 hover:text-white"}`}
                                    onClick={handleSaveCurrent}
                                    disabled={currentSaved}
                                >
                                    {currentSaved
                                        ? <CheckCircle2 className="w-3.5 h-3.5" />
                                        : <Save className="w-3.5 h-3.5" />
                                    }
                                    {currentSaved ? "Slide Saved" : "Save Slide"}
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`gap-1.5 border-zinc-700 hover:bg-zinc-800 transition-colors ${allSaved ? "text-green-400 border-green-700/50 hover:text-green-300" : "text-zinc-300 hover:text-white"}`}
                                    onClick={handleSaveAll}
                                    disabled={allSaved}
                                >
                                    {allSaved
                                        ? <CheckCircle2 className="w-3.5 h-3.5" />
                                        : <Layers className="w-3.5 h-3.5" />
                                    }
                                    {allSaved ? "All Saved" : "Save All"}
                                </Button>

                                {context?.chatId && context?.draftId && (
                                    <Button
                                        size="sm"
                                        className="gap-1.5 ml-auto"
                                        onClick={handleAttachToPost}
                                        disabled={attaching}
                                    >
                                        {attaching
                                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            : <Paperclip className="w-3.5 h-3.5" />
                                        }
                                        {attaching ? "Attaching..." : `Attach${savedSlides.size > 0 ? ` (${savedSlides.size})` : " All"} to Post`}
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : !isPending ? (
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                                <Sparkles className="w-7 h-7 text-zinc-500" />
                            </div>
                            <p className="text-sm font-medium text-zinc-400">Slides will appear here</p>
                            <p className="text-xs text-zinc-600">6-step AI pipeline: style selection → slide planning → prompt building → generation</p>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
