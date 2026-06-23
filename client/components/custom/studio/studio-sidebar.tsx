"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Home,
    ImageIcon,
    Pencil,
    LayoutTemplate,
    LayoutGrid,
    Crop,
    Video,
    Palette,
    FolderOpen,
} from "lucide-react"

const NAV = [
    { label: "Home", href: "/app/studio", icon: Home, exact: true },
    { label: "Generate", href: "/app/studio/images/generate", icon: ImageIcon },
    { label: "Editor", href: "/app/studio/images/edit", icon: Pencil },
    { label: "Banners", href: "/app/studio/banners", icon: LayoutTemplate },
    { label: "Carousels", href: "/app/studio/carousels", icon: LayoutGrid },
    { label: "Thumbnails", href: "/app/studio/thumbnails", icon: Crop },
    { label: "Video", href: "/app/studio/video", icon: Video },
    { label: "Brand Kit", href: "/app/studio/brand-kit", icon: Palette },
    { label: "Library", href: "/app/media", icon: FolderOpen },
]

export function StudioSidebar() {
    const pathname = usePathname()

    const isActive = (item: (typeof NAV)[number]) =>
        item.exact ? pathname === item.href : pathname.startsWith(item.href)

    return (
        <aside className="flex flex-col w-[68px] shrink-0 h-full bg-zinc-950 border-r border-zinc-800 py-3 gap-0.5 overflow-y-auto">
            {NAV.map((item) => {
                const active = isActive(item)
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1 px-1 py-2.5 rounded-lg mx-1.5 transition-colors",
                            active
                                ? "bg-primary/15 text-primary"
                                : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="text-[9px] font-medium leading-none text-center">{item.label}</span>
                    </Link>
                )
            })}
        </aside>
    )
}
