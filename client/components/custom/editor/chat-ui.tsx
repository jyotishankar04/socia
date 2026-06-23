"use client"

import { useIsMobile } from '@/hooks/use-mobile'
import { useStreamMessage } from '@/hooks/use-stream-message'
import React from 'react'
import ChatInput from '../app/chat-input'
import ChatMessages from './chat-messages'
import { AiSuggestions } from './ai-suggestions'
import type { Message } from '@/types'
import { useForm } from 'react-hook-form'
import { MonitorSmartphone, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ChatFormValues {
    message: string
    platform: string
}

interface Props {
    conversationId: string
    messages: Message[] | undefined
    onComplete: () => void
    onPreviewDraft?: (content: string) => void
    onAcceptDraft?: (draftId: string) => void
    scrollToMessageId?: string | null
    selectedDraftId?: string | null
    platform?: string
}

const ChatUi: React.FC<Props> = ({
    conversationId,
    messages,
    onComplete,
    onPreviewDraft,
    onAcceptDraft,
    scrollToMessageId,
    selectedDraftId,
    platform,
}) => {
    const acceptedDraftId = messages?.find(m => m.role === "ASSISTANT" && m.post?.isAccepted)?.post?.id
    const activeDraftId = selectedDraftId ?? acceptedDraftId
    const isMobile = useIsMobile()
    const { sendMessage, isStreaming, currentStep, currentSources, liveSearches } = useStreamMessage(conversationId)

    const { reset, setValue, watch } = useForm<ChatFormValues>({
        defaultValues: { message: '', platform: 'linkedin' }
    })

    const handleInputSend = (message: string) => {
        if (message.trim() && !isStreaming) {
            sendMessage(message, onComplete)
            reset()
        }
    }

    const handleSuggestionClick = (suggestion: string) => {
        setValue('message', suggestion)
    }

    if (isMobile) {
        return (
            <div className="w-full h-full bg-background flex items-center justify-center p-6">
                <div className="text-center space-y-5 max-w-xs">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto ring-1 ring-primary/20">
                        <MonitorSmartphone className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-foreground">Desktop Recommended</h3>
                        <p className="text-sm text-muted-foreground mt-1.5">
                            The editor is optimized for larger screens. For the best experience, open on a desktop or tablet.
                        </p>
                    </div>
                    <Link href="/app/chat">
                        <Button variant="outline" size="sm" className="gap-1.5">
                            <ArrowLeft className="w-4 h-4" />
                            Back to chat
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-full bg-background flex flex-col">
            <div className="flex-1 min-h-0 overflow-hidden">
                <ChatMessages
                    messages={messages ?? []}
                    isLoading={isStreaming}
                    currentStep={currentStep}
                    currentSources={currentSources}
                    liveSearches={liveSearches}
                    onSuggestionClick={handleSuggestionClick}
                    onPreviewDraft={onPreviewDraft}
                    onAcceptDraft={onAcceptDraft}
                    scrollToMessageId={scrollToMessageId}
                    selectedDraftId={selectedDraftId}
                />
            </div>

            {activeDraftId && (
                <AiSuggestions chatId={conversationId} draftId={activeDraftId} platform={platform} />
            )}

            <div className="flex-shrink-0 p-3 border-t border-border bg-background/95 backdrop-blur-sm">
                <ChatInput
                    value={watch('message')}
                    onValueChange={(val) => setValue('message', val)}
                    onSend={handleInputSend}
                    isLoading={isStreaming}
                    disabled={isStreaming}
                    showUpgradeBanner={false}
                    showPlatforms={false}
                    showAttachments={false}
                    variant="minimal"
                    defaultPlatform="linkedin"
                    placeholder="Refine the post, change the tone, or ask a question…"
                />
            </div>
        </div>
    )
}

export default ChatUi
