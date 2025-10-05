"use client"

import { useIsMobile } from '@/hooks/use-mobile'
import React from 'react'
import ChatInput from '../app/chat-input'
import ChatMessages, { Message } from './chat-messages'
import { sampleMessages } from '../constants'
import { ScrollArea } from '@/components/ui/scroll-area'

const ChatUi = () => {
    const isMobile = useIsMobile()
    if (isMobile) {
        return (
            <div className='w-full h-full bg-muted'>
                Mobile view not supported
            </div>
        )
    }
    return (
        <div className='w-full h-full bg-background p-2'>
            <div className='h-full flex flex-col gap-2'>
                <ScrollArea className='flex-1 overflow-auto'>
                    <div className='h-full  max-w-xl mx-auto'>
                        <ChatMessages messages={sampleMessages as Message[]} />
                    </div>
                </ScrollArea>
                <div className='max-w-xl mx-auto  flex items-center'>
                    <ChatInput />
                </div>
            </div>
        </div>
    )
}

export default ChatUi