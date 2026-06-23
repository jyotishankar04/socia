"use client"

import { useState } from "react"
import { useImageStudio } from "@/store/use-image-studio"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
    Sparkles, Move, Paintbrush, Eraser, Square,
    ImageOff, Image, X, Plus, Palette,
    Crop, Wand2, ChevronDown, Loader2, Maximize2,
} from "lucide-react"
import type { ToolType } from "@/types"

const TOOLS: Array<{ type: ToolType; icon: React.ComponentType<{ className?: string }>; label: string }> = [
    { type: "MOVE", icon: Move, label: "Move" },
    { type: "BRUSH", icon: Paintbrush, label: "Brush" },
    { type: "ERASER", icon: Eraser, label: "Eraser" },
    { type: "RECTANGLE", icon: Square, label: "Rect" },
]

const FILTERS = [
    { label: "Cinematic", prompt: "Apply a cinematic film look with warm tones, slight vignette, and high contrast" },
    { label: "Watercolor", prompt: "Transform into a soft watercolor painting with visible brushstrokes and blended colors" },
    { label: "Vintage", prompt: "Apply vintage film photography: faded colors, grain, warm yellow tint" },
    { label: "Neon", prompt: "Apply vibrant neon glow with dark background and glowing edges" },
    { label: "Sketch", prompt: "Convert to pencil sketch with clean lines and subtle shading" },
    { label: "Oil Paint", prompt: "Transform into an oil painting with rich colors and visible texture" },
    { label: "Studio Light", prompt: "Apply professional studio lighting with soft shadows and balanced exposure" },
    { label: "Anime", prompt: "Convert to anime/illustration art style with clean linework and flat colors" },
]

const EXPAND_RATIOS = [
    { label: "1:1", value: "1:1" },
    { label: "16:9", value: "16:9" },
    { label: "9:16", value: "9:16" },
    { label: "4:3", value: "4:3" },
    { label: "3:2", value: "3:2" },
    { label: "2:1", value: "2:1" },
]

const SIZES = [
    { label: "Square 1:1", value: "1024x1024" },
    { label: "Landscape 3:2", value: "1536x1024" },
    { label: "Portrait 2:3", value: "1024x1536" },
]

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div className="border-b border-zinc-800 last:border-0">
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center justify-between w-full px-3 py-2.5 text-left hover:bg-zinc-800/40 transition-colors"
            >
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{title}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-600 transition-transform", open && "rotate-180")} />
            </button>
            {open && <div className="px-3 pb-3">{children}</div>}
        </div>
    )
}

