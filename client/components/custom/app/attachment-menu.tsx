"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, Paperclip, Image, FileText, Video, Mic } from "lucide-react"
import React from "react"

export interface AttachmentOption {
    value: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string
}

interface AttachmentMenuProps {
    options: AttachmentOption[]
    onSelect?: (type: string) => void
    disabled?: boolean
}

export const defaultAttachmentOptions: AttachmentOption[] = [
    { value: "files", label: "Files", icon: Paperclip, badge: "Soon" },
    { value: "images", label: "Images", icon: Image, badge: "Soon" },
    { value: "documents", label: "Documents", icon: FileText, badge: "Soon" },
    { value: "video", label: "Video", icon: Video, badge: "Soon" },
    { value: "audio", label: "Audio", icon: Mic, badge: "Soon" },
]

export function AttachmentMenu({ options, onSelect, disabled }: AttachmentMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={disabled}>
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-8 w-8"
                >
                    <PlusIcon className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-48">
                {options.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        disabled={disabled}
                        onClick={() => onSelect?.(option.value)}
                        className="flex items-center justify-between text-xs"
                    >
                        <div className="flex items-center gap-2">
                            <option.icon className="w-4 h-4" />
                            <span>{option.label}</span>
                        </div>
                        {option.badge && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{option.badge}</Badge>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
