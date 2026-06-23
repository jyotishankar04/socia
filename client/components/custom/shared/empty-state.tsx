import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

interface EmptyStateProps {
    icon?: LucideIcon
    title: string
    description?: string
    action?: ReactNode
    className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
            {Icon && (
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-primary" />
                </div>
            )}
            <h3 className="text-base font-semibold text-foreground mb-1.5">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground max-w-sm mb-5">{description}</p>
            )}
            {action}
        </div>
    )
}
