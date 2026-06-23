"use client"

import { WelcomeBanner } from "@/components/custom/dashboard/welcome-banner"
import { StatCard } from "@/components/custom/dashboard/stat-card"
import { QuickActionCard } from "@/components/custom/dashboard/quick-action-card"
import { RecentActivity } from "@/components/custom/dashboard/recent-activity"
import { SectionHeader } from "@/components/custom/shared/section-header"
import {
    MessageSquare,
    FileText,
    CalendarDays,
    Flame,
    Zap,
    BookTemplate,
    Clock,
    UserCircle,
} from "lucide-react"
import { motion } from "motion/react"

const stats = [
    { title: "Conversations", value: "24", icon: MessageSquare, trend: { value: "8 this week", positive: true } },
    { title: "Posts Generated", value: "47", icon: FileText, trend: { value: "12 this month", positive: true } },
    { title: "This Month", value: "12", icon: CalendarDays, trend: { value: "3 this week", positive: true } },
    { title: "Day Streak", value: "5", icon: Flame, trend: { value: "Keep it up!", positive: true } },
]

const quickActions = [
    { title: "New Chat", description: "Start a conversation and generate content", icon: Zap, href: "/app/chat" },
    { title: "Templates", description: "Browse pre-built post templates", icon: BookTemplate, href: "/app/templates" },
    { title: "History", description: "View your past conversations", icon: Clock, href: "/app/history" },
    { title: "Profile", description: "Manage your account and platforms", icon: UserCircle, href: "/app/profile" },
]

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
}

const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
    return (
        <div className="p-6 space-y-8 max-w-7xl w-full mx-auto">
            <WelcomeBanner />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                <motion.div variants={item}>
                    <section className="space-y-4">
                        <SectionHeader title="Overview" description="Your content generation at a glance" />
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {stats.map((stat) => (
                                <StatCard key={stat.title} {...stat} />
                            ))}
                        </div>
                    </section>
                </motion.div>

                <motion.div variants={item}>
                    <section className="space-y-4">
                        <SectionHeader title="Quick Actions" description="Jump to where you need to go" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {quickActions.map((action) => (
                                <QuickActionCard key={action.title} {...action} />
                            ))}
                        </div>
                    </section>
                </motion.div>

                <motion.div variants={item}>
                    <RecentActivity />
                </motion.div>
            </motion.div>
        </div>
    )
}
