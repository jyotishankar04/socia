import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudLightning, Goal, Sparkles } from "lucide-react"

const Features = () => {
    const featuers = [
        {
            title: "AI Powerd Generation",
            description: "Generate multiple post variants with intelligent AI that understands your brand voice and audience.",
            icon: <Sparkles className="p-4 w-14 h-14 rounded-2xl text-primary bg-primary/20" />,
        },
        {
            title: "Platform Optimized",
            description: "Content tailored for each platform's best practices, character limits, and engagement patterns.",
            icon: <Goal className="p-4 w-14 h-14 rounded-2xl text-primary bg-primary/20" />,
        },
        {
            title: "Quick Templates",
            description: "Start with pre-built templates for product launches, events, promotions, and more.",
            icon: <CloudLightning className="p-4 w-14 h-14 rounded-2xl text-primary bg-primary/20" />,
        },
    ]
    return (
        <div className="w-full grid md:grid-cols-3 gap-3 mx-auto grid-cols-1 mb-10 ">
            {
                featuers.map((feature, index) => (
                    <Card key={index} className="w-full hover:ring-2 hover:ring-primary/30">
                        <CardHeader>
                            {feature.icon}
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                <p>{feature.description}</p>
                            </CardDescription>
                        </CardContent>
                    </Card>
                ))
            }
        </div>
    )
}

export default Features