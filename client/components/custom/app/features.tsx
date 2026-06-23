import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CloudLightning, Goal, Sparkles } from "lucide-react"

const Features = () => {
    const features = [
        {
            title: "AI Powered Generation",
            description: "Generate multiple post variants with intelligent AI that understands your brand voice and audience.",
            icon: Sparkles,
        },
        {
            title: "Platform Optimized",
            description: "Content tailored for each platform's best practices, character limits, and engagement patterns.",
            icon: Goal,
        },
        {
            title: "Quick Templates",
            description: "Start with pre-built templates for product launches, events, promotions, and more.",
            icon: CloudLightning,
        },
    ]

    return (
        <div className="w-full grid md:grid-cols-3 gap-3 mx-auto grid-cols-1 mb-10">
            {features.map((feature, index) => (
                <Card
                    key={index}
                    className="w-full hover:border-primary/30 hover:shadow-sm transition-all duration-200 text-center"
                >
                    <CardHeader className="pb-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                            <feature.icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-base">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-xs">{feature.description}</CardDescription>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default Features
