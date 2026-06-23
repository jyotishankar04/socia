"use client"
import { useAuthStore } from "@/store/auth"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { self } from "@/lib/api"
import LoadingModal from "@/components/custom/essenticals/loading-model"
import type { User } from "@/types"

const getSelf = async (): Promise<User | null> => {
    try {
        const res = await self()
        return res.data as User
    } catch {
        return null
    }
}

const ProtectionProvider = ({ children }: { children: React.ReactNode }) => {
    const { setUser } = useAuthStore()
    const router = useRouter()

    const { data: selfData, isLoading } = useQuery({
        queryKey: ['self'],
        queryFn: getSelf,
        retry: false,
        staleTime: 1000 * 60 * 5,
    })

    useEffect(() => {
        if (selfData) setUser(selfData)
    }, [selfData, setUser])

    useEffect(() => {
        if (!isLoading && !selfData) {
            router.push('/auth/signin')
        }
    }, [isLoading, selfData, router])

    if (isLoading) return <LoadingModal text="Authenticating" description="Please wait..." />

    return <>{children}</>
}

export default ProtectionProvider
