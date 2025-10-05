"use client"
import Link from 'next/link'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full text-center space-y-8">
                {/* 404 Number */}
                <div className="relative">
                    <div className="text-9xl font-bold text-muted-foreground/20 select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-2xl font-semibold text-foreground mb-2">
                                Page Not Found
                            </div>
                            <div className="w-16 h-1 bg-primary rounded-full mx-auto"></div>
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-foreground">
                        Oops! Lost your way?
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        The page you're looking for doesn't exist or has been moved.
                        Let's get you back on track.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link
                        href="/app"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg font-medium text-foreground hover:bg-accent transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>

                {/* Search Suggestion */}
                <div className="pt-6">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Search className="w-4 h-4" />
                        <span>Try searching or check the URL</span>
                    </div>
                </div>
            </div>
        </div>
    )
}