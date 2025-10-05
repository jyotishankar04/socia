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

const history = [
    {
        title: "Importance of AI",
        url: "/app/post/1",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
    }, {
        title: "The future of AI",
        url: "/app/post/2",
        createdAt: new Date("2024-01-18"),
        updatedAt: new Date("2024-01-18"),
    }, {
        title: "The best books for self improvement",
        url: "/app/post/3",
        createdAt: new Date("2024-01-22"),
        updatedAt: new Date("2024-01-22"),
    }, {
        title: "Top skills for 2025",
        url: "/app/post/4",
        createdAt: new Date("2024-01-25"),
        updatedAt: new Date("2024-01-25"),
    }, {
        title: "Machine Learning Fundamentals",
        url: "/app/post/5",
        createdAt: new Date("2024-02-03"),
        updatedAt: new Date("2024-02-03"),
    }, {
        title: "Web Development Trends 2024",
        url: "/app/post/6",
        createdAt: new Date("2024-02-10"),
        updatedAt: new Date("2024-02-10"),
    }, {
        title: "Cloud Computing Explained",
        url: "/app/post/7",
        createdAt: new Date("2024-02-17"),
        updatedAt: new Date("2024-02-17"),
    }, {
        title: "Data Science Career Guide",
        url: "/app/post/8",
        createdAt: new Date("2024-02-24"),
        updatedAt: new Date("2024-02-24"),
    }, {
        title: "Cybersecurity Best Practices",
        url: "/app/post/9",
        createdAt: new Date("2024-03-02"),
        updatedAt: new Date("2024-03-02"),
    }, {
        title: "Blockchain Technology Overview",
        url: "/app/post/10",
        createdAt: new Date("2024-03-09"),
        updatedAt: new Date("2024-03-09"),
    }, {
        title: "Mobile App Development",
        url: "/app/post/11",
        createdAt: new Date("2024-03-16"),
        updatedAt: new Date("2024-03-16"),
    }, {
        title: "UI/UX Design Principles",
        url: "/app/post/12",
        createdAt: new Date("2024-03-23"),
        updatedAt: new Date("2024-03-23"),
    }, {
        title: "DevOps Methodology",
        url: "/app/post/13",
        createdAt: new Date("2024-03-30"),
        updatedAt: new Date("2024-03-30"),
    }, {
        title: "Internet of Things Applications",
        url: "/app/post/14",
        createdAt: new Date("2024-04-05"),
        updatedAt: new Date("2024-04-05"),
    }, {
        title: "Quantum Computing Basics",
        url: "/app/post/15",
        createdAt: new Date("2024-04-12"),
        updatedAt: new Date("2024-04-12"),
    }
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                    <Button>
                        <PlusIcon />
                        {open ? <Link href="/app">
                            New Chat
                        </Link> : null}
                    </Button>
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
                                history.map((item) => (
                                    <SidebarMenuItem key={item.url}>
                                        <SidebarMenuButton
                                            className="line-clamp-1"
                                            onMouseEnter={() => setIsMouseHovered({
                                                url: item.url,
                                                isHoverd: true
                                            })}
                                            onMouseLeave={() => setIsMouseHovered(
                                                {
                                                    url: "",
                                                    isHoverd: false
                                                }
                                            )}
                                        >
                                            <div className={`${isMouseHovered.isHoverd && isMouseHovered.url === item.url && open && item.title.length > 20 ? "scrolling-text" : ""}`}>
                                                {item.title}
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }
                        </SidebarGroup>: null
                    }
                </SidebarMenu>
                <NavUser user={{
                    avatar:"",
                    email: "patrajyotishankar@gmail.com",
                    name:"Jyotishankar Patra"
                }} />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
