"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useImageStudio } from "@/store/use-image-studio"
import { StudioContextBanner } from "@/components/custom/studio/studio-context-banner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles, ArrowRight } from "lucide-react"
import { AgentPipelineLoader } from "@/components/custom/studio/agent-pipeline-loader"
import { toast } from "sonner"

const SIZES = [
    { label: "Square 1:1 (1024×1024)", value: "1024x1024" },
    { label: "Landscape 3:2 (1536×1024)", value: "1536x1024" },
    { label: "Portrait 2:3 (1024×1536)", value: "1024x1536" },
]

const QUALITY = [
    { label: "Low — fastest, cheapest", value: "low" },
    { label: "Medium — balanced (default)", value: "medium" },
    { label: "High — best quality", value: "high" },
]

const PROMPT_TEMPLATES = [
    "Professional LinkedIn profile banner for a software engineer",
    "Minimalist product announcement graphic for a SaaS launch",
    "Vibrant social media post graphic about AI technology",
    "Clean infographic-style background with geometric shapes",
    "Cinematic hero image for a marketing campaign",
]

export default function ImageGeneratePage() {
    const router = useRouter()
    const { generateNewImage, isLoading } = useImageStudio()
    const [prompt, setPrompt] = useState("")
    const [size, setSize] = useState("1024x1024")
    const [quality, setQuality] = useState("medium")

    const handleGenerate = async () => {
        if (!prompt.trim()) return
        try {
            await generateNewImage(prompt, size, quality)
            toast.success("Image generated")
            router.push("/app/studio/images/edit")
        } catch {
            toast.error("Failed to generate image")
        }
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto text-zinc-100">
            <div className="px-6 py-5 border-b border-zinc-800">
                <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-0.5">AI Studio</p>
                <h1 className="text-xl font-bold text-white">Image Generation</h1>
                <p className="text-sm text-zinc-400 mt-0.5">Turn text into stunning visuals using gpt-image-1</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-0 flex-1 overflow-hidden">
                {/* Left — form */}
                <div className="w-full lg:w-96 shrink-0 border-r border-zinc-800 p-6 overflow-y-auto flex flex-col gap-5">
                    <StudioContextBanner />

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400">Prompt</label>
                        <Textarea
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder="Describe the image you want to create..."
                            rows={5}
                            className="resize-none bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-400">Size</label>
                            <Select value={size} onValueChange={setSize}>
                                <SelectTrigger className="bg-zinc-800/60 border-zinc-700 text-zinc-300 text-xs h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-200">
                                    {SIZES.map(s => <SelectItem key={s.value} value={s.value} className="text-xs">{s.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-400">Quality</label>
                            <Select value={quality} onValueChange={setQuality}>
                                <SelectTrigger className="bg-zinc-800/60 border-zinc-700 text-zinc-300 text-xs h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-200">
                                    {QUALITY.map(q => <SelectItem key={q.value} value={q.value} className="text-xs">{q.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || isLoading}
                        className="w-full gap-2"
                        size="lg"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        {isLoading ? "Generating..." : "Generate Image"}
                    </Button>
                </div>

                {/* Right — pipeline / templates */}
                <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
                    {isLoading ? (
                        <AgentPipelineLoader type="image" />
                    ) : (
                        <>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Prompt Inspiration</p>
                            <div className="grid gap-2">
                                {PROMPT_TEMPLATES.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setPrompt(t)}
                                        className="text-left px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-800/60 transition-all group"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">{t}</span>
                                            <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 shrink-0 transition-colors" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
