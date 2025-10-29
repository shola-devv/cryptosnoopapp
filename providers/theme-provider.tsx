"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
  systemTheme: Theme | undefined
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  systemTheme: undefined,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, defaultTheme = "system" }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [systemTheme, setSystemTheme] = useState<Theme | undefined>(undefined)

  // Load theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme

    if (storedTheme) {
      setTheme(storedTheme)
    }

    // Check for system preference
    if (typeof window !== "undefined") {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setSystemTheme(systemPreference)

      // Listen for changes in system preference
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = (e: MediaQueryListEvent) => {
        setSystemTheme(e.matches ? "dark" : "light")
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement
    const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark")

    // Remove previous theme class
    root.classList.remove("light", "dark")

    // Add current theme class
    root.classList.add(isDark ? "dark" : "light")

    // Store theme preference
    localStorage.setItem("theme", theme)
  }, [theme, systemTheme])

  const value = {
    theme,
    setTheme,
    systemTheme,
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
