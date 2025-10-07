import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { ArrowUpIcon, Image, Linkedin, Paperclip, PlusIcon, TriangleAlert, Twitter, FileText, Video, Mic } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import React from "react"

interface PlatformOption {
    value: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    disabled?: boolean
    badge?: string
}

interface AttachmentOption {
    value: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    disabled?: boolean
    badge?: string
}

interface ChatInputProps {
    // Content
    placeholder?: string
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void

    // Platforms
    platforms?: PlatformOption[]
    defaultPlatform?: string
    onPlatformChange?: (platform: string) => void
    showPlatforms?: boolean

    // Attachments
    attachmentOptions?: AttachmentOption[]
    onAttachmentSelect?: (attachmentType: string) => void
    showAttachments?: boolean

    // Upgrade Banner
    showUpgradeBanner?: boolean
    upgradeText?: string
    upgradeCta?: string
    onUpgradeClick?: () => void

    // Actions
    onSend?: (message: string, platform?: string) => void
    disabled?: boolean
    sendDisabled?: boolean
    isLoading?: boolean

    // Styling
    className?: string
    variant?: "default" | "minimal"
    size?: "sm" | "md" | "lg"
}

const defaultPlatforms: PlatformOption[] = [
    {
        value: "linkedin",
        label: "LinkedIn",
        icon: Linkedin,
    },
    {
        value: "x",
        label: "X",
        icon: Twitter,
        disabled: true,
        badge: "Soon"
    }
]

export const defaultAttachmentOptions: AttachmentOption[] = [
    {
        value: "files",
        label: "Files",
        icon: Paperclip,
        badge: "Soon"
    },
    {
        value: "images",
        label: "Images",
        icon: Image,
        badge: "Soon"
    },
    {
        value: "documents",
        label: "Documents",
        icon: FileText,
        badge: "Soon"
    },
    {
        value: "video",
        label: "Video",
        icon: Video,
        badge: "Soon"
    },
    {
        value: "audio",
        label: "Audio",
        icon: Mic,
        badge: "Soon"
    }
]

const ChatInput: React.FC<ChatInputProps> = ({
    // Content
    placeholder = "Ask, Search or Chat...",
    value,
    defaultValue,
    onValueChange,

    // Platforms
    platforms = defaultPlatforms,
    defaultPlatform = "linkedin",
    onPlatformChange,
    showPlatforms = true,

    // Attachments
    attachmentOptions = defaultAttachmentOptions,
    onAttachmentSelect,
    showAttachments = true,

    // Upgrade Banner
    showUpgradeBanner = true,
    upgradeText = "Upgrade to Qwikish Pro for more features and support",
    upgradeCta = "Upgrade to Pro",
    onUpgradeClick,

    // Actions
    onSend,
    disabled = false,
    sendDisabled = false,
    isLoading = false,

    // Styling
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
            // Don't clear input if loading, wait for completion
            if (!isLoading) {
                setInputValue("")
            }
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const sizeClasses = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg"
    }

    const spinnerSize = {
        sm: "size-3",
        md: "size-4",
        lg: "size-4"
    }

    const isSendButtonDisabled = disabled || sendDisabled || isLoading || !inputValue.trim()

    return (
        <div className={cn(
            "rounded-lg w-full max-w-3xl",
            variant === "default" && "bg-accent/60 p-1 pt-0",
            variant === "minimal" && "bg-background border",
            disabled && "opacity-50 cursor-not-allowed",
            className
        )}>
            {/* Upgrade Banner */}
            {showUpgradeBanner && (
                <div className="flex justify-between items-center p-3 pb-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TriangleAlert className="w-4 h-4" />
                        <span>
                            {upgradeText.includes("Qwikish Pro") ? (
                                <>
                                    Upgrade to <span className="text-primary font-medium">Qwikish Pro</span> for more features and support
                                </>
                            ) : (
                                upgradeText
                            )}
                        </span>
                    </div>
                    {onUpgradeClick && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onUpgradeClick}
                            className="text-primary hover:text-primary/80 font-medium"
                        >
                            {upgradeCta}
                        </Button>
                    )}
                </div>
            )}

            {/* Input Area */}
            <InputGroup className="w-full">
                <InputGroupTextarea
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={cn(sizeClasses[size], "resize-none")}
                    rows={size === "sm" ? 2 : size === "md" ? 3 : 4}
                    disabled={disabled || isLoading}
                />

                <InputGroupAddon align="block-end">
                    {/* Attachment Menu */}
                    {showAttachments && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild disabled={disabled || isLoading}>
                                <InputGroupButton
                                    variant="outline"
                                    className="rounded-full"
                                    size="icon-xs"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                </InputGroupButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="start"
                                className="w-48 [--radius:0.95rem]"
                            >
                                {attachmentOptions.map((option) => (
                                    <DropdownMenuItem
                                        key={option.value}
                                        disabled={option.disabled || isLoading}
                                        onClick={() => onAttachmentSelect?.(option.value)}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <option.icon className="w-4 h-4" />
                                            <span>{option.label}</span>
                                        </div>
                                        {option.badge && (
                                            <Badge variant="secondary" className="text-xs">
                                                {option.badge}
                                            </Badge>
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* Platform Selector */}
                    {showPlatforms && (
                        <Select
                            value={selectedPlatform}
                            onValueChange={handlePlatformChange}
                            disabled={disabled || isLoading}
                        >
                            <SelectTrigger size="sm" className="min-w-[120px]">
                                <SelectValue placeholder="Platform" />
                            </SelectTrigger>
                            <SelectContent side="top">
                                <SelectGroup>
                                    <SelectLabel>Platforms</SelectLabel>
                                    {platforms.map((platform) => (
                                        <SelectItem
                                            key={platform.value}
                                            value={platform.value}
                                            disabled={platform.disabled || isLoading}
                                        >
                                            <div className="flex items-center gap-2">
                                                <platform.icon className="w-4 h-4" />
                                                <span>{platform.label}</span>
                                                {platform.badge && (
                                                    <Badge variant="secondary" className="ml-auto text-xs">
                                                        {platform.badge}
                                                    </Badge>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}

                    <InputGroupText className="ml-auto" />

                    <Separator orientation="vertical" className="h-4" />

                    {/* Send Button */}
                    <InputGroupButton
                        variant={isLoading ? "secondary" : "default"}
                        className={cn(
                            "rounded-full transition-all duration-200",
                            isLoading && "bg-primary/80"
                        )}
                        size="icon-xs"
                        disabled={isSendButtonDisabled}
                        onClick={handleSend}
                    >
                        {isLoading ? (
                            <Spinner className={cn(spinnerSize[size], "text-primary-foreground")} />
                        ) : (
                            <ArrowUpIcon className="w-4 h-4" />
                        )}
                        <span className="sr-only">
                            {isLoading ? "Sending..." : "Send"}
                        </span>
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>
    )
}

export default ChatInput