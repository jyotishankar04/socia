import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
    title: string
    value: string
    icon: LucideIcon
    trend?: { value: string; positive: boolean }
    className?: string
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
    return (
        <Card className={cn("transition-colors hover:bg-accent/40", className)}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
                        <p className="text-2xl font-bold text-foreground">{value}</p>
                        {trend && (
                            <p className={cn(
                                "text-xs font-medium",
                                trend.positive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
                            )}>
                                {trend.positive ? "↑" : "↓"} {trend.value}
                            </p>
                        )}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
