"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Sparkles, Zap, Target, MessageSquare, TrendingUp, Users } from "lucide-react"
import { motion } from "motion/react"

const stats = [
    { value: "10K+", label: "Posts Generated" },
    { value: "500+", label: "Content Creators" },
    { value: "3", label: "Platforms" },
]

const features = [
    {
        icon: Zap,
        title: "Instant Generation",
        description: "From idea to ready-to-post content in seconds. No more staring at blank screens.",
    },
    {
        icon: Target,
        title: "Platform Optimized",
        description: "Tailored for each platform's tone, character limits, and engagement patterns.",
    },
    {
        icon: Sparkles,
        title: "AI Powered",
        description: "Understands your brand voice and audience to create authentic, engaging content.",
    },
]

const howItWorks = [
    { step: "01", title: "Choose your platform", description: "Select LinkedIn, Twitter/X, or Threads" },
    { step: "02", title: "Describe your idea", description: "Tell us what you want to post about" },
    { step: "03", title: "Generate & publish", description: "Get a ready-to-publish post in seconds" },
]

export default function Home() {
    return (
        <div className="w-full min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center text-center space-y-8"
                >
                    <div className="flex flex-col items-center gap-3">
                        <h1 className="text-5xl sm:text-6xl font-bold text-foreground tracking-tight leading-tight">
                            <span className="text-primary">Q</span>wikish{" "}
                            <span className="text-primary">Socia</span>
                        </h1>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-sm px-3 py-1 gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            AI-Powered Content Generation
                        </Badge>
                    </div>

                    <div className="space-y-4 max-w-2xl">
                        <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
                            Generate professional social media posts for{" "}
                            <span className="text-foreground font-semibold">LinkedIn</span>,{" "}
                            <span className="text-foreground font-semibold">Twitter/X</span>, and{" "}
                            <span className="text-foreground font-semibold">Threads</span>{" "}
                            in seconds — not hours.
                        </p>
                        <p className="text-muted-foreground">
                            Describe your idea. Pick your platform. Get a ready-to-publish post.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Link href="/auth/signup">
                            <Button size="lg" className="px-8 gap-2 shadow-sm">
                                Get Started Free
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Link href="/auth/signin">
                            <Button size="lg" variant="outline" className="px-8">
                                Sign In
                            </Button>
                        </Link>
                    </div>

                    <div className="flex gap-8 pt-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-20"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-foreground">Everything you need</h2>
                        <p className="text-sm text-muted-foreground mt-2">Powerful features to supercharge your social media content</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {features.map((feature) => (
                            <Card key={feature.title} className="hover:border-primary/30 hover:shadow-sm transition-all duration-200">
                                <CardContent className="p-6 text-center">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <feature.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-20"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-foreground">How it works</h2>
                        <p className="text-sm text-muted-foreground mt-2">Three simple steps to amazing social media content</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {howItWorks.map((item) => (
                            <div key={item.step} className="p-6 rounded-xl border border-border bg-card text-center relative">
                                <span className="text-4xl font-bold text-primary/10">{item.step}</span>
                                <h3 className="font-semibold text-foreground mt-3 mb-1.5">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-20 text-center"
                >
                    <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
                        <h2 className="text-2xl font-bold text-foreground mb-3">Ready to transform your content?</h2>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Join hundreds of content creators who generate engaging posts in seconds.
                        </p>
                        <Link href="/auth/signup">
                            <Button size="lg" className="px-8 gap-2 shadow-sm">
                                Start Creating Free
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            <footer className="border-t border-border py-8 px-4">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">
                            <span className="font-bold text-primary">Q</span>wikish Socia
                        </span>
                    </div>
                    <div className="flex gap-6">
                        <span className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">Terms</span>
                        <span className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">Privacy</span>
                        <span className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">Contact</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}
