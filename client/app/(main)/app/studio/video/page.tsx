import { Video, Wand2, Film, Clapperboard, Zap, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const FEATURES = [
    { icon: Wand2, label: "Text to Video", desc: "Turn a prompt into a short video clip" },
    { icon: Film, label: "Image to Video", desc: "Animate any image with AI motion" },
    { icon: Clapperboard, label: "Product Demo", desc: "Auto-generate product showcase videos" },
    { icon: Zap, label: "Social Shorts", desc: "Vertical video for Reels, TikTok, Shorts" },
    { icon: Play, label: "AI B-Roll", desc: "Generate supplementary footage" },
    { icon: Video, label: "Animated Banners", desc: "Motion graphics for social ads" },
]

export default function VideoPage() {
    return (
        <div className="flex flex-col h-full overflow-y-auto text-zinc-100">
            <div className="px-6 py-5 border-b border-zinc-800">
                <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-0.5">AI Studio</p>
                <h1 className="text-xl font-bold text-white">Video Studio</h1>
                <p className="text-sm text-zinc-400 mt-0.5">AI-powered video generation and editing</p>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center">
                <div className="relative mb-8">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/30 to-pink-500/10 border border-purple-500/30 flex items-center justify-center mx-auto">
                        <Video className="w-9 h-9 text-purple-400" />
                    </div>
                    <span className="absolute -top-1 -right-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300">
                        COMING SOON
                    </span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-3">Video generation is on its way</h2>
                <p className="text-zinc-400 text-sm max-w-md mb-10">
                    We&apos;re integrating cutting-edge AI video models. Soon you&apos;ll be able to create stunning videos directly from your post content.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-2xl mb-10">
                    {FEATURES.map(f => (
                        <div key={f.label} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 opacity-60">
                            <f.icon className="w-6 h-6 text-zinc-400" />
                            <div>
                                <p className="text-xs font-semibold text-zinc-300">{f.label}</p>
                                <p className="text-[11px] text-zinc-600 mt-0.5">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3">
                    <Button asChild variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                        <Link href="/app/studio/images/generate">Generate Images Instead</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
