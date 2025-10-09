"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { Geist } from "next/font/google"
import { Geist_Mono as GeistMono } from "next/font/google"
import {
  LogOut,
  ArrowLeft,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart4,
  Clock,
  Percent,
  Check,
} from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ThemeToggle } from "@/components/theme-toggle"

// Initialize fonts
const geist = Geist({ subsets: ["latin"] })
const geistMono = GeistMono({ subsets: ["latin"] })

// Mock crypto data
const cryptoData = {
  bitcoin: {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    currentPrice: 65432.1,
    change24h: 2.5,
    change7d: 5.2,
    marketCap: 1258000000000,
    volume24h: 28500000000,
    circulatingSupply: 19250000,
    allTimeHigh: 69000,
    description:
      "Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.",
  },
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    currentPrice: 3521.45,
    change24h: -1.2,
    change7d: 2.8,
    marketCap: 422000000000,
    volume24h: 15200000000,
    circulatingSupply: 120000000,
    allTimeHigh: 4860,
    description:
      "Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform. It is the second-largest cryptocurrency by market capitalization, after Bitcoin.",
  },
  solana: {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    currentPrice: 142.87,
    change24h: 5.7,
    change7d: 12.3,
    marketCap: 61500000000,
    volume24h: 3800000000,
    circulatingSupply: 430000000,
    allTimeHigh: 260,
    description:
      "Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale. It's fast, secure, and censorship-resistant.",
  },
  cardano: {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    currentPrice: 0.45,
    change24h: -0.8,
    change7d: -2.1,
    marketCap: 15800000000,
    volume24h: 420000000,
    circulatingSupply: 35200000000,
    allTimeHigh: 3.1,
    description:
      "Cardano is a proof-of-stake blockchain platform: the first to be founded on peer-reviewed research and developed through evidence-based methods. It combines pioneering technologies to provide unparalleled security and sustainability.",
  },
  ripple: {
    id: "ripple",
    name: "XRP",
    symbol: "XRP",
    currentPrice: 0.52,
    change24h: 1.3,
    change7d: 0.5,
    marketCap: 28200000000,
    volume24h: 980000000,
    circulatingSupply: 54200000000,
    allTimeHigh: 3.4,
    description:
      "XRP is the native cryptocurrency of the XRP Ledger, which uses a consensus protocol that differs from proof-of-work or proof-of-stake. The XRP Ledger is intended to be a bridge currency for financial institutions.",
  },
}

// Generate mock price history data
const generatePriceHistory = (basePrice, volatility, days = 30) => {
  const data = []
  let price = basePrice

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Add some randomness to the price
    const change = (Math.random() - 0.5) * volatility * price
    price = Math.max(0.01, price + change)

    data.push({
      date: date.toISOString().split("T")[0],
      price: price,
    })
  }

  return data
}

export default function CryptoDetailPage({ params }: { params: { id: string } }) {
  const [crypto, setCrypto] = useState<any>(null)
  const [priceHistory, setPriceHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [addedToAssets, setAddedToAssets] = useState(false)

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from an API
        // const response = await fetch(`https://api.example.com/crypto/${params.id}`)
        // const data = await response.json()

        // For now, use mock data
        setTimeout(() => {
          const cryptoInfo = cryptoData[params.id as keyof typeof cryptoData]
          if (cryptoInfo) {
            setCrypto(cryptoInfo)

            // Generate mock price history
            const volatility = cryptoInfo.currentPrice < 1 ? 0.03 : 0.015
            setPriceHistory(generatePriceHistory(cryptoInfo.currentPrice, volatility))

            setLoading(false)
          } else {
            // Handle not found
            setCrypto(null)
            setLoading(false)
          }
        }, 1000)
      } catch (error) {
        console.error("Error fetching crypto data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleAddToAssets = () => {
    // In a real app, you would call an API or update state in a global store
    setAddedToAssets(true)

    // Simulate storing in localStorage
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
          amount: 0, // User would set this later
          value: 0, // Calculated based on amount
          price: crypto.currentPrice,
          change24h: crypto.change24h,
        }

        localStorage.setItem("userAssets", JSON.stringify([...existingAssets, newAsset]))
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }

    // Show success state for 2 seconds
    setTimeout(() => {
      setAddedToAssets(false)
    }, 2000)
  }

  if (loading) {
    return (
      <main
        className={`min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800 ${geist.className}`}
      >
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg sm:text-xl">C</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-primary font-bold text-base sm:text-lg leading-tight">crypto</span>
                <span className="text-slate-700 dark:text-slate-300 font-bold text-base sm:text-lg leading-tight -mt-1">
                  Snoop
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" size="sm" className="h-9 text-xs sm:text-sm" asChild>
                <Link href="/">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading crypto data...</p>
        </div>
      </main>
    )
  }

  if (!crypto) {
    return (
      <main
        className={`min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800 ${geist.className}`}
      >
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg sm:text-xl">C</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-primary font-bold text-base sm:text-lg leading-tight">crypto</span>
                <span className="text-slate-700 dark:text-slate-300 font-bold text-base sm:text-lg leading-tight -mt-1">
                  Snoop
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" size="sm" className="h-9 text-xs sm:text-sm" asChild>
                <Link href="/">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="mb-4">
            <Link
              href="/home"
              className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[0_8px_15px_-3px_rgba(182,111,235,0.2)] p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Cryptocurrency Not Found</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              The cryptocurrency you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/add-assets">Browse All Cryptocurrencies</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main
      className={`min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800 ${geist.className}`}
    >
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg sm:text-xl">C</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-primary font-bold text-base sm:text-lg leading-tight">crypto</span>
              <span className="text-slate-700 dark:text-slate-300 font-bold text-base sm:text-lg leading-tight -mt-1">
                Snoop
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" className="h-9 text-xs sm:text-sm" asChild>
              <Link href="/">
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back to Home */}
        <div className="mb-4">
          <Link
            href="/add-assets"
            className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to All Cryptocurrencies
          </Link>
        </div>

        {/* Crypto Header */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl sm:text-2xl font-bold">
              {crypto.symbol.charAt(0)}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-1">
                {crypto.name} ({crypto.symbol})
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <span className={`text-xl ${geistMono.className} font-bold dark:text-white`}>
                  $
                  {crypto.currentPrice.toLocaleString(undefined, {
                    minimumFractionDigits: crypto.currentPrice < 1 ? 2 : 0,
                    maximumFractionDigits: crypto.currentPrice < 1 ? 6 : 2,
                  })}
                </span>
                <span className={`flex items-center ${crypto.change24h >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {crypto.change24h >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(crypto.change24h).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Price Chart */}
        <section className="mb-8">
          <Card className="border-0 shadow-[0_8px_15px_-3px_rgba(182,111,235,0.2)] dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Price History (30 Days)</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-4">
              <div className="h-[300px] sm:h-[400px] w-full">
                <ChartContainer
                  config={{
                    price: {
                      label: "Price",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceHistory} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return `${date.getDate()}/${date.getMonth() + 1}`
                        }}
                        stroke="#888888"
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        domain={["auto", "auto"]}
                        tickFormatter={(value) => {
                          if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
                          return `${value.toFixed(crypto.currentPrice < 1 ? 2 : 0)}`
                        }}
                        stroke="#888888"
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="var(--color-price)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Key Statistics */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Key Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-0 shadow-[0_8px_15px_-3px_rgba(182,111,235,0.2)] dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-4 flex items-center">
                <DollarSign className="w-10 h-10 text-primary/60 mr-4" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Market Cap</p>
                  <p className={`text-lg font-bold ${geistMono.className} dark:text-white`}>
                    ${(crypto.marketCap / 1000000000).toFixed(1)}B
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-[0_8px_15px_-3px_rgba(182,111,235,0.2)] dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-4 flex items-center">
                <BarChart4 className="w-10 h-10 text-primary/60 mr-4" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">24h Volume</p>
                  <p className={`text-lg font-bold ${geistMono.className} dark:text-white`}>
                    ${(crypto.volume24h / 1000000000).toFixed(1)}B
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-[0_8px_15px_-3px_rgba(182,111,235,0.2)] dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-4 flex items-center">
                <Clock className="w-10 h-10 text-primary/60 mr-4" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">7d Change</p>
                  <p
                    className={`text-lg font-bold ${geistMono.className} ${crypto.change7d >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {crypto.change7d >= 0 ? "+" : ""}
                    {crypto.change7d.toFixed(2)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-[0_8px_15px_-3px_rgba(182,111,235,0.2)] dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-4 flex items-center">
                <Percent className="w-10 h-10 text-primary/60 mr-4" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">All Time High</p>
                  <p className={`text-lg font-bold ${geistMono.className} dark:text-white`}>
                    ${crypto.allTimeHigh.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-[0_8px_15px_-3px_rgba(182,111,235,0.2)] sm:col-span-2 lg:col-span-1 dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-4 flex items-center">
                <svg
                  className="w-10 h-10 text-primary/60 mr-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Circulating Supply</p>
                  <p className={`text-lg font-bold ${geistMono.className} dark:text-white`}>
                    {(crypto.circulatingSupply / 1000000).toFixed(1)}M {crypto.symbol}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* About */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">About {crypto.name}</h2>
          <Card className="border-0 shadow-[0_8px_15px_-3px_rgba(182,111,235,0.2)] dark:bg-slate-800 dark:border-slate-700">
            <CardContent className="p-6">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{crypto.description}</p>
            </CardContent>
          </Card>
        </section>

        {/* Add to Assets Button */}
        <section className="mb-12 flex justify-center">
          <Button
            size="lg"
            className={`px-8 py-6 text-lg font-bold transition-all ${
              addedToAssets ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"
            }`}
            onClick={handleAddToAssets}
            disabled={addedToAssets}
          >
            {addedToAssets ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Added to Assets
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Add {crypto.symbol} to My Assets
              </>
            )}
          </Button>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}

