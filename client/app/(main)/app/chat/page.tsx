"use client"

import ChatInput from "@/components/custom/app/chat-input"
import WelcomeSection from "@/components/custom/app/welcome"
import Features from "@/components/custom/app/features"
import { IconBrandLinkedin, IconBrandThreads, IconBrandX } from "@tabler/icons-react"
import { useConversationCreateMutation } from "@/lib/query"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

export default function ChatPage() {
    const { mutateAsync, data, isPending, isSuccess } = useConversationCreateMutation()
    const queryClient = useQueryClient()
    const router = useRouter()

    const handleSend = async (message: string, platform?: string) => {
        if (!platform) return
        await mutateAsync({ content: message, platform })
    }

    useEffect(() => {
        if (isSuccess) {
            router.replace(`/app/chat/${data?.data.conversationId}`)
            queryClient.invalidateQueries({ queryKey: ['conversations'] })
        }
    }, [isSuccess, data, router, queryClient])

    return (
        <div className="flex flex-col gap-8 p-6 w-full h-full items-center">
            <div className="max-w-3xl w-full flex flex-col items-center justify-center gap-12 pt-12 pb-4">
                <WelcomeSection />
                <ChatInput
                    isLoading={isPending || isSuccess}
                    variant="default"
                    onSend={handleSend}
                    showUpgradeBanner={false}
                    showAttachments={false}
                    platforms={[
                        { value: 'linkedin', label: 'LinkedIn', icon: IconBrandLinkedin },
                        { value: 'x', label: 'X', icon: IconBrandX, disabled: true, badge: "Soon" },
                        { value: 'threads', label: 'Threads', icon: IconBrandThreads, disabled: true, badge: "Soon" },
                    ]}
                />
            </div>
            <div className="w-full max-w-4xl">
                <Features />
            </div>
        </div>
    )
}
