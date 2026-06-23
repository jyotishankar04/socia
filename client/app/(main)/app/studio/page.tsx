"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useImageStudio } from "@/store/use-image-studio"
import { useMediaLibraryQuery } from "@/lib/query"
import { StudioContextBanner } from "@/components/custom/studio/studio-context-banner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    ImageIcon,
    Video,
    LayoutTemplate,
    LayoutGrid,
    Crop,
    Palette,
    Sparkles,
    ArrowRight,
    Wand2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { MediaAsset } from "@/types"
import { cn } from "@/lib/utils"

const QUICK_TOOLS = [
    { label: "Image", description: "Text to Image", href: "/app/studio/images/generate", icon: ImageIcon, color: "from-blue-500/20 to-blue-600/5" },
    { label: "Video", description: "Coming Soon", href: "/app/studio/video", icon: Video, color: "from-purple-500/20 to-purple-600/5", soon: true },
    { label: "Banner", description: "Social Banners", href: "/app/studio/banners", icon: LayoutTemplate, color: "from-orange-500/20 to-orange-600/5" },
    { label: "Carousel", description: "Slide Decks", href: "/app/studio/carousels", icon: LayoutGrid, color: "from-green-500/20 to-green-600/5" },
    { label: "Thumbnail", description: "Blog & YouTube", href: "/app/studio/thumbnails", icon: Crop, color: "from-pink-500/20 to-pink-600/5" },
    { label: "Brand Kit", description: "Your Assets", href: "/app/studio/brand-kit", icon: Palette, color: "from-yellow-500/20 to-yellow-600/5" },
]

const FEATURED_STYLES = [
    { label: "Cinematic", prompt: "Cinematic film still, dramatic lighting, shallow depth of field" },
    { label: "Minimalist", prompt: "Minimal clean product shot on white background, studio lighting" },
    { label: "Vibrant", prompt: "Vibrant colorful abstract art, bold geometric shapes" },
    { label: "Professional", prompt: "Professional corporate photography, confident pose, neutral background" },
    { label: "Neon", prompt: "Neon cyberpunk cityscape at night, rain reflections, glowing signs" },
    { label: "Watercolor", prompt: "Soft watercolor illustration, pastel palette, artistic brushstrokes" },
]

export default function StudioPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const hasContext = !!searchParams.get("chatId")
    const [prompt, setPrompt] = useState("")
    const { generateNewImage, isLoading } = useImageStudio()

    const { data: libraryData } = useMediaLibraryQuery({ limit: 8 })
    const recentAssets: MediaAsset[] = libraryData?.data?.items ?? []

    const handleGenerate = async () => {
        if (!prompt.trim()) return
        await generateNewImage(prompt)
        router.push("/app/studio/images/edit")
    }

    const handleStyleClick = (stylePrompt: string) => {
        setPrompt(stylePrompt)
        router.push("/app/studio/images/generate")
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto text-zinc-100">
            {/* Hero */}
            <div className="relative flex flex-col items-center justify-center min-h-[320px] px-8 py-12 overflow-hidden">
                {/* mesh gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
                <div className="absolute inset-0 opacity-40" style={{
                    background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.25) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 100%, rgba(236,72,153,0.15) 0%, transparent 70%)"
                }} />

                <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-2xl">
                    {hasContext && <StudioContextBanner />}
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                            Create with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-400">AI</span>
                        </h1>
                        <p className="text-zinc-400 text-sm">Generate images, banners, carousels, and more</p>
                    </div>

                    {/* Prompt bar */}
                    <div className="flex w-full gap-2 bg-zinc-800/80 backdrop-blur border border-zinc-700 rounded-xl p-1.5">
                        <div className="flex items-center pl-2 text-zinc-400">
                            <Wand2 className="w-4 h-4" />
                        </div>
                        <Input
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder="Describe what you want to create..."
                            className="flex-1 border-0 bg-transparent text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-0 text-sm h-9"
                            onKeyDown={e => e.key === "Enter" && handleGenerate()}
                        />
                        <Button
                            onClick={handleGenerate}
                            disabled={!prompt.trim() || isLoading}
                            className="h-9 px-4 gap-1.5 rounded-lg"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Generate
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick tools */}
            <div className="px-6 py-6 border-t border-zinc-800/60">
                <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Tools</h2>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {QUICK_TOOLS.map(tool => (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className={cn(
                                "relative flex flex-col items-center gap-2 p-4 rounded-xl border border-zinc-800 bg-gradient-to-b hover:border-zinc-600 transition-all group",
                                tool.color
                            )}
                        >
                            {tool.soon && (
                                <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-700 text-zinc-400">SOON</span>
                            )}
                            <tool.icon className="w-6 h-6 text-zinc-300 group-hover:text-white transition-colors" />
                            <div className="text-center">
                                <p className="text-xs font-semibold text-zinc-200">{tool.label}</p>
                                <p className="text-[10px] text-zinc-500">{tool.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Trending styles */}
            <div className="px-6 py-4 border-t border-zinc-800/60">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Try a Style</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                    {FEATURED_STYLES.map(style => (
                        <button
                            key={style.label}
                            onClick={() => handleStyleClick(style.prompt)}
                            className="px-3 py-1.5 text-xs rounded-full border border-zinc-700 text-zinc-400 hover:border-primary/50 hover:text-zinc-200 hover:bg-primary/5 transition-all"
                        >
                            {style.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent generations */}
            {recentAssets.length > 0 && (
                <div className="px-6 py-4 border-t border-zinc-800/60 pb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Recent</h2>
                        <Link href="/app/media" className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors">
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {recentAssets.map((asset: MediaAsset) => (
                            <Link
                                key={asset.id}
                                href="/app/studio/images/edit"
                                className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-colors group"
                            >
                                <Image src={asset.url} alt={asset.name} fill className="object-cover group-hover:scale-105 transition-transform" sizes="120px" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
