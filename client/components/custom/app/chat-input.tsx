"use client"

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { ArrowUpIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import React from "react"
import { PlatformSelector, defaultPlatforms } from "./platform-selector"
import { AttachmentMenu, defaultAttachmentOptions } from "./attachment-menu"
import type { PlatformOption } from "./platform-selector"
import type { AttachmentOption } from "./attachment-menu"

export type { PlatformOption, AttachmentOption }

interface ChatInputProps {
    placeholder?: string
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    platforms?: PlatformOption[]
    defaultPlatform?: string
    onPlatformChange?: (platform: string) => void
    showPlatforms?: boolean
    attachmentOptions?: AttachmentOption[]
    onAttachmentSelect?: (attachmentType: string) => void
    showAttachments?: boolean
    showUpgradeBanner?: boolean
    upgradeText?: string
    upgradeCta?: string
    onUpgradeClick?: () => void
    onSend?: (message: string, platform?: string) => void
    disabled?: boolean
    sendDisabled?: boolean
    isLoading?: boolean
    className?: string
    variant?: "default" | "minimal"
    size?: "sm" | "md" | "lg"
}

const ChatInput: React.FC<ChatInputProps> = ({
    placeholder = "Describe the post you want to create...",
    value,
    defaultValue,
    onValueChange,
    platforms = defaultPlatforms,
    defaultPlatform = "linkedin",
    onPlatformChange,
    showPlatforms = true,
    attachmentOptions = defaultAttachmentOptions,
    onAttachmentSelect,
    showAttachments = true,
    onSend,
    disabled = false,
    sendDisabled = false,
    isLoading = false,
    className,
    variant = "default",
    size = "md"
}) => {
    const [inputValue, setInputValue] = React.useState(value || defaultValue || "")
    const [selectedPlatform, setSelectedPlatform] = React.useState(defaultPlatform)

    const handleInputChange = (newValue: string) => {
        setInputValue(newValue)
        onValueChange?.(newValue)
    }

    const handlePlatformChange = (platform: string) => {
        setSelectedPlatform(platform)
        onPlatformChange?.(platform)
    }

    const handleSend = () => {
        if (inputValue.trim() && !sendDisabled && !isLoading) {
            onSend?.(inputValue, selectedPlatform)
            setInputValue("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const sizeHeight = { sm: "min-h-[48px]", md: "min-h-[56px]", lg: "min-h-[64px]" }
    const isSendDisabled = disabled || sendDisabled || isLoading || !inputValue.trim()

    return (
        <div className={cn(
            "rounded-2xl w-full max-w-3xl transition-all duration-200",
            variant === "default" && "bg-accent/40 p-1.5",
            variant === "minimal" && "bg-background border border-border shadow-sm",
            isLoading && "opacity-80",
            className
        )}>
            <InputGroup className="w-full">
                <InputGroupTextarea
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={cn("resize-none text-sm", sizeHeight[size])}
                    rows={size === "sm" ? 1 : size === "md" ? 2 : 3}
                    disabled={disabled || isLoading}
                />

                <InputGroupAddon align="block-end" className="px-1 pb-1">
                    {showAttachments && (
                        <AttachmentMenu
                            options={attachmentOptions}
                            onSelect={onAttachmentSelect}
                            disabled={disabled || isLoading}
                        />
                    )}

                    {showPlatforms && platforms.length > 0 && (
                        <PlatformSelector
                            platforms={platforms}
                            value={selectedPlatform}
                            onChange={handlePlatformChange}
                            disabled={disabled || isLoading}
                        />
                    )}

                    <InputGroupText className="ml-auto" />

                    <Separator orientation="vertical" className="h-4 mx-1" />

                    <InputGroupButton
                        variant={isSendDisabled ? "ghost" : "default"}
                        className={cn(
                            "rounded-xl transition-all duration-200",
                            !isSendDisabled && "shadow-sm"
                        )}
                        size={size === "lg" ? "sm" : "icon-sm"}
                        disabled={isSendDisabled}
                        onClick={handleSend}
                    >
                        {isLoading ? (
                            <Spinner className="size-3.5" />
                        ) : (
                            <ArrowUpIcon className="w-4 h-4" />
                        )}
                        <span className="sr-only">{isLoading ? "Sending..." : "Send"}</span>
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>
    )
}

export default ChatInput
