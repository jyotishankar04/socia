"use client"

import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect } from "react"

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme()

    return (
        <ButtonGroup>
            {
                !!theme && <>
                    <Button onClick={() => {
                        if (theme !== "light") setTheme("light")
                    }} variant={theme === "light" ? "default" : "outline"} size="sm" className="rounded-full">
                        <Sun />
                    </Button>
                    <ButtonGroupSeparator />
                    <Button onClick={() => {
                        if (theme !== "dark") setTheme("dark")
                    }}
                        variant={theme === "dark" ? "default" : "outline"} size="sm" className="rounded-full">
                        <Moon />
                    </Button>
                </>
            }
        </ButtonGroup>
    )
}

export default ThemeToggle