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
} from "lucide-react"
import Image from "next/image"
import { BadgeCheck } from "lucide-react"

interface SocialPostProps {
    variant?: "linkedin" | "twitter" | "threads"
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
    engagement: {
        reactions: number
        comments: number
        reposts: number
        views?: number
    }
    hashtags?: string[]
}

export function SocialPost({
    variant = "linkedin",
    author,
    timestamp,
    content,
    image,
    engagement,
    hashtags = [],
}: SocialPostProps) {
    // Instagram variant support
    if (variant === "threads") {
        return (
            <Card className="w-full max-w-2xl overflow-hidden border-border bg-card text-card-foreground">
                {/* Header */}
                <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 ring-2 ring-red-500">
                            <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-1.5">
                            <h3 className="font-semibold text-sm">{author.name}</h3>
                            {author.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />}
                            <span className="text-muted-foreground text-sm">· {timestamp}</span>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="hover:bg-accent h-8 w-8">
                        <MoreHorizontal className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="px-3 pb-2">
                    <div className="text-sm leading-relaxed whitespace-pre-line">{content}</div>
                    {hashtags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                            {hashtags.map((tag, index) => (
                                <span key={index} className="text-sm text-blue-500">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Image */}
                {image && (
                    <div className="relative w-full aspect-square bg-muted">
                        <Image src={image || "/placeholder.svg"} alt="Post content" fill className="object-cover" />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between px-3 py-2.5">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="hover:bg-accent h-7 w-7 p-0">
                            <Heart className="w-6 h-6" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-accent h-7 w-7 p-0">
                            <MessageSquare className="w-6 h-6" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-accent h-7 w-7 p-0">
                            <Send className="w-6 h-6" />
                        </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="hover:bg-accent h-7 w-7 p-0">
                        <Bookmark className="w-6 h-6" />
                    </Button>
                </div>

                {/* Engagement Stats */}
                <div className="px-3 pb-3">
                    <span className="text-sm font-semibold">{engagement.reactions} likes</span>
                </div>
            </Card>
        )
    }

    // Twitter/X variant support
    if (variant === "twitter") {
        return (
            <Card className="w-full max-w-2xl overflow-hidden border-border bg-card text-card-foreground">
                {/* Header */}
                <div className="flex items-start gap-3 p-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                        <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center gap-1">
                            <h3 className="font-bold text-[15px]">{author.name}</h3>
                            {author.isVerified && <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500" />}
                            <span className="text-muted-foreground text-[15px]">{author.username}</span>
                            <span className="text-muted-foreground text-[15px]">· {timestamp}</span>
                        </div>

                        {/* Content */}
                        <div className="mt-2 text-[15px] leading-relaxed whitespace-pre-line">{content}</div>

                        {/* Image */}
                        {image && (
                            <div className="relative w-full aspect-[4/3] bg-muted mt-3 rounded-2xl overflow-hidden border border-border">
                                <Image src={image || "/placeholder.svg"} alt="Post content" fill className="object-cover" />
                            </div>
                        )}

                        {/* Engagement Stats */}
                        <div className="flex items-center gap-4 mt-3 text-[13px] text-muted-foreground">
                            <span>{engagement.comments}</span>
                            <span>{engagement.reposts}</span>
                            <span>{engagement.reactions}</span>
                            {engagement.views && <span>{(engagement.views / 1000).toFixed(1)}K</span>}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between mt-3 max-w-md">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 h-8 px-2"
                            >
                                <MessageSquare className="w-[18px] h-[18px]" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2 text-muted-foreground hover:text-green-500 hover:bg-green-500/10 h-8 px-2"
                            >
                                <Repeat2 className="w-[18px] h-[18px]" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2 text-muted-foreground hover:text-pink-500 hover:bg-pink-500/10 h-8 px-2"
                            >
                                <Heart className="w-[18px] h-[18px]" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 h-8 px-2"
                            >
                                <BarChart3 className="w-[18px] h-[18px]" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 h-8 px-2"
                            >
                                <Bookmark className="w-[18px] h-[18px]" />
                            </Button>
                        </div>
                    </div>

                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent h-8 w-8">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="19" r="2" />
                        </svg>
                    </Button>
                </div>
            </Card>
        )
    }

    // LinkedIn variant (original)
    return (
        <Card className="w-full max-w-2xl overflow-hidden border-gray-200 bg-white text-gray-900">
            {/* Header */}
            <div className="flex items-start justify-between p-4 pb-3">
                <div className="flex gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                        <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm text-gray-900">{author.name}</h3>
                            {author.isFollowing && <span className="text-xs text-gray-600">• Following</span>}
                        </div>
                        {author.subtitle && <p className="text-xs text-gray-600 leading-relaxed">{author.subtitle}</p>}
                        <span className="text-xs text-gray-600 mt-0.5">{timestamp}</span>
                    </div>
                </div>
                {!author.isFollowing && (
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        + Follow
                    </Button>
                )}
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
                <div className="text-sm leading-relaxed whitespace-pre-line text-gray-900">{content}</div>
                {hashtags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {hashtags.map((tag, index) => (
                            <span key={index} className="text-sm text-blue-600">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Image */}
            {image && (
                <div className="relative w-full aspect-[4/3] bg-gray-100">
                    <Image src={image || "/placeholder.svg"} alt="Post content" fill className="object-cover" />
                </div>
            )}

            {/* Engagement Stats */}
            <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-600 border-b border-gray-200">
                <div className="flex items-center gap-1">
                    <div className="flex -space-x-1">
                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                            <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
                        </div>
                    </div>
                    <span>Devang kartik and {engagement.reactions.toLocaleString()} others</span>
                </div>
                <div className="flex gap-3">
                    <span>{engagement.comments} comments</span>
                    <span>• {engagement.reposts} reposts</span>
                    {engagement.views && <span>• {(engagement.views / 1000).toFixed(1)}K views</span>}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-4 py-2 flex items-center justify-around">
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Like</span>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm font-medium">Comment</span>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Report</span>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                    <Send className="w-4 h-4" />
                    <span className="text-sm font-medium">Send</span>
                </Button>
            </div>
        </Card>
    )
}
