"use client"

import { PageHeader } from "@/components/custom/shared/page-header"
import { EmptyState } from "@/components/custom/shared/empty-state"
import { BookTemplate, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion } from "motion/react"

const templateCategories = [
    { name: "Thought Leadership", count: 8, description: "Establish authority in your industry" },
    { name: "Product Launch", count: 6, description: "Announce new features and products" },
    { name: "Company Updates", count: 5, description: "Share team and company milestones" },
    { name: "Industry Insights", count: 7, description: "Comment on trends and news" },
    { name: "How-to Guides", count: 4, description: "Educational and instructional content" },
    { name: "Storytelling", count: 6, description: "Engaging narrative-driven posts" },
]

export default function TemplatesPage() {
    return (
        <div className="p-6 space-y-6 max-w-5xl w-full mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <PageHeader
                    title="Templates"
                    description="Start with a pre-built template and customize it for your brand"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="relative"
            >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search templates..."
                    className="pl-9 bg-card"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
                {templateCategories.map((category) => (
                    <div
                        key={category.name}
                        className="group p-5 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all duration-200 cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                                <BookTemplate className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {category.count} templates
                            </span>
                        </div>
                        <h3 className="text-sm font-semibold text-foreground mb-1">{category.name}</h3>
                        <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                ))}
            </motion.div>

            <div className="flex items-center justify-center py-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5" />
                    More templates coming soon
                </p>
            </div>
        </div>
    )
}
