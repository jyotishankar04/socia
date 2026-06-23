"use client"

import ChatUi from '@/components/custom/editor/chat-ui'
import LoadingModal from '@/components/custom/essenticals/loading-model'
import { SocialPost } from '@/components/custom/socials/social-post'
import { PostEditor } from '@/components/custom/editor/post-editor'
import { MediaUpload } from '@/components/custom/editor/media-upload'
import { MediaEditor } from '@/components/custom/editor/media-editor'
import type { MediaItem } from '@/types'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useGetConversation, useAcceptDraft, useUpdatePost } from '@/lib/query'
import { useAuthStore } from '@/store/auth'
import type { Draft, Message } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { FileText, Save, Eye, Pencil } from 'lucide-react'
import { toast } from 'sonner'

const Page = () => {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const { user } = useAuthStore()
    const queryClient = useQueryClient()

    // ALL hooks must be called before any conditional returns
    const { data: conversationData, isSuccess, isLoading: conversationLoading } = useGetConversation(id ?? "")
    const { mutateAsync: acceptDraft } = useAcceptDraft()
    const { mutateAsync: updatePost } = useUpdatePost()

    const [previewContent, setPreviewContent] = useState<string | null>(null)
    const [editedContent, setEditedContent] = useState<string>("")
    const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null)
    const [scrollToMessageId, setScrollToMessageId] = useState<string | null>(null)
    const [media, setMedia] = useState<MediaItem[]>([])
    const [editingImage, setEditingImage] = useState<MediaItem | null>(null)
    const [saving, setSaving] = useState(false)

    // Derived values (useMemo to avoid recomputation on every render)
    const messages: Message[] = useMemo(() =>
        isSuccess ? (conversationData?.data?.messages ?? []) as Message[] : [],
    [isSuccess, conversationData])

    const platform = useMemo(() =>
        ((conversationData?.data?.platform ?? "linkedin") as string).toLowerCase() as "linkedin" | "twitter" | "threads",
    [conversationData])

    const acceptedPost = useMemo(() =>
        messages.find(m => m.role === "ASSISTANT" && m.post?.isAccepted)?.post ?? null,
    [messages])

    const allDrafts: Draft[] = useMemo(() =>
        messages
            .filter(m => m.role === "ASSISTANT" && m.post)
            .map(m => m.post!)
            .sort((a, b) => a.version - b.version),
    [messages])

    const activeDraft = useMemo(() =>
        allDrafts.find(d => d.id === (selectedDraftId ?? acceptedPost?.id)),
    [allDrafts, selectedDraftId, acceptedPost])

    const displayContent = previewContent ?? acceptedPost?.content ?? null
    const activeSelectValue = selectedDraftId ?? acceptedPost?.id ?? ""
    const editorContent = editedContent || activeDraft?.content || ""

    // Load saved media + edited content when switching drafts
    useEffect(() => {
        if (activeDraft) {
            setMedia((activeDraft.media as MediaItem[] | undefined) ?? [])
            setEditedContent(activeDraft.editedContent || "")
        }
    }, [activeDraft?.id])

    const onComplete = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['conversation', id] })
    }, [queryClient, id])

    const handleVersionSelect = useCallback((draftId: string) => {
        const draft = allDrafts.find(d => d.id === draftId)
        if (!draft) return
        setSelectedDraftId(draftId)
        setPreviewContent(draft.content)
        setScrollToMessageId(draft.messageId)
    }, [allDrafts])

    const handleAcceptDraft = useCallback(async (draftId: string) => {
        try {
            if (editedContent || media.length > 0) {
                await updatePost({
                    conversationId: id,
                    postId: draftId,
                    data: {
                        content: editedContent || undefined,
                        media: media.length > 0 ? media : undefined,
                    },
                })
            }
            await acceptDraft({ conversationId: id, postId: draftId })
            toast.success("Draft accepted")
            queryClient.invalidateQueries({ queryKey: ['conversation', id] })
            setSelectedDraftId(draftId)
            setScrollToMessageId(null)
        } catch {
            toast.error("Failed to accept draft")
        }
    }, [acceptDraft, id, queryClient, editedContent, media, updatePost])

    const handleSave = useCallback(async () => {
        if (!selectedDraftId && !acceptedPost?.id) {
            toast.error("No draft selected")
            return
        }
        const draftId = selectedDraftId || acceptedPost!.id
        setSaving(true)
        try {
            await updatePost({
                conversationId: id,
                postId: draftId,
                data: {
                    content: editedContent || undefined,
                    media: media.length > 0 ? media : undefined,
                },
            })
            toast.success("Post saved")
            queryClient.invalidateQueries({ queryKey: ['conversation', id] })
        } catch {
            toast.error("Failed to save post")
        } finally {
            setSaving(false)
        }
    }, [selectedDraftId, acceptedPost, id, editedContent, media, updatePost, queryClient])

    // Conditional returns AFTER all hooks
    if (!id) {
        router.replace("/app/chat")
        return null
    }

    if (conversationLoading) {
        return <LoadingModal text="Loading conversation" description="This might take a few seconds" />
    }

    return (
        <div className="h-full w-full">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel minSize={30} defaultSize={55} className="bg-muted/30">
                    <div className="flex flex-col h-full overflow-y-auto">
                        <div className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm border-b border-border px-4 py-3">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-sm font-semibold text-foreground">Preview</h2>
                                    <p className="text-xs text-muted-foreground capitalize">{platform} post</p>
                                </div>
                                {allDrafts.length > 0 && (
                                    <Select value={activeSelectValue} onValueChange={handleVersionSelect}>
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

                        <div className="flex-1 p-4 space-y-4">
                            <Tabs defaultValue="edit" className="w-full">
                                <TabsList className="w-full justify-start gap-0 bg-transparent p-0 h-auto border-b border-border rounded-none">
                                    <TabsTrigger
                                        value="edit"
                                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3 py-2 text-xs font-medium text-muted-foreground data-[state=active]:text-foreground transition-colors gap-1.5"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                        Edit
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="preview"
                                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3 py-2 text-xs font-medium text-muted-foreground data-[state=active]:text-foreground transition-colors gap-1.5"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        Preview
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="edit" className="mt-4 space-y-4">
                                    <PostEditor
                                        content={editorContent}
                                        onChange={setEditedContent}
                                        placeholder="Edit your post content..."
                                    />
                                    <MediaUpload media={media} onMediaChange={setMedia} onEditImage={setEditingImage} />
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="w-full gap-1.5"
                                        size="sm"
                                    >
                                        <Save className="w-4 h-4" />
                                        {saving ? "Saving..." : "Save Post"}
                                    </Button>
                                </TabsContent>

                                <TabsContent value="preview" className="mt-4">
                                    {displayContent ? (
                                        <div className="w-full max-w-lg mx-auto">
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
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-center py-16 max-w-xs mx-auto">
                                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                                                <FileText className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <p className="text-sm font-medium text-foreground mb-1">No draft selected</p>
                                            <p className="text-xs text-muted-foreground">
                                                Generate a post in the chat, then preview or edit it here.
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={45} minSize={25}>
                    {isSuccess && id && (
                        <ChatUi
                            conversationId={id}
                            messages={messages}
                            onComplete={onComplete}
                            onPreviewDraft={(content) => setPreviewContent(content)}
                            onAcceptDraft={handleAcceptDraft}
                            scrollToMessageId={scrollToMessageId}
                            selectedDraftId={selectedDraftId}
                            platform={platform}
                        />
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>

            <MediaEditor
                item={editingImage}
                open={Boolean(editingImage)}
                onClose={() => setEditingImage(null)}
                onSave={(updated) => {
                    setMedia(prev => prev.map(m => m.id === editingImage?.id ? updated : m))
                    setEditingImage(null)
                }}
            />
        </div>
    )
}

export default Page
