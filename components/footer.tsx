"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function Footer() {
  const [year, setYear] = useState<number>(new Date().getFullYear())

  useEffect(() => {
    // Update the year when the component mounts
    setYear(new Date().getFullYear())

    // Set up an interval to check the year daily (overkill but ensures it's always current)
    const interval = setInterval(() => {
      const currentYear = new Date().getFullYear()
      if (currentYear !== year) {
        setYear(currentYear)
      }
    }, 86400000) // 24 hours

    return () => clearInterval(interval)
  }, [year])

  return (
    <footer className="w-full py-6 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-auto">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-2">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-primary font-bold text-sm leading-tight">crypto</span>
              <span className="text-slate-700 dark:text-slate-300 font-bold text-sm leading-tight -mt-1">Snoop</span>
            </div>
          </div>

          <nav aria-label="Footer Navigation">
            <ul className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
              <li>
                <Link
                  href="/home"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary font-medium transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </nav>

          <div className="text-sm text-slate-500 dark:text-slate-500">
            &copy; {year} CryptoSnoop. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
