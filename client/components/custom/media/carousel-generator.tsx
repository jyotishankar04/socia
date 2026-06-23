"use client"

import { useState } from "react"
import { useGenerateCarouselMutation } from "@/lib/query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import type { CarouselSlide } from "@/types"
import Image from "next/image"

const TONES = ["professional", "casual", "educational", "inspirational", "humorous"]
const AUDIENCES = ["general", "business", "developers", "marketers", "students", "executives"]

export function CarouselGenerator() {
    const [topic, setTopic] = useState("")
    const [slideCount, setSlideCount] = useState("5")
    const [audience, setAudience] = useState("general")
    const [tone, setTone] = useState("professional")
    const [slides, setSlides] = useState<CarouselSlide[]>([])
    const [currentSlide, setCurrentSlide] = useState(0)
    const { mutateAsync, isPending } = useGenerateCarouselMutation()
    const queryClient = useQueryClient()

    const handleGenerate = async () => {
        if (!topic) return
        try {
            const res = await mutateAsync({ topic, slideCount: Number(slideCount), audience, tone })
            setSlides(res.data.slides)
            setCurrentSlide(0)
            queryClient.invalidateQueries({ queryKey: ["media-library"] })
        } catch {
            toast.error("Failed to generate carousel")
        }
    }

    const slide = slides[currentSlide]

    return (
        <div className="max-w-2xl mx-auto space-y-6 p-6">
            <div>
                <h2 className="text-lg font-semibold mb-1">Carousel Generator</h2>
                <p className="text-sm text-muted-foreground">Generate multi-slide carousel posts for LinkedIn and Instagram.</p>
            </div>
            <div className="space-y-3">
                <Textarea
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="Topic (e.g. '5 ways AI is transforming content marketing')"
                    rows={2}
                    className="resize-none"
                />
                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Slides</label>
                        <Input
                            type="number"
                            min={3}
                            max={10}
                            value={slideCount}
                            onChange={e => setSlideCount(e.target.value)}
                            className="h-9 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Audience</label>
                        <Select value={audience} onValueChange={setAudience}>
                            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {AUDIENCES.map(a => (
                                    <SelectItem key={a} value={a} className="text-sm capitalize">{a}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Tone</label>
                        <Select value={tone} onValueChange={setTone}>
                            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {TONES.map(t => (
                                    <SelectItem key={t} value={t} className="text-sm capitalize">{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button className="w-full gap-1.5" onClick={handleGenerate} disabled={isPending || !topic}>
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {isPending ? "Generating slides..." : "Generate Carousel"}
                </Button>
            </div>

            {slides.length > 0 && slide && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Slide {currentSlide + 1} of {slides.length}</span>
                        <div className="flex gap-1">
                            <Button size="icon" variant="outline" className="h-7 w-7" disabled={currentSlide === 0} onClick={() => setCurrentSlide(i => i - 1)}>
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="icon" variant="outline" className="h-7 w-7" disabled={currentSlide === slides.length - 1} onClick={() => setCurrentSlide(i => i + 1)}>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>
                    <div className="rounded-xl border border-border overflow-hidden">
                        {slide.imageUrl && (
                            <div className="relative aspect-square w-full">
                                <Image src={slide.imageUrl} alt={slide.title} fill className="object-cover" sizes="672px" />
                            </div>
                        )}
                        <div className="p-4 bg-card">
                            <p className="font-semibold text-sm mb-1">{slide.title}</p>
                            <p className="text-xs text-muted-foreground">{slide.body}</p>
                        </div>
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto py-1">
                        {slides.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-colors ${i === currentSlide ? "border-primary" : "border-border"}`}
                            >
                                {s.imageUrl
                                    ? <Image src={s.imageUrl} alt={`Slide ${i + 1}`} width={48} height={48} className="object-cover w-full h-full" />
                                    : <div className="w-full h-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground">{i + 1}</div>
                                }
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
