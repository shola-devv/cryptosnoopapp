"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, Plus } from "lucide-react"
import { Geist_Mono as GeistMono } from "next/font/google"

// Initialize font
const geistMono = GeistMono({ subsets: ["latin"] })

// Define crypto data type
interface CryptoData {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
}

// Mock data for the carousel
const mockCryptos: CryptoData[] = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 65432.1, change24h: 2.5 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3521.45, change24h: -1.2 },
  { id: "solana", name: "Solana", symbol: "SOL", price: 142.87, change24h: 5.7 },
  { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.45, change24h: -0.8 },
  { id: "ripple", name: "XRP", symbol: "XRP", price: 0.52, change24h: 1.3 },
  { id: "polkadot", name: "Polkadot", symbol: "DOT", price: 6.82, change24h: 0.3 },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.12, change24h: -2.1 },
  { id: "avalanche", name: "Avalanche", symbol: "AVAX", price: 34.56, change24h: 3.8 },
  { id: "chainlink", name: "Chainlink", symbol: "LINK", price: 14.23, change24h: 1.9 },
  { id: "uniswap", name: "Uniswap", symbol: "UNI", price: 8.75, change24h: -0.5 },
  { id: "litecoin", name: "Litecoin", symbol: "LTC", price: 73.45, change24h: 1.8 },
  { id: "polygon", name: "Polygon", symbol: "MATIC", price: 0.89, change24h: -0.3 },
]

export default function CryptoCarousel() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([])

  useEffect(() => {
    // Add some random variation to prices to simulate real data
    const updatedData = mockCryptos.map((crypto) => ({
      ...crypto,
      price: crypto.price * (1 + (Math.random() * 0.1 - 0.05)), // +/- 5%
      change24h: crypto.change24h + (Math.random() * 2 - 1), // +/- 1%
    }))

    // Triple the array to create seamless infinite scroll
    setCryptos([...updatedData, ...updatedData, ...updatedData])
  }, [])

  const handleAddCoin = (crypto: CryptoData, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Add to localStorage (simulate adding to portfolio)
    try {
      const existingAssets = localStorage.getItem("userAssets")
        ? JSON.parse(localStorage.getItem("userAssets") || "[]")
        : []

      // Check if already exists
      if (!existingAssets.some((asset: any) => asset.id === crypto.id)) {
        const newAsset = {
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol,
          amount: 0,
          value: 0,
          price: crypto.price,
          change24h: crypto.change24h,
        }

        localStorage.setItem("userAssets", JSON.stringify([...existingAssets, newAsset]))

        // Show success feedback (you could add a toast notification here)
        console.log(`Added ${crypto.name} to portfolio`)
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  return (
    <div className="relative overflow-hidden py-4 sm:py-6 lg:py-8">
      <div className="flex animate-scroll-fast space-x-4 sm:space-x-6 hover:animation-pause">
        {cryptos.map((crypto, index) => (
          <div
            key={`${crypto.id}-${index}`}
            className="flex-shrink-0 bg-white/10 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl hover:shadow-xl transition-all duration-300 p-4 sm:p-6 min-w-[240px] sm:min-w-[280px] lg:min-w-[300px] border border-white/20 dark:border-slate-700/30 group hover:bg-white/15 dark:hover:bg-slate-800/40 hover:-translate-y-0.5 shadow-[0_8px_32px_0_rgba(182,111,235,0.15)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_0_rgba(182,111,235,0.2)] dark:hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.4)]"
          >
            {/* Crypto Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center text-primary text-base sm:text-lg font-bold border border-primary/30">
                  {crypto.symbol.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white text-base sm:text-lg">{crypto.name}</h3>
                  <p className={`text-slate-600 dark:text-slate-400 text-xs sm:text-sm ${geistMono.className}`}>
                    {crypto.symbol}
                  </p>
                </div>
              </div>
            </div>

            {/* Price Information */}
            <div className="mb-3 sm:mb-4">
              <div
                className={`text-xl sm:text-2xl font-bold text-slate-800 dark:text-white ${geistMono.className} mb-1 sm:mb-2`}
              >
                $
                {crypto.price < 1
                  ? crypto.price.toFixed(4)
                  : crypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div
                className={`flex items-center text-sm sm:text-base ${crypto.change24h >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {crypto.change24h >= 0 ? (
                  <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                )}
                <span className="font-medium">
                  {crypto.change24h >= 0 ? "+" : ""}
                  {crypto.change24h.toFixed(2)}% (24h)
                </span>
              </div>
            </div>

            {/* Add Coin Button */}
            <Button
              onClick={(e) => handleAddCoin(crypto, e)}
              className="w-full bg-green-600/90 hover:bg-green-700 text-white font-medium py-2 sm:py-2.5 rounded-xl transition-all duration-200 text-sm sm:text-base group-hover:scale-105 backdrop-blur-sm border border-green-500/30"
              size="sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Add Coin
            </Button>
          </div>
        ))}
      </div>

      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 lg:w-20 bg-gradient-to-r from-purple-50 dark:from-slate-900 to-transparent pointer-events-none z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 lg:w-20 bg-gradient-to-l from-purple-50 dark:from-slate-900 to-transparent pointer-events-none z-10"></div>
    </div>
  )
}