export function StudioLeftSidebar() {
    const {
        selectedTool, setSelectedTool,
        brushSize, setBrushSize,
        prompt, setPrompt,
        isLoading, loadingLabel,
        image,
        generateNewImage,
        generateEdit,
        applyFilter, applyExpansion,
        removeBackground, replaceBackground,
        removeObject, addObject,
        recolor, smartEdit,
    } = useImageStudio()

    const [bgPrompt, setBgPrompt] = useState("")
    const [objectPrompt, setObjectPrompt] = useState("")
    const [addObjectPrompt, setAddObjectPrompt] = useState("")
    const [recolorPrompt, setRecolorPrompt] = useState("")
    const [genSize, setGenSize] = useState("1024x1024")

    const disabled = isLoading || !image
    const canvasDisabled = !image

    return (
        <div className="flex flex-col h-full bg-zinc-900 border-r border-zinc-800 overflow-y-auto w-56 shrink-0 text-zinc-100">

            {/* Loading overlay label */}
            {isLoading && (
                <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border-b border-primary/20">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                    <span className="text-[11px] text-primary">{loadingLabel}</span>
                </div>
            )}

            {/* Generate New */}
            <Section title="Generate New" defaultOpen>
                <div className="space-y-2">
                    <Textarea
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="Describe your image..."
                        className="text-xs bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 resize-none min-h-[64px]"
                        rows={3}
                    />
                    <Select value={genSize} onValueChange={setGenSize}>
                        <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700 text-zinc-300">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-200">
                            {SIZES.map(s => <SelectItem key={s.value} value={s.value} className="text-xs">{s.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button
                        size="sm"
                        className="w-full gap-1.5 h-8"
                        onClick={() => generateNewImage(prompt, genSize)}
                        disabled={isLoading || !prompt.trim()}
                    >
                        <Sparkles className="w-3 h-3" />
                        Generate
                    </Button>
                </div>
            </Section>

            {/* Tools */}
            <Section title="Canvas Tools" defaultOpen>
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                    {TOOLS.map(tool => (
                        <Button
                            key={tool.type}
                            size="sm"
                            variant="ghost"
                            className={cn(
                                "h-9 flex flex-col gap-0.5 text-[10px] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800",
                                selectedTool === tool.type && "bg-zinc-700 text-zinc-100"
                            )}
                            onClick={() => setSelectedTool(tool.type)}
                            disabled={canvasDisabled}
                        >
                            <tool.icon className="w-3.5 h-3.5" />
                            {tool.label}
                        </Button>
                    ))}
                </div>
                {(selectedTool === "BRUSH" || selectedTool === "ERASER") && (
                    <div className="space-y-1.5">
                        <span className="text-[10px] text-zinc-500">Size: {brushSize}px</span>
                        <Slider min={5} max={100} step={1} value={[brushSize]} onValueChange={([v]) => setBrushSize(v)} />
                    </div>
                )}
            </Section>

            {/* Smart Edit */}
            <Section title="Smart Edit">
                <div className="space-y-2">
                    <p className="text-[10px] text-zinc-500">Paint selection, then describe what to change</p>
                    <Textarea
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder='"Make it more professional"'
                        className="text-xs bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 resize-none"
                        rows={2}
                    />
                    <Button size="sm" className="w-full gap-1.5 h-8" onClick={generateEdit} disabled={disabled || !prompt}>
                        <Wand2 className="w-3 h-3" /> Edit Selection
                    </Button>
                    <Button size="sm" variant="outline" className="w-full gap-1.5 h-8 border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800" onClick={() => smartEdit(prompt)} disabled={disabled || !prompt}>
                        <Sparkles className="w-3 h-3" /> Smart Edit Whole
                    </Button>
                </div>
            </Section>

            {/* Background */}
            <Section title="Background">
                <div className="space-y-2">
                    <Button size="sm" variant="outline" className="w-full gap-1.5 h-8 border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 justify-start" onClick={removeBackground} disabled={disabled}>
                        <ImageOff className="w-3.5 h-3.5" /> Remove Background
                    </Button>
                    <div className="space-y-1.5">
                        <Input
                            value={bgPrompt}
                            onChange={e => setBgPrompt(e.target.value)}
                            placeholder="New background description..."
                            className="h-8 text-xs bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-600"
                        />
                        <Button size="sm" variant="outline" className="w-full gap-1.5 h-8 border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 justify-start" onClick={() => replaceBackground(bgPrompt)} disabled={disabled || !bgPrompt}>
                            <Image className="w-3.5 h-3.5" /> Replace Background
                        </Button>
                    </div>
                </div>
            </Section>

            {/* Object */}
            <Section title="Object">
                <div className="space-y-2">
                    <Button size="sm" variant="outline" className="w-full gap-1.5 h-8 border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 justify-start" onClick={removeObject} disabled={disabled}>
                        <X className="w-3.5 h-3.5" /> Remove Object
                    </Button>
                    <p className="text-[10px] text-zinc-600">Paint the object to remove, then click</p>
                    <div className="space-y-1.5">
                        <Input
                            value={addObjectPrompt}
                            onChange={e => setAddObjectPrompt(e.target.value)}
                            placeholder="Object to add..."
                            className="h-8 text-xs bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-600"
                        />
                        <Button size="sm" variant="outline" className="w-full gap-1.5 h-8 border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 justify-start" onClick={() => addObject(addObjectPrompt)} disabled={disabled || !addObjectPrompt}>
                            <Plus className="w-3.5 h-3.5" /> Add Object
                        </Button>
                    </div>
                </div>
            </Section>

            {/* Recolor */}
            <Section title="Recolor">
                <div className="space-y-2">
                    <Input
                        value={recolorPrompt}
                        onChange={e => setRecolorPrompt(e.target.value)}
                        placeholder="e.g. 'make it blue and gold'"
                        className="h-8 text-xs bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-600"
                    />
                    <Button size="sm" variant="outline" className="w-full gap-1.5 h-8 border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 justify-start" onClick={() => recolor(recolorPrompt)} disabled={disabled || !recolorPrompt}>
                        <Palette className="w-3.5 h-3.5" /> Apply Recolor
                    </Button>
                </div>
            </Section>

            {/* AI Filters */}
            <Section title="Style Filters">
                <div className="flex flex-col gap-1">
                    {FILTERS.map(f => (
                        <Button
                            key={f.label}
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 justify-start gap-1.5"
                            onClick={() => applyFilter(f.prompt)}
                            disabled={disabled}
                        >
                            <Sparkles className="w-3 h-3 shrink-0" />
                            {f.label}
                        </Button>
                    ))}
                </div>
            </Section>

            {/* Expand Canvas */}
            <Section title="Expand Canvas">
                <div className="space-y-2">
                    <p className="text-[10px] text-zinc-500">Outpaint to a new aspect ratio</p>
                    <div className="grid grid-cols-3 gap-1">
                        {EXPAND_RATIOS.map(ar => (
                            <Button
                                key={ar.value}
                                size="sm"
                                variant="outline"
                                className="h-7 text-[10px] border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                                onClick={() => applyExpansion(ar.value)}
                                disabled={disabled}
                            >
                                {ar.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Smart Crop */}
            <Section title="Transform">
                <div className="flex flex-col gap-1">
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 justify-start gap-1.5" onClick={() => smartEdit("Intelligently crop and recompose for better composition using rule of thirds")} disabled={disabled}>
                        <Crop className="w-3.5 h-3.5" /> Smart Crop
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 justify-start gap-1.5" onClick={() => smartEdit("Upscale and enhance image quality, sharpen details, reduce noise")} disabled={disabled}>
                        <Maximize2 className="w-3.5 h-3.5" /> Upscale & Enhance
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 justify-start gap-1.5" onClick={() => smartEdit("Make the background transparent, keep only the main subject with clean edges, export as PNG with alpha channel")} disabled={disabled}>
                        <ImageOff className="w-3.5 h-3.5" /> Transparent BG Export
                    </Button>
                </div>
            </Section>
        </div>
    )
}
