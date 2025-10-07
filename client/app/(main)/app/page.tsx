"use client"

import ChatInput from "@/components/custom/app/chat-input"
import WelcomeSection from "@/components/custom/app/welcome"
import Features from "@/components/custom/app/features"
import { IconBrandLinkedin, IconBrandThreads, IconBrandX } from "@tabler/icons-react"
import { useConversationCreateMutation } from "@/lib/query"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

export default function Page() {
    const { mutateAsync, data, isPending, isSuccess } = useConversationCreateMutation()
    const queryClient = useQueryClient()
    const router = useRouter();
    const handleSend = async (message: string, platform?: string) => {
        if (!platform) return
        console.log(message, platform)
        await mutateAsync({ content: message, platform })
    }
    useEffect(() => {
        if (isSuccess) {
            router.replace(`/app/editor/${data?.data.conversationId}`)
            queryClient.invalidateQueries({ queryKey: ['conversations'] })
        }
    }, [isSuccess, data])

    return (
        <div className="flex flex-col gap-4 p-4 w-full h-full items-center">
            <div className="max-w-3xl w-full max-h-screen min-h-3/4 flex flex-col items-center justify-center gap-16">
                <WelcomeSection />
                <ChatInput isLoading={isPending || isSuccess} variant="default" onSend={handleSend} platforms={[
                    { value: 'linkedin', label: 'LinkedIn', icon: IconBrandLinkedin },
                    { value: 'x', label: 'X', icon: IconBrandX, disabled: true, badge: "Soon" },
                    { value: 'threads', label: 'Threads', icon: IconBrandThreads, disabled: true, badge: "Soon" },
                ]} />
            </div>
            <div className="w-full max-w-4xl">
                <Features />
            </div>
        </div>
    )
}
