"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Toggle } from "@/components/ui/toggle"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch by only rendering after mounting on client
    React.useEffect(() => {
        setMounted(true)
    }, [])

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    // Prevent hydration issues by returning null or simplified UI while not mounted
    if (!mounted) {
        return (
            <Toggle variant="outline" size="default" aria-label="Toggle theme">
                <span className="sr-only">Toggle theme</span>
            </Toggle>
        )
    }

    return (
        <Toggle
            className="cursor-pointer"
            size="default"
            pressed={theme === "dark"}
            onPressedChange={toggleTheme}
            aria-label="Toggle theme"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

        </Toggle>
    )
} 