import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    ThumbsUp,
    MessageSquare,
    Share2,
    Send,
    Repeat2,
    Heart,
    BarChart3,
    Bookmark,
    MoreHorizontal,
    Play,
} from "lucide-react"
import Image from "next/image"
import { BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MediaItem } from "@/types"

interface SocialPostProps {
    variant?: "linkedin" | "twitter" | "threads" | false
    author: {
        name: string
        avatar: string
        subtitle?: string
        username?: string
        isFollowing?: boolean
        isVerified?: boolean
    }
    timestamp: string
    content: string
    image?: string
    media?: MediaItem[]
    engagement: {
        reactions: number
        comments: number
        reposts: number
        views?: number
    }
    hashtags?: string[]
}

const twitterActions = [
    { icon: MessageSquare, color: "hover:text-blue-500 hover:bg-blue-500/10" },
    { icon: Repeat2, color: "hover:text-emerald-500 hover:bg-emerald-500/10" },
    { icon: Heart, color: "hover:text-rose-500 hover:bg-rose-500/10" },
    { icon: BarChart3, color: "hover:text-blue-500 hover:bg-blue-500/10" },
    { icon: Bookmark, color: "hover:text-blue-500 hover:bg-blue-500/10" },
]

const sharedActions = [
    { icon: ThumbsUp, label: "Like" },
    { icon: MessageSquare, label: "Comment" },
    { icon: Share2, label: "Repost" },
    { icon: Send, label: "Send" },
]

