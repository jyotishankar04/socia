import { Palette, Wand2, Layers, Type, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const FEATURES = [
    { icon: Palette, label: "Brand Colors", desc: "Define primary, secondary and accent colors used in every generation" },
    { icon: Type, label: "Typography System", desc: "Select fonts and typographic hierarchy for consistent text overlays" },
    { icon: Layers, label: "Logo & Assets", desc: "Upload logo and brand assets auto-embedded in banners and carousels" },
    { icon: Wand2, label: "AI Style Lock", desc: "AI agents use your brand voice, tone, and visual language automatically" },
    { icon: Star, label: "Saved Presets", desc: "Save reusable style presets for campaigns, sub-brands, or clients" },
    { icon: Zap, label: "One-Click Consistency", desc: "Apply your brand kit to any generated image with a single click" },
]

export default function BrandKitPage() {
    return (
        <div className="flex flex-col h-full overflow-y-auto text-zinc-100">
            <div className="px-6 py-5 border-b border-zinc-800">
                <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-0.5">AI Studio</p>
                <h1 className="text-xl font-bold text-white">Brand Kit</h1>
                <p className="text-sm text-zinc-400 mt-0.5">Define your brand identity — AI will use it in every generation</p>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center">
                <div className="relative mb-8">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500/30 to-orange-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
                        <Palette className="w-9 h-9 text-amber-400" />
                    </div>
                    <span className="absolute -top-1 -right-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300">
                        COMING SOON
                    </span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-3">Brand Kit is on its way</h2>
                <p className="text-zinc-400 text-sm max-w-md mb-10">
                    Soon every AI agent in the studio will automatically apply your brand colors, fonts, logo, and visual style — no prompting required.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-2xl mb-10">
                    {FEATURES.map(f => (
                        <div key={f.label} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 opacity-60 text-center">
                            <f.icon className="w-5 h-5 text-amber-400" />
                            <div>
                                <p className="text-xs font-semibold text-zinc-300">{f.label}</p>
                                <p className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3">
                    <Button asChild variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                        <Link href="/app/studio/images/generate">Generate Images Instead</Link>
                    </Button>
                    <Button asChild className="gap-1.5">
                        <Link href="/app/studio/banners">Try Banner Generator</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
