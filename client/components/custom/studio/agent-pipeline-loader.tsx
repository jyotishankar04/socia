"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Circle, Loader2 } from "lucide-react"

interface Step {
    label: string
    duration: number // ms before advancing to next step
}

const DEFAULT_STEPS: Step[] = [
    { label: "Analyzing your intent...", duration: 2500 },
    { label: "Building visual prompt...", duration: 3000 },
    { label: "Validating composition...", duration: 2000 },
    { label: "Generating image...", duration: 99999 },
]

const CAROUSEL_STEPS: Step[] = [
    { label: "Analyzing topic & audience...", duration: 2500 },
    { label: "Selecting visual style preset...", duration: 2000 },
    { label: "Planning slide narrative...", duration: 3500 },
    { label: "Building slide image prompts...", duration: 3000 },
    { label: "Validating each slide...", duration: 2500 },
    { label: "Generating images...", duration: 99999 },
]

const BANNER_STEPS: Step[] = [
    { label: "Analyzing brand intent...", duration: 2500 },
    { label: "Crafting banner composition...", duration: 3000 },
    { label: "Validating layout zones...", duration: 2000 },
    { label: "Generating banner...", duration: 99999 },
]

const THUMBNAIL_STEPS: Step[] = [
    { label: "Analyzing title & platform...", duration: 2500 },
    { label: "Crafting scroll-stopping composition...", duration: 3000 },
    { label: "Validating impact score...", duration: 2000 },
    { label: "Generating thumbnail...", duration: 99999 },
]

export const PIPELINE_STEPS = {
    image: DEFAULT_STEPS,
    carousel: CAROUSEL_STEPS,
    banner: BANNER_STEPS,
    thumbnail: THUMBNAIL_STEPS,
}

interface Props {
    type?: keyof typeof PIPELINE_STEPS
    className?: string
}

export function AgentPipelineLoader({ type = "image", className = "" }: Props) {
    const steps = PIPELINE_STEPS[type]
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        setCurrentStep(0)
        let idx = 0
        const advance = () => {
            if (idx < steps.length - 1) {
                const timer = setTimeout(() => {
                    idx++
                    setCurrentStep(idx)
                    advance()
                }, steps[idx]!.duration)
                return timer
            }
        }
        const t = advance()
        return () => { if (t) clearTimeout(t) }
    }, [steps])

    return (
        <div className={`flex flex-col gap-3 w-full max-w-xs ${className}`}>
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">AI Agent Pipeline</p>
            {steps.map((step, i) => {
                const done = i < currentStep
                const active = i === currentStep
                return (
                    <div key={i} className="flex items-center gap-3">
                        <div className="shrink-0">
                            {done ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : active ? (
                                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                            ) : (
                                <Circle className="w-4 h-4 text-zinc-700" />
                            )}
                        </div>
                        <span className={`text-xs transition-colors ${
                            done ? "text-green-400 line-through decoration-green-600" :
                            active ? "text-zinc-100 font-medium" :
                            "text-zinc-600"
                        }`}>
                            {step.label}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}
