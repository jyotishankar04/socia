"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"

const OnboardingPage = () => {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        role: "",
        companyName: "",
        industry: "",
        platforms: [] as string[],
        goals: [] as string[],
        audience: "",
        contentTypes: [] as string[],
    })

    const totalSteps = 4

    const steps = [
        { number: 1, title: "About You", subtitle: "Tell us about your role" },
        { number: 2, title: "Platforms", subtitle: "Which platforms do you use?" },
        { number: 3, title: "Goals", subtitle: "What are your main goals?" },
        { number: 4, title: "Audience", subtitle: "Who are you creating for?" },
    ]

    const roles = [
        "Founder", "Marketing Manager", "Social Media Manager",
        "Content Creator", "Small Business Owner", "Freelancer", "Other"
    ]

    const platforms = [
        { id: "twitter", label: "Twitter/X" },
        { id: "linkedin", label: "LinkedIn" },
        { id: "threads", label: "Threads" },
    ]

    const goals = [
        "Increase Engagement", "Build Brand Awareness", "Drive Website Traffic",
        "Generate Leads", "Boost Sales", "Grow Community",
    ]

    const contentTypes = [
        "Educational", "Promotional", "Inspirational",
        "Entertaining", "News & Updates", "Behind the Scenes",
    ]

    const toggleArrayItem = (arr: string[], item: string): string[] =>
        arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]

    const handleNext = () => {
        if (currentStep < totalSteps) setCurrentStep(s => s + 1)
        else handleComplete()
    }

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(s => s - 1)
    }

    const handleComplete = async () => {
        setCurrentStep(5)
        setTimeout(() => router.push("/app"), 2500)
    }

    if (currentStep === 5) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full"
            >
                <div className="text-center space-y-5 py-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                        className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto"
                    >
                        <Check className="h-10 w-10 text-primary" />
                    </motion.div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">You&apos;re all set!</h2>
                        <p className="text-sm text-muted-foreground mt-1.5">
                            Your profile has been set up. Taking you to your dashboard…
                        </p>
                    </div>
                    <Progress value={100} className="h-1.5" />
                </div>
            </motion.div>
        )
    }

    const progress = (currentStep / totalSteps) * 100

    return (
        <div className="w-full space-y-6">
            <div className="space-y-4">
                <div className="flex items-center justify-center gap-1.5">
                    {steps.map((step) => (
                        <div key={step.number} className="flex items-center gap-1.5">
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 border-2",
                                    currentStep === step.number && "border-primary bg-primary text-primary-foreground",
                                    currentStep > step.number && "border-primary bg-primary/20 text-primary",
                                    currentStep < step.number && "border-border bg-card text-muted-foreground"
                                )}
                            >
                                {currentStep > step.number ? <Check className="w-3.5 h-3.5" /> : step.number}
                            </div>
                            {step.number < totalSteps && (
                                <div
                                    className={cn(
                                        "w-8 h-0.5 rounded-full transition-colors duration-200",
                                        currentStep > step.number ? "bg-primary" : "bg-border"
                                    )}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                        {steps[currentStep - 1].subtitle}
                    </p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">Select your role</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, role: val }))}
                                >
                                    <SelectTrigger className="w-full" id="role">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role} value={role}>{role}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input
                                    id="companyName"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                                    placeholder="e.g., Acme Inc."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="industry">Industry</Label>
                                <Input
                                    id="industry"
                                    value={formData.industry}
                                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                                    placeholder="e.g., Technology, Finance…"
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-2">
                            {platforms.map(platform => (
                                <div
                                    key={platform.id}
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-xl border transition-all duration-150 cursor-pointer",
                                        formData.platforms.includes(platform.id)
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:bg-accent/50"
                                    )}
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        platforms: toggleArrayItem(prev.platforms, platform.id)
                                    }))}
                                >
                                    <Checkbox
                                        id={platform.id}
                                        checked={formData.platforms.includes(platform.id)}
                                        onCheckedChange={() => {}}
                                    />
                                    <Label htmlFor={platform.id} className="text-sm cursor-pointer flex-1 font-medium">
                                        {platform.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="grid grid-cols-2 gap-2">
                            {goals.map(goal => (
                                <div
                                    key={goal}
                                    className={cn(
                                        "flex items-center gap-2 p-3 rounded-xl border transition-all duration-150 cursor-pointer",
                                        formData.goals.includes(goal)
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:bg-accent/50"
                                    )}
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        goals: toggleArrayItem(prev.goals, goal)
                                    }))}
                                >
                                    <Checkbox
                                        id={goal}
                                        checked={formData.goals.includes(goal)}
                                        onCheckedChange={() => {}}
                                    />
                                    <Label htmlFor={goal} className="text-xs cursor-pointer font-medium">{goal}</Label>
                                </div>
                            ))}
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="audience">Describe your target audience</Label>
                                <Input
                                    id="audience"
                                    value={formData.audience}
                                    onChange={(e) => setFormData(prev => ({ ...prev, audience: e.target.value }))}
                                    placeholder="e.g., Young professionals in tech, small business owners"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Preferred content types</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {contentTypes.map(type => (
                                        <div
                                            key={type}
                                            className={cn(
                                                "flex items-center gap-2 p-3 rounded-xl border transition-all duration-150 cursor-pointer",
                                                formData.contentTypes.includes(type)
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:bg-accent/50"
                                            )}
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                contentTypes: toggleArrayItem(prev.contentTypes, type)
                                            }))}
                                        >
                                            <Checkbox
                                                id={type}
                                                checked={formData.contentTypes.includes(type)}
                                                onCheckedChange={() => {}}
                                            />
                                            <Label htmlFor={type} className="text-xs cursor-pointer font-medium">{type}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-between pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="gap-1.5"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </Button>
                <Button type="button" onClick={handleNext} className="gap-1.5">
                    {currentStep === totalSteps ? "Complete Setup" : "Next"}
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

export default OnboardingPage
