import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface SectionHeaderProps {
    title: string
    description?: string
    action?: ReactNode
    className?: string
}

export function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
    return (
        <div className={cn("flex items-center justify-between", className)}>
            <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                {description && (
                    <p className="text-xs text-muted-foreground">{description}</p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    )
}
