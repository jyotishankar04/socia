"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Page = () => {
    const { replace } = useRouter()
    useEffect(() => {
        replace("/app/")
    }, [replace])
    return (
    <></>
  )
}

export default Page