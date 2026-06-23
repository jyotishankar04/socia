import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface PageHeaderProps {
    title: string
    description?: string
    children?: ReactNode
    className?: string
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", className)}>
            <div className="space-y-0.5">
                <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </div>
            {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
    )
}
