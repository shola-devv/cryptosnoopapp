"use client"

import { useEffect } from "react"

export function ThemeScript() {
  useEffect(() => {
    // This script runs on the client side only
    return
  }, [])

  // This script runs on the server side during SSR
  // and on the client before hydration
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              // Get stored theme
              const theme = localStorage.getItem('theme') || 'system';
              
              // Check for system preference
              const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              
              // Determine which theme to use
              const resolvedTheme = theme === 'system' ? systemPreference : theme;
              
              // Apply theme class to document
              document.documentElement.classList.add(resolvedTheme);
            } catch (e) {
              console.error('Error applying theme:', e);
            }
          })();
        `,
      }}
    />
  )
}
