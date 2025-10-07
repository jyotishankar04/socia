"use client"

import * as React from "react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import { BookTemplate, PlusIcon, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "./logo"
import { NavUser } from "./nav-user"
import Link from "next/link"
import { useConversationsQuery } from "@/lib/query"
import { Conversation } from "@/types"
import { Spinner } from "@/components/ui/spinner"
import { usePathname, useRouter } from "next/navigation"

const items = [
    {
        title: "Search",
        url: "/app/search",
        icon: Search
    },
    {
        title: "Templates",
        url: "/app/templates",
        icon: BookTemplate,
    }
]


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname  = usePathname()
    const router = useRouter()
    const { data: conversations, isLoading: conversationsLoading, refetch, isSuccess } = useConversationsQuery()
    const [isMouseHovered, setIsMouseHovered] = React.useState({
        url: "",
        isHoverd: false
    })

    const { open } = useSidebar()
    return (
        <Sidebar {...props} collapsible="icon">
            <SidebarHeader>
                <Logo />
            </SidebarHeader>
            <SidebarContent className="p-2 flex flex-col">
                {/* We create a SidebarGroup for each parent. */}
                <SidebarMenu className="flex-1">
                    <Link href="/app" className="w-full" >
                    <Button className="w-full cursor-pointer">
                        <PlusIcon />
                        {open ? <div>
                            New Chat
                        </div> : null}
                    </Button>
                    </Link>
                    {
                        items.map((item) => (
                            <SidebarMenuItem key={item.url}>
                                <SidebarMenuButton>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.title}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))
                    }
                    {
                        open ? <SidebarGroup>
                            <SidebarGroupLabel>History</SidebarGroupLabel>
                            {
                                isSuccess && !conversationsLoading && conversations.data.length > 0 ? conversations.data.map((item: Conversation) => (
                                    <SidebarMenuItem key={item.id}>
                                        <SidebarMenuButton
                                            onClick={() => {
                                                router.push(`/app/editor/${item.id}`)
                                            }}
                                            className={`line-clamp-1 cursor-pointer ${`/app/editor/${item.id}` === pathname ? "bg-muted" : ""}`}
                                            onMouseEnter={() => setIsMouseHovered({
                                                url: `/app/editor/${item.id}`,
                                                isHoverd: true
                                            })}
                                            onMouseLeave={() => setIsMouseHovered(
                                                {
                                                    url: "",
                                                    isHoverd: false
                                                }
                                            )}
                                        >
                                            <div className={`${isMouseHovered.isHoverd && isMouseHovered.url === `/app/editor/${item.id}` && open && item.title.length > 20 ? "scrolling-text" : ""}`}>
                                                {item.title}
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                                    : <div className="w-full flex items-center mt-5 justify-center">No conversations</div>
                            }
                            {
                                conversationsLoading &&
                                <div className="w-full flex items-center mt-5 justify-center">
                                    <Spinner className="size-8" />
                                </div>
                            }
                        </SidebarGroup> : null
                    }
                </SidebarMenu>
                <NavUser user={{
                    avatar: "",
                    email: "patrajyotishankar@gmail.com",
                    name: "Jyotishankar Patra"
                }} />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