function MediaGrid({ media, singleImage }: { media: MediaItem[]; singleImage?: string }) {
    const items: MediaItem[] = media.length > 0
        ? media
        : singleImage
            ? [{ id: "legacy", name: "image", url: singleImage, type: "image", size: 0 }]
            : []

    if (items.length === 0) return null

    const count = Math.min(items.length, 4)
    const shown = items.slice(0, 4)
    const extra = items.length - 4

    if (count === 1) {
        return <MediaTile item={shown[0]} className="w-full aspect-[4/3]" />
    }

    if (count === 2) {
        return (
            <div className="grid grid-cols-2 gap-0.5">
                {shown.map(item => <MediaTile key={item.id} item={item} className="aspect-square" />)}
            </div>
        )
    }

    if (count === 3) {
        return (
            <div className="grid grid-cols-2 gap-0.5">
                <MediaTile item={shown[0]} className="row-span-2 aspect-[3/4]" />
                <MediaTile item={shown[1]} className="aspect-square" />
                <MediaTile item={shown[2]} className="aspect-square" />
            </div>
        )
    }

    // 4+
    return (
        <div className="grid grid-cols-2 gap-0.5">
            {shown.map((item, i) => (
                <div key={item.id} className="relative">
                    <MediaTile item={item} className="aspect-square" />
                    {i === 3 && extra > 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-sm">
                            <span className="text-white text-lg font-bold">+{extra}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

function MediaTile({ item, className }: { item: MediaItem; className?: string }) {
    if (item.type === "video") {
        return (
            <div className={cn("relative bg-black flex items-center justify-center overflow-hidden rounded-sm", className)}>
                <Play className="w-10 h-10 text-white/80" />
                <span className="absolute bottom-1 left-1 text-[10px] text-white/70 bg-black/40 px-1 rounded">Video</span>
            </div>
        )
    }
    return (
        <div className={cn("relative overflow-hidden rounded-sm bg-muted", className)}>
            <Image src={item.url} alt={item.name} fill className="object-cover" unoptimized />
        </div>
    )
}

export function SocialPost({
    variant = "linkedin",
    author,
    timestamp,
    content,
    image,
    media = [],
    engagement,
    hashtags = [],
}: SocialPostProps) {
    const hasContent = Boolean(content)
    const hasMedia = media.length > 0 || Boolean(image)

    if (variant === "threads") {
        return (
            <Card className="w-full max-w-2xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 ring-2 ring-red-500/20">
                            <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                            <AvatarFallback className="text-xs font-medium">{author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-semibold text-sm">{author.name}</h3>
                            {author.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />}
                            <span className="text-muted-foreground text-sm">· {timestamp}</span>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="hover:bg-accent h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>
                <div className="px-4 pb-3">
                    {hasContent ? (
                        <div className="text-sm leading-relaxed whitespace-pre-line">{content}</div>
                    ) : (
                        <div className="text-sm text-muted-foreground italic">Your post will appear here…</div>
                    )}
                    {hashtags.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                            {hashtags.map((tag) => (
                                <span key={tag} className="text-sm text-blue-500">{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
                {hasMedia && (
                    <div className="overflow-hidden">
                        <MediaGrid media={media} singleImage={image} />
                    </div>
                )}
                <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                    <div className="flex items-center gap-4">
                        {[Heart, MessageSquare, Share2].map((Icon, i) => (
                            <Button key={i} variant="ghost" size="icon" className="hover:bg-accent h-7 w-7 p-0">
                                <Icon className="w-5 h-5" />
                            </Button>
                        ))}
                    </div>
                    <Button variant="ghost" size="icon" className="hover:bg-accent h-7 w-7 p-0">
                        <Bookmark className="w-5 h-5" />
                    </Button>
                </div>
                <div className="px-4 pb-3">
                    <span className="text-sm font-semibold">{engagement.reactions.toLocaleString()} likes</span>
                </div>
            </Card>
        )
    }

    if (variant === "twitter") {
        return (
            <Card className={cn(
                "w-full max-w-2xl overflow-hidden shadow-sm",
                !hasContent && "border-dashed border-muted-foreground/30 opacity-70"
            )}>
                <div className="flex items-start gap-3 p-4">
                    <Avatar className="h-10 w-10 ring-1 ring-border">
                        <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                        <AvatarFallback className="text-xs font-medium">{author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 flex-wrap">
                            <h3 className="font-bold text-[15px]">{author.name}</h3>
                            {author.isVerified && <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500" />}
                            <span className="text-muted-foreground text-[15px]">{author.username}</span>
                            <span className="text-muted-foreground text-[15px]">· {timestamp}</span>
                        </div>
                        <div className="mt-1.5 text-[15px] leading-relaxed whitespace-pre-line">
                            {hasContent ? content : <span className="text-muted-foreground italic">Your post will appear here…</span>}
                        </div>
                        {hasMedia && (
                            <div className="mt-3 rounded-2xl overflow-hidden border border-border">
                                <MediaGrid media={media} singleImage={image} />
                            </div>
                        )}
                        <div className="flex items-center justify-between mt-3 max-w-md">
                            {twitterActions.map(({ icon: Icon, color }, i) => (
                                <Button
                                    key={i}
                                    variant="ghost"
                                    size="sm"
                                    className={cn("text-muted-foreground h-8 px-2", color)}
                                >
                                    <Icon className="w-[18px] h-[18px]" />
                                </Button>
                            ))}
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent h-8 w-8 shrink-0">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <Card className={cn(
            "w-full max-w-2xl overflow-hidden shadow-sm",
            !hasContent && "border-dashed border-muted-foreground/30 opacity-70"
        )}>
            <div className="flex items-start justify-between p-4 pb-3">
                <div className="flex gap-3">
                    <Avatar className="h-12 w-12 ring-1 ring-border">
                        <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                        <AvatarFallback className="text-sm font-medium">{author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm text-foreground">{author.name}</h3>
                            {author.isFollowing && (
                                <span className="text-xs text-muted-foreground">· Following</span>
                            )}
                        </div>
                        {author.subtitle && (
                            <p className="text-xs text-muted-foreground leading-relaxed">{author.subtitle}</p>
                        )}
                        <span className="text-xs text-muted-foreground mt-0.5">{timestamp}</span>
                    </div>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 h-8">
                    + Follow
                </Button>
            </div>
            <div className="px-4 pb-3">
                {hasContent ? (
                    <div className="text-sm leading-relaxed whitespace-pre-line text-foreground">{content}</div>
                ) : (
                    <div className="text-sm text-muted-foreground italic">Your generated post will appear here…</div>
                )}
                {hashtags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {hashtags.map((tag) => (
                            <span key={tag} className="text-sm text-blue-600 dark:text-blue-400">{tag}</span>
                        ))}
                    </div>
                )}
            </div>
            {hasMedia && (
                <div className="overflow-hidden">
                    <MediaGrid media={media} singleImage={image} />
                </div>
            )}
            <div className="px-4 py-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                        <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
                    </div>
                    <span>{engagement.reactions.toLocaleString()}</span>
                </div>
                <div className="flex gap-3 text-xs">
                    <span>{engagement.comments} comments</span>
                    <span>· {engagement.reposts} reposts</span>
                    {engagement.views != null && engagement.views > 0 && (
                        <span>· {(engagement.views / 1000).toFixed(1)}K views</span>
                    )}
                </div>
            </div>
            <div className="px-4 py-1.5 flex items-center justify-around border-t border-border">
                {sharedActions.map(({ icon: Icon, label }, i) => (
                    <Button
                        key={i}
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg h-9"
                    >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{label}</span>
                    </Button>
                ))}
            </div>
        </Card>
    )
}
