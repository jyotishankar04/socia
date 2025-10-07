"use client"
import { sampleMessages } from '@/components/custom/constants'
import ChatUi from '@/components/custom/editor/chat-ui'
import LoadingModal from '@/components/custom/essenticals/loading-model'
import { SocialPost } from '@/components/custom/socials/social-post'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useConversationCreateMutation, useGetConversation } from '@/lib/query'
import { useAuthStore } from '@/store/auth'
import { Message } from '@/types'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

const Page = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter();
  const post = sampleMessages.filter((m) => m.post).at(-1)
  const { user } = useAuthStore()
  if (!id) {
    router.replace("/app/");
    return
  }
  const { data: conversation, isSuccess, isLoading: conversationLoading } = useGetConversation(id)

  const { mutateAsync, isLoading, isSuccess: createConversationSuccess } = useConversationCreateMutation()
  if (conversationLoading) {
    return <LoadingModal text='Loading conversation' description='This might take a few seconds' />
  }
  const onSendMessage = async (message: string, platform?: string) => {
    if (!conversation) return
  }

  return (
    <div className='h-full w-full'>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={20} className='bg-muted '>
          <div className='flex flex-col gap-2 p-2 items-center overflow-y-auto h-full'>
            <div>
              <h1 className='text-2xl font-bold'>Preview</h1>
            </div>
            <SocialPost variant={isSuccess && conversation.platform} author={{ name: user?.name!, avatar: user?.avatar! }} timestamp={"2 hours ago"} content={"This is a sample post"} engagement={{ reactions: 1200, comments: 10, reposts: 10, views: 10 }} />

          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={20}>
          {isSuccess && <ChatUi onSendMessage={onSendMessage}
            messages={conversation?.data as Message[]} />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default Page