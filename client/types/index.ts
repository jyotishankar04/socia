export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface SourceRef {
    title: string;
    url: string;
    domain: string;
}

export interface ResourceItem {
    type: "web" | "url" | "person" | "platform" | "trend";
    title: string;
    url?: string;
    query?: string;
    refs?: SourceRef[];
}

export interface SearchItem {
    label: string;
    query: string;
    icon: "web" | "url" | "person" | "platform" | "trend";
}

export interface Conversation {
    id: string;
    userId: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface MediaItem {
    id: string;
    name: string;
    url: string;
    type: "image" | "video";
    size: number;
    width?: number;
    height?: number;
}

export interface Draft {
    id: string;
    conversationId: string;
    messageId: string;
    content: string;
    editedContent?: string | null;
    platform: string;
    hashtags: string[];
    version: number;
    isAccepted: boolean;
    isLastConversationPost: boolean;
    status: string;
    media?: MediaItem[];
    createdAt: Date;
    updatedAt: Date;
}

export type MediaAssetType = "IMAGE" | "VIDEO" | "DOCUMENT" | "BANNER" | "CAROUSEL" | "THUMBNAIL";
export type MediaSource = "GENERATED" | "UPLOADED";
export type ToolType = "MOVE" | "BRUSH" | "ERASER" | "RECTANGLE";

export interface CarouselSlideStyle {
    bgColor: string;
    accentColor: string;
    textColor: string;
    badgeStyle: "square" | "circle" | "brushstroke" | "pill";
    presetName: string;
}

export interface CarouselSlide {
    slide: number;
    title: string;
    body: string;
    imageUrl: string;
    assetId: string;
    visual_concept?: string;
    style?: CarouselSlideStyle;
}

export interface MediaAsset {
    id: string;
    userId: string;
    name: string;
    url: string;
    type: MediaAssetType;
    source: MediaSource;
    size?: number;
    width?: number;
    height?: number;
    metadata?: {
        prompt?: string;
        revisedPrompt?: string;
        model?: string;
        context?: { chatId?: string; draftId?: string };
        slides?: CarouselSlide[];
        [key: string]: unknown;
    };
    isFavorite: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface MediaLibraryResponse {
    items: MediaAsset[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export interface Message {
    id: string;
    conversationId: string;
    content: string;
    role: "USER" | "ASSISTANT";
    metadata?: {
        score?: number | null;
        iterations?: number;
        platform?: string | null;
        tone?: string | null;
        post?: string;
        postId?: string;
        contextSources?: string[];
        resources?: ResourceItem[];
        [key: string]: unknown;
    };
    post?: Draft | null;
    createdAt: Date;
    updatedAt: Date;
}
