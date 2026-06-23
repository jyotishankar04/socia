"use client"

import { useState } from "react"
import { useGenerateBannerMutation } from "@/lib/query"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Download, BookmarkPlus } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import type { MediaAsset } from "@/types"
import Image from "next/image"

const BANNER_TYPES = ["social", "linkedin-header", "twitter-header", "youtube-thumbnail", "website-hero"]
const STYLES = ["professional", "creative", "minimal", "bold", "elegant", "playful"]

export function BannerGenerator() {
    const [prompt, setPrompt] = useState("")
    const [bannerType, setBannerType] = useState("social")
    const [style, setStyle] = useState("professional")
    const [result, setResult] = useState<MediaAsset | null>(null)
    const { mutateAsync, isPending } = useGenerateBannerMutation()
    const queryClient = useQueryClient()

    const handleGenerate = async () => {
        if (!prompt) return
        try {
            const res = await mutateAsync({ prompt, bannerType, style })
            setResult(res.data)
            queryClient.invalidateQueries({ queryKey: ["media-library"] })
        } catch {
            toast.error("Failed to generate banner")
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 p-6">
            <div>
                <h2 className="text-lg font-semibold mb-1">Banner Generator</h2>
                <p className="text-sm text-muted-foreground">Generate professional banners for social media and websites.</p>
            </div>
            <div className="space-y-3">
                <Textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Describe your banner (e.g. 'Modern tech startup banner with abstract geometric shapes and blue gradient')"
                    rows={3}
                    className="resize-none"
                />
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Banner Type</label>
                        <Select value={bannerType} onValueChange={setBannerType}>
                            <SelectTrigger className="h-9 text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {BANNER_TYPES.map(t => (
                                    <SelectItem key={t} value={t} className="text-sm capitalize">{t.replace(/-/g, " ")}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Style</label>
                        <Select value={style} onValueChange={setStyle}>
                            <SelectTrigger className="h-9 text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {STYLES.map(s => (
                                    <SelectItem key={s} value={s} className="text-sm capitalize">{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button className="w-full gap-1.5" onClick={handleGenerate} disabled={isPending || !prompt}>
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {isPending ? "Generating..." : "Generate Banner"}
                </Button>
            </div>
            {result && (
                <div className="space-y-3">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border">
                        <Image src={result.url} alt="Generated banner" fill className="object-cover" sizes="672px" />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => { const a = document.createElement("a"); a.href = result.url; a.download = result.name; a.target = "_blank"; a.click() }}
                        >
                            <Download className="w-3.5 h-3.5" />
                            Download
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Saved to library")}>
                            <BookmarkPlus className="w-3.5 h-3.5" />
                            Saved to Library
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
