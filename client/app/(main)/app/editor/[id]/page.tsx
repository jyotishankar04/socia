"use client"

import ChatUi from '@/components/custom/editor/chat-ui'
import LoadingModal from '@/components/custom/essenticals/loading-model'
import { SocialPost } from '@/components/custom/socials/social-post'
import { MediaUpload } from '@/components/custom/editor/media-upload'
import { MediaEditor } from '@/components/custom/editor/media-editor'
import { GenerateImagesButton } from '@/components/custom/media/generate-images-button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetConversation, useUpdatePost } from '@/lib/query'
import { useAuthStore } from '@/store/auth'
import type { Draft, Message, MediaItem } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { FileText } from 'lucide-react'

const Page = () => {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const { user } = useAuthStore()
    const queryClient = useQueryClient()
    const { mutate: updatePost } = useUpdatePost()

    const { data: conversationData, isSuccess, isLoading: conversationLoading } = useGetConversation(id ?? "")

    const [previewContent, setPreviewContent] = useState<string | null>(null)
    const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null)
    const [scrollToMessageId, setScrollToMessageId] = useState<string | null>(null)
    const [media, setMedia] = useState<MediaItem[]>([])
    const [editingImage, setEditingImage] = useState<MediaItem | null>(null)

    const messages: Message[] = isSuccess ? (conversationData?.data?.messages ?? []) as Message[] : []
    const platform = ((conversationData?.data?.platform ?? "linkedin") as string).toLowerCase() as "linkedin" | "twitter" | "threads"

    const acceptedPost = messages.find(m => m.role === "ASSISTANT" && m.post?.isAccepted)?.post ?? null
    const acceptedPostContent = acceptedPost?.content ?? null

    const allDrafts: Draft[] = messages
        .filter(m => m.role === "ASSISTANT" && m.post)
        .map(m => m.post!)
        .sort((a, b) => a.version - b.version)

    const displayContent = previewContent ?? acceptedPostContent
    const activeDraftId = selectedDraftId ?? acceptedPost?.id ?? ""
    const activeDraft = allDrafts.find(d => d.id === activeDraftId) ?? null

    // Sync media from the currently selected draft — must be before conditional returns
    useEffect(() => {
        if (activeDraft?.media && activeDraft.media.length > 0) {
            setMedia(activeDraft.media as MediaItem[])
        } else {
            setMedia([])
        }
    }, [activeDraftId])

    if (!id) {
        router.replace("/app/")
        return null
    }

    if (conversationLoading) {
        return <LoadingModal text="Loading conversation" description="This might take a few seconds" />
    }

    const onComplete = () => {
        queryClient.invalidateQueries({ queryKey: ['conversation', id] })
    }

    const handlePreviewDraft = (content: string) => {
        setPreviewContent(content)
    }

    const handleVersionSelect = (draftId: string) => {
        const draft = allDrafts.find(d => d.id === draftId)
        if (!draft) return
        setSelectedDraftId(draftId)
        setPreviewContent(draft.content)
        setScrollToMessageId(draft.messageId)
    }

    const handleMediaChange = (newMedia: MediaItem[]) => {
        setMedia(newMedia)
        if (!activeDraftId) return
        updatePost({
            conversationId: id,
            postId: activeDraftId,
            data: { media: newMedia as unknown[] },
        })
    }

    const handleImageEdited = (updated: MediaItem) => {
        const newMedia = media.map(m => m.id === editingImage?.id ? updated : m)
        handleMediaChange(newMedia)
        setEditingImage(null)
    }

    return (
        <div className="h-full w-full">
            <ResizablePanelGroup direction="horizontal">
                {/* Preview Panel */}
                <ResizablePanel minSize={25} defaultSize={55} className="bg-muted/30">
                    <div className="flex flex-col h-full overflow-y-auto">
                        <div className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm border-b border-border px-4 py-3">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-sm font-semibold text-foreground">Preview</h2>
                                    <p className="text-xs text-muted-foreground capitalize">{platform} post</p>
                                </div>

                                {allDrafts.length > 0 && (
                                    <Select
                                        value={activeDraftId}
                                        onValueChange={handleVersionSelect}
                                    >
                                        <SelectTrigger className="h-8 text-xs w-36">
                                            <SelectValue placeholder="Select version" />
                                        </SelectTrigger>
                                        <SelectContent align="end">
                                            {allDrafts.map(draft => (
                                                <SelectItem key={draft.id} value={draft.id} className="text-xs">
                                                    v{draft.version}
                                                    {draft.isAccepted ? " ✓ Accepted" : ""}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 flex items-start justify-center p-6">
                            {displayContent ? (
                                <div className="w-full max-w-lg space-y-4">
                                    <SocialPost
                                        variant={platform}
                                        author={{
                                            name: user?.name ?? "Your Name",
                                            avatar: user?.avatar ?? "",
                                            subtitle: "Content Creator · Qwikish Socia",
                                        }}
                                        timestamp="Just now"
                                        content={displayContent}
                                        media={media}
                                        hashtags={[]}
                                        engagement={{ reactions: 0, comments: 0, reposts: 0, views: 0 }}
                                    />

                                    {/* Media upload panel – only show when a draft is selected */}
                                    {activeDraftId && (
                                        <>
                                            <MediaUpload
                                                media={media}
                                                onMediaChange={handleMediaChange}
                                                onEditImage={setEditingImage}
                                            />
                                            <GenerateImagesButton chatId={id} draftId={activeDraftId} />
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center py-16 max-w-xs">
                                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                                        <FileText className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground mb-1">No draft accepted yet</p>
                                    <p className="text-xs text-muted-foreground">
                                        Generate a post in the chat, then click <strong>Preview</strong> or <strong>Accept Draft</strong>.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Chat Panel */}
                <ResizablePanel defaultSize={45} minSize={25}>
                    {isSuccess && id && (
                        <ChatUi
                            conversationId={id}
                            messages={messages}
                            onComplete={onComplete}
                            onPreviewDraft={handlePreviewDraft}
                            scrollToMessageId={scrollToMessageId}
                            selectedDraftId={selectedDraftId}
                        />
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>

            {/* Image editor modal */}
            <MediaEditor
                item={editingImage}
                open={Boolean(editingImage)}
                onClose={() => setEditingImage(null)}
                onSave={handleImageEdited}
            />
        </div>
    )
}

export default Page
