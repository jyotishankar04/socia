import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"

interface QuickActionCardProps {
    title: string
    description: string
    icon: LucideIcon
    href: string
    className?: string
}

export function QuickActionCard({ title, description, icon: Icon, href, className }: QuickActionCardProps) {
    return (
        <Link href={href} className="group block h-full">
            <Card className={cn(
                "h-full transition-all duration-200 hover:border-primary/40 hover:shadow-sm hover:bg-accent/30",
                className
            )}>
                <div className="p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {description}
                        </p>
                    </div>
                </div>
            </Card>
        </Link>
    )
}
