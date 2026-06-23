"use client"

import { useSidebar } from "@/components/ui/sidebar"
import Link from "next/link"

const Logo = () => {
    const { open } = useSidebar()
    return (
        <Link href="/app" className="w-full flex items-start hover:opacity-80 transition-opacity">
            {open ? (
                <div className="flex flex-row items-end gap-1">
                    <h1 className="text-3xl font-stretch-105%">
                        <span className="font-bold underline text-primary">Q</span>wikish
                    </h1>
                    <p className="text-primary">Socia</p>
                </div>
            ) : (
                <div className="flex justify-center w-full">
                    <h1 className="font-bold underline text-primary text-3xl">Q</h1>
                </div>
            )}
        </Link>
    )
}

export default Logo
