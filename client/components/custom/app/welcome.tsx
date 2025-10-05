import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles } from 'lucide-react';

const WelcomeSection = () => {
    const [currentSocialMedia, setCurrentSocialMedia] = useState(0);

    const socialMedias = ["LinkedIn", "Twitter/X", "Threads", "Instagram", "Facebook"];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSocialMedia((prev) => (prev + 1) % socialMedias.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);
    return (
        <div className="text-center space-y-6">
            {/* Main Welcome Text */}
            <motion.div
                className="flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    Welcome to <span className='text-primary'>Qwikish</span> Socia
                </h1>
            </motion.div>

            {/* Animated Subtitle */}
            <motion.div
                className="flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="flex flex-col items-center gap-3">
                    <p className="text-md md:text-md text-muted-foreground flex items-center flex-wrap justify-center">
                        Generate{" "}
                        <span className="mx-2 text-foreground">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={socialMedias[currentSocialMedia]}
                                    className="text-primary"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {socialMedias[currentSocialMedia]}
                                </motion.span>
                            </AnimatePresence>
                        </span>{" "}
                        posts instantly
                    </p>
                    {/* Beautiful status indicator */}
                    <div className="flex items-center gap-3 mt-2 border border-muted-foreground/20 p-2 rounded-xl pr-4 bg-muted/30 backdrop-blur-sm">
                        <div className="flex items-center gap-2">

                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                AI Powered
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Instant content generation</p>
                        <ArrowRight className="w-4 h-4 text-muted-foreground/60 ml-1" />
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default WelcomeSection