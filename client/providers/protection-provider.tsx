"use client"
import { useAuthStore } from "@/store/auth"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { self } from "@/lib/api"
import LoadingModal from "@/components/custom/essenticals/loading-model"


const getSelf = async () => {
    const res = await self()
    return res.data
}
const ProtectionProvider = ({children}: {children: React.ReactNode}) => {
    const { setUser } = useAuthStore()
    const router = useRouter()
    const { data: selfData, isLoading, isError, error } = useQuery({
        queryKey: ['self'],
        queryFn: getSelf,
        retry: (failureCount, error) => {
            if (error instanceof AxiosError && error.response?.status === 401) return false
            return failureCount < 2
        },
    })

    useEffect(() => {
        if (selfData) setUser(selfData)
    }, [selfData, setUser])

    useEffect(() => {
        if (isError) {
            router.push('/auth/signin')
        }
    }, [isError, router])

    if (isLoading) return <LoadingModal text="Authenticating" description="Please wait..." />


  return (
      <>{children}</>
  )
}

export default ProtectionProvider