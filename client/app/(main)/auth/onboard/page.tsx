"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check } from "lucide-react"

const OnboardingPage = () => {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        // Step 1
        role: "",
        companyName: "",
        industry: "",

        // Step 2
        platforms: [] as string[],

        // Step 3
        goals: [] as string[],

        // Step 4
        audience: "",
        contentTypes: [] as string[],
    })

    const totalSteps = 4

    const steps = [
        {
            subtitle: "Tell us about yourself",
            progress: 25,
        },
        {
            subtitle: "Which platforms do you use?",
            progress: 50,
        },
        {
            subtitle: "What are your main goals?",
            progress: 75,
        },
        {
            subtitle: "Tell us about your audience",
            progress: 100,
        },
    ]

    const roles = [
        "Founder",
        "Marketing Manager",
        "Social Media Manager",
        "Content Creator",
        "Small Business Owner",
        "Freelancer",
        "Other"
    ]

    const platforms = [
        { id: "twitter", label: "Twitter/X" },
        { id: "linkedin", label: "LinkedIn" },
        { id: "threads", label: "Threads" },
    ]

    const goals = [
        "Increase Engagement",
        "Build Brand Awareness",
        "Drive Website Traffic",
        "Generate Leads",
        "Boost Sales",
        "Grow Community",
    ]

    const contentTypes = [
        "Educational",
        "Promotional",
        "Inspirational",
        "Entertaining",
        "News & Updates",
        "Behind the Scenes",
    ]

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1)
        } else {
            handleComplete()
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleComplete = async () => {
        // Here you would typically send the formData to your backend
        console.log("Form data:", formData)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Show completion and redirect
        setCurrentStep(5)

        setTimeout(() => {
            router.push("/app")
        }, 5000)
    }
    if (currentStep === 5) {
        return (
                <div className="w-full max-w-md">
                    <div className="pt-6">
                        <div className="text-center">
                            
                            <div className="flex items-center justify-center">
                                <Check className="mx-auto h-24 w-24  text-primary bg-primary/30 rounded-full p-4" />
                            </div>
                            <h2 className="text-2xl font-bold text-primary mb-2">Congratulations!</h2>
                            <p className="text-foreground mb-6">
                                Your profile has been set up successfully. Redirecting to your dashboard...
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-5000"
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <p className="text-sm text-accent-foreground mt-4">
                                Redirecting in 5 seconds
                            </p>
                        </div>
                    </div>
                </div>
        )
    }

    return (

        <div className="space-y-6 w-full max-w-md">
            {/* Progress Section
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                        Step {currentStep} of {totalSteps}
                    </span>
                    <span className="text-sm text-gray-500">{steps[currentStep - 1].progress}%</span>
                </div>
                <Progress value={steps[currentStep - 1].progress} className="w-full" />
                </div> */}

            <div className="text-center">
                <p className="text-sm text-foreground">{steps[currentStep - 1].subtitle}</p>
            </div>
            {/* Step Content */}
            <div className="max-w-md mx-auto w-full">
                {currentStep === 1 && (
                    <div className="space-y-4 ">
                      <div className="space-y-2">
                            <Label htmlFor="role">Select your role</Label>
                            <Select  >
                                <SelectTrigger className="w-full" id="role" >
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                   {
                                    roles.map((role) => (
                                        <SelectItem key={role} value={role} >
                                            {role}
                                        </SelectItem>
                                    ))
                                   }
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
                                placeholder="e.g., Technology, Finance, etc. Separated by commas"
                            />
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            {platforms.map(platform => (
                                <div key={platform.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={platform.id}
                                        checked={formData.platforms.includes(platform.id)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setFormData(prev => ({ ...prev, platforms: [...prev.platforms, platform.id] }))
                                            } else {
                                                setFormData(prev => ({ ...prev, platforms: prev.platforms.filter(id => id !== platform.id) }))
                                            }
                                        }}
                                    />
                                    <Label htmlFor={platform.id} className="text-sm cursor-pointer">
                                        {platform.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            {goals.map(goal => (
                                <div key={goal} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={goal}
                                        checked={formData.goals.includes(goal)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setFormData(prev => ({ ...prev, goals: [...prev.goals, goal] }))
                                            } else {
                                                setFormData(prev => ({ ...prev, goals: prev.goals.filter(g => g !== goal) }))
                                            }
                                        }}
                                    />
                                    <Label htmlFor={goal} className="text-sm cursor-pointer">
                                        {goal}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="audience">Tell us about your audience</Label>
                            <Input
                                id="audience"
                                value={formData.audience}
                                onChange={(e) => setFormData(prev => ({ ...prev, audience: e.target.value }))}
                                placeholder="e.g., Young professionals interested in technology, fitness enthusiasts, small business owners..."
                            />
                        </div>

                        <div className="space-y-3">
                            <Label>Preferred content types</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {contentTypes.map(type => (
                                    <div key={type} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={type}
                                            checked={formData.contentTypes.includes(type)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setFormData(prev => ({ ...prev, contentTypes: [...prev.contentTypes, type] }))
                                                } else {
                                                    setFormData(prev => ({ ...prev, contentTypes: prev.contentTypes.filter(ct => ct !== type) }))
                                                }
                                            }}
                                        />
                                        <Label htmlFor={type} className="text-sm cursor-pointer">
                                            {type}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                >
                    Back
                </Button>

                <Button
                    type="button"
                    onClick={handleNext}
                >
                    {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
                </Button>
            </div>
        </div>
    )
}

export default OnboardingPage