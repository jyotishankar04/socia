import { sampleMessages } from '@/components/custom/constants'
import ChatUi from '@/components/custom/editor/chat-ui'
import { SocialPost } from '@/components/custom/socials/social-post'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import React from 'react'

const Page = () => {
  const post = sampleMessages.filter((m) => m.post).at(-1)
  return (
    <div className='h-full w-full'>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={20} className='bg-muted '>
          <div className='flex flex-col gap-2 p-2 items-center overflow-y-auto h-full'>
            <div>
              <h1 className='text-2xl font-bold'>Preview</h1>
            </div>
            <SocialPost variant='linkedin' author={{ name: "Jyotishankar Patra", avatar: "/placeholder.svg" }} timestamp={"2 hours ago"} content={post?.post?.content!} engagement={{ reactions: 1200, comments: 10, reposts: 10, views: 10 }} />

          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={20}>
          <ChatUi />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default Page