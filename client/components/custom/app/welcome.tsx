import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'

const socialMedias = ["LinkedIn", "Twitter/X", "Threads"]

const WelcomeSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % socialMedias.length)
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="text-center space-y-5">
            <motion.div
                className="flex flex-col items-center justify-center gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                    What would you like to post today?
                </h1>
                <p className="text-muted-foreground text-sm md:text-base flex items-center gap-1.5 flex-wrap justify-center">
                    Generate a{" "}
                    <span className="inline-flex items-center">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={socialMedias[currentIndex]}
                                className="text-primary font-semibold"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.3 }}
                            >
                                {socialMedias[currentIndex]}
                            </motion.span>
                        </AnimatePresence>
                    </span>{" "}
                    post instantly with AI
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
            >
                <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 px-3 py-1 gap-1.5"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    Platform-optimized · Instant results · No editing required
                </Badge>
            </motion.div>
        </div>
    )
}

export default WelcomeSection
