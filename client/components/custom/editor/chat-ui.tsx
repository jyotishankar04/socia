"use client"

import { useIsMobile } from '@/hooks/use-mobile'
import React from 'react'
import ChatInput, { defaultAttachmentOptions } from '../app/chat-input'
import ChatMessages from './chat-messages'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Message } from '@/types'
import { useForm } from 'react-hook-form'
import { DownloadCloud, FilesIcon, ImagesIcon, Linkedin, Twitter } from 'lucide-react'
import { IconBrandThreads } from '@tabler/icons-react'

interface ChatFormValues {
    message: string
    platform: string
}

interface Props {
    messages: Message[] | undefined
    onSendMessage: (message: string, platform: string) => Promise<void> | void
    isSending?: boolean
}

const ChatUi: React.FC<Props> = ({ messages, onSendMessage, isSending = false }) => {
    const isMobile = useIsMobile()

    const { handleSubmit, reset, setValue, watch } = useForm<ChatFormValues>({
        defaultValues: {
            message: '',
            platform: 'linkedin'
        }
    })

    const handleSend = async (data: ChatFormValues) => {
        if (!data.message.trim()) return

        await onSendMessage(data.message, data.platform)
        reset() // Clear the input after sending
    }

    const handleInputSend = (message: string, platform?: string) => {
        const currentPlatform = platform || watch('platform')
        handleSubmit(() => onSendMessage(message, currentPlatform))()
        reset()
    }

    const handleValueChange = (value: string) => {
        setValue('message', value)
    }

    if (isMobile) {
        return (
            <div className='w-full h-full bg-muted flex items-center justify-center'>
                <div className='text-center p-4'>
                    <h3 className='text-lg font-semibold text-muted-foreground mb-2'>
                        Mobile View
                    </h3>
                    <p className='text-sm text-muted-foreground'>
                        Chat interface is optimized for desktop. Please use a larger screen for the best experience.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className='w-full h-full bg-background p-4'>
            <div className='h-full flex flex-col gap-4 max-w-4xl mx-auto'>
                {/* Messages Area */}
                <ScrollArea className='flex-1'>
                        {messages && messages.length > 0 ? (
                            <ChatMessages messages={messages} />
                        ) : (
                            <div className='flex items-center justify-center h-32 text-muted-foreground'>
                                <p>No messages yet. Start a conversation!</p>
                            </div>
                        )}
                </ScrollArea>

                {/* Input Area */}
                <div className='flex-shrink-0 '>
                    <ChatInput
                        value={watch('message')}
                        onValueChange={handleValueChange}
                        onSend={handleInputSend}
                        isLoading={isSending}
                        disabled={isSending}
                        showUpgradeBanner={true}
                        showPlatforms={false}
                        variant="minimal"
                        attachmentOptions={defaultAttachmentOptions}
                        defaultPlatform='linkedin'
                    />
                </div>
            </div>
        </div>
    )
}

export default ChatUi