"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

export interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
  systemTheme: Theme | undefined
  isPaidUser: boolean
  setIsPaidUser: (flag: boolean) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  systemTheme: undefined,
  isPaidUser: false,
  setIsPaidUser: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, defaultTheme = "system" }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [systemTheme, setSystemTheme] = useState<Theme | undefined>(undefined)
  const [isPaidUser, setIsPaidUser] = useState<boolean>(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme
    const storedPaid = localStorage.getItem('isPaidUser')

    if (storedTheme) {
      setTheme(storedTheme)
    }

    if (storedPaid !== null) {
      setIsPaidUser(storedPaid === 'true')
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

  // Persist paid status
  useEffect(() => {
    try {
      localStorage.setItem('isPaidUser', isPaidUser ? 'true' : 'false')
    } catch (e) {
      // ignore localStorage errors
    }
  }, [isPaidUser])

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
    isPaidUser,
    setIsPaidUser,
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
