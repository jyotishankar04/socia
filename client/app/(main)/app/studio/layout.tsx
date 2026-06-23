import { StudioSidebar } from "@/components/custom/studio/studio-sidebar"

export default function StudioLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-full w-full bg-zinc-950 overflow-hidden">
            <StudioSidebar />
            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    )
}
