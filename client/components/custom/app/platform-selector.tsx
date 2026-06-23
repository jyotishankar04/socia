import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Linkedin } from "lucide-react"
import React from "react"

export interface PlatformOption {
    value: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    disabled?: boolean
    badge?: string
}

interface PlatformSelectorProps {
    platforms: PlatformOption[]
    value: string
    onChange: (platform: string) => void
    disabled?: boolean
}

export const defaultPlatforms: PlatformOption[] = [
    { value: "linkedin", label: "LinkedIn", icon: Linkedin },
]

export function PlatformSelector({ platforms, value, onChange, disabled }: PlatformSelectorProps) {
    return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger size="sm" className="min-w-[120px] h-8 text-xs">
                <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent side="top" align="start">
                <SelectGroup>
                    <SelectLabel>Platforms</SelectLabel>
                    {platforms.map((platform) => (
                        <SelectItem
                            key={platform.value}
                            value={platform.value}
                            disabled={platform.disabled}
                        >
                            <div className="flex items-center gap-2 text-xs">
                                <platform.icon className="w-4 h-4" />
                                <span>{platform.label}</span>
                                {platform.badge && (
                                    <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                                        {platform.badge}
                                    </Badge>
                                )}
                            </div>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
