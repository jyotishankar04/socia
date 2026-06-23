"use client"

import * as React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    BookTemplate,
    PlusIcon,
    History,
    MessageSquare,
    LayoutDashboard,
    Settings,
    UserCircle,
    CreditCard,
    MoreHorizontal,
    Pencil,
    Trash2,
    ExternalLink,
    Images,
    Wand2,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Logo from "./logo"
import { NavUser } from "./nav-user"
import Link from "next/link"
import { useConversationsQuery, useDeleteConversation, useRenameConversation } from "@/lib/query"
import { useAuthStore } from "@/store/auth"
import type { Conversation } from "@/types"
import { usePathname, useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

const mainItems = [
    { title: "Dashboard", url: "/app", icon: LayoutDashboard },
    { title: "Studio", url: "/app/studio", icon: Wand2 },
    { title: "Media", url: "/app/media", icon: Images },
    { title: "Templates", url: "/app/templates", icon: BookTemplate },
    { title: "History", url: "/app/history", icon: History },
]

const accountItems = [
    { title: "Settings", url: "/app/settings", icon: Settings },
    { title: "Profile", url: "/app/profile", icon: UserCircle },
    { title: "Billing", url: "/app/billing", icon: CreditCard },
]

function ConversationSkeleton() {
    return (
        <div className="flex items-center gap-2 px-2 py-1.5">
            <Skeleton className="h-4 w-4 rounded shrink-0" />
            <Skeleton className="h-3 flex-1 rounded" />
        </div>
    )
}

function ConversationItem({ item, isActive }: { item: Conversation; isActive: boolean }) {
    const router = useRouter()
    const pathname = usePathname()
    const queryClient = useQueryClient()
    const [isRenaming, setIsRenaming] = React.useState(false)
    const [draftTitle, setDraftTitle] = React.useState(item.title ?? "")
    const inputRef = React.useRef<HTMLInputElement>(null)

    const { mutate: rename } = useRenameConversation()
    const { mutate: remove } = useDeleteConversation()

    React.useEffect(() => {
        if (isRenaming) inputRef.current?.focus()
    }, [isRenaming])

    const submitRename = () => {
        const trimmed = draftTitle.trim()
        if (trimmed && trimmed !== item.title) {
            rename(
                { id: item.id, title: trimmed },
                { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["conversations"] }) }
            )
        }
        setIsRenaming(false)
    }

    const handleDelete = () => {
        remove(item.id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["conversations"] })
                if (pathname.includes(item.id)) router.push("/app/chat")
            }
        })
    }

    return (
        <SidebarMenuItem>
            {isRenaming ? (
                <SidebarMenuButton isActive={isActive} asChild>
                    <div className="flex items-center gap-2 w-full">
                        <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <input
                            ref={inputRef}
                            value={draftTitle}
                            onChange={e => setDraftTitle(e.target.value)}
                            onBlur={submitRename}
                            onKeyDown={e => {
                                if (e.key === "Enter") submitRename()
                                if (e.key === "Escape") setIsRenaming(false)
                            }}
                            className="flex-1 bg-transparent outline-none text-sm min-w-0"
                        />
                    </div>
                </SidebarMenuButton>
            ) : (
                <SidebarMenuButton
                    isActive={isActive}
                    onClick={() => router.push(`/app/chat/${item.id}`)}
                    className="cursor-pointer group/item"
                    title={item.title ?? "Untitled"}
                >
                    <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{item.title ?? "Untitled"}</span>
                </SidebarMenuButton>
            )}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover className="cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                    </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="w-44">
                    <DropdownMenuItem onClick={() => router.push(`/app/editor/${item.id}`)}>
                        <ExternalLink className="h-4 w-4" />
                        Open in Editor
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setDraftTitle(item.title ?? ""); setIsRenaming(true) }}>
                        <Pencil className="h-4 w-4" />
                        Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const { user } = useAuthStore()
    const { data: conversations, isLoading } = useConversationsQuery()

    const conversationsList: Conversation[] = conversations?.data ?? []
    const recentConversations = conversationsList.slice(0, 15)

    const navUser = {
        avatar: user?.avatar ?? "",
        email: user?.email ?? "",
        name: user?.name ?? "",
    }

    const isActive = (url: string) => {
        if (url === "/app") return pathname === "/app"
        return pathname.startsWith(url)
    }

    const isConversationActive = (id: string) =>
        pathname === `/app/chat/${id}` || pathname === `/app/editor/${id}`

    return (
        <Sidebar {...props} collapsible="icon">
            <SidebarHeader>
                <Logo />
            </SidebarHeader>

            <SidebarContent>
                {/* New Chat */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/80">
                                    <Link href="/app/chat">
                                        <PlusIcon className="h-4 w-4" />
                                        <span>New Chat</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Main navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainItems.map((item) => (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Recent conversations */}
                <SidebarGroup className="flex-1 min-h-0">
                    <SidebarGroupLabel>Recent</SidebarGroupLabel>
                    <SidebarGroupContent className="overflow-y-auto">
                        <SidebarMenu>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <SidebarMenuItem key={i}>
                                        <ConversationSkeleton />
                                    </SidebarMenuItem>
                                ))
                            ) : recentConversations.length > 0 ? (
                                recentConversations.map((item) => (
                                    <ConversationItem
                                        key={item.id}
                                        item={item}
                                        isActive={isConversationActive(item.id)}
                                    />
                                ))
                            ) : (
                                <SidebarMenuItem>
                                    <p className="text-xs text-muted-foreground text-center py-3 px-2">
                                        No conversations yet
                                    </p>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Account */}
                <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {accountItems.map((item) => (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={navUser} />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}
