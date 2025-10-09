"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Footer } from "@/components/footer"
import { Geist } from "next/font/google"
import { Geist_Mono as GeistMono } from "next/font/google"
import { LogOut, ArrowLeft, Search, ArrowUp, ArrowDown } from "lucide-react"

// Initialize fonts
const geist = Geist({ subsets: ["latin"] })
const geistMono = GeistMono({ subsets: ["latin"] })

// Define crypto data type
interface CryptoData {
  id: string
  name: string
  symbol: string
  price: number
  btcPrice: number
  change24h: number
}

// Mock data - will be replaced with API data
const mockCryptos: CryptoData[] = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 65432.1, btcPrice: 1, change24h: 2.5 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3521.45, btcPrice: 0.05382, change24h: -1.2 },
  { id: "solana", name: "Solana", symbol: "SOL", price: 142.87, btcPrice: 0.00218, change24h: 5.7 },
  { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.45, btcPrice: 0.00000688, change24h: -0.8 },
  { id: "ripple", name: "XRP", symbol: "XRP", price: 0.52, btcPrice: 0.00000794, change24h: 1.3 },
  { id: "polkadot", name: "Polkadot", symbol: "DOT", price: 6.82, btcPrice: 0.000104, change24h: 0.3 },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.12, btcPrice: 0.00000183, change24h: -2.1 },
  { id: "avalanche", name: "Avalanche", symbol: "AVAX", price: 34.56, btcPrice: 0.000528, change24h: 3.8 },
  { id: "chainlink", name: "Chainlink", symbol: "LINK", price: 14.23, btcPrice: 0.000217, change24h: 1.9 },
  { id: "uniswap", name: "Uniswap", symbol: "UNI", price: 8.75, btcPrice: 0.000134, change24h: -0.5 },
]

export default function AddAssetsPage() {
  const router = useRouter()
  const [cryptos, setCryptos] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: keyof CryptoData; direction: "ascending" | "descending" }>({
    key: "price",
    direction: "descending",
  })

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      try {
        // In a real implementation, you would fetch from an API
        // const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1')
        // const data = await response.json()

        // For now, use mock data
        setTimeout(() => {
          // Add some random variation to prices to simulate real data
          const updatedData = mockCryptos.map((crypto) => ({
            ...crypto,
            price: crypto.price * (1 + (Math.random() * 0.1 - 0.05)), // +/- 5%
            change24h: crypto.change24h + (Math.random() * 2 - 1), // +/- 1%
          }))

          // Save to state
          setCryptos(updatedData)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching crypto data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Sort function
  const sortedCryptos = [...cryptos].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  // Filter function
  const filteredCryptos = sortedCryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Request sort
  const requestSort = (key: keyof CryptoData) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Get sort direction icon
  const getSortDirectionIcon = (key: keyof CryptoData) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === "ascending" ? (
      <ArrowUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 inline ml-1" />
    )
  }

  // Handle row click to navigate to crypto detail page
  const handleRowClick = (cryptoId: string) => {
    router.push(`/crypto/${cryptoId}`)
  }

  return (
    <main className={`min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 ${geist.className}`}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg sm:text-xl">C</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-primary font-bold text-base sm:text-lg leading-tight">crypto</span>
              <span className="text-slate-700 font-bold text-base sm:text-lg leading-tight -mt-1">Snoop</span>
            </div>
          </div>

          <Button variant="outline" size="sm" className="h-9 text-xs sm:text-sm" asChild>
            <Link href="/">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back to Assets */}
        <div className="mb-4">
          <Link
            href="/assets"
            className="inline-flex items-center text-sm text-slate-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to My Assets
          </Link>
        </div>

        {/* Page Title */}
        <section className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Add Assets</h1>
          <p className="text-slate-600">Browse and select cryptocurrencies to add to your portfolio</p>
        </section>

        {/* Search Bar */}
        <section className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by name or symbol..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        {/* Crypto Table - Using the same structure as CryptoTable component */}
        <section className="mb-8">
          <div className="bg-white rounded-xl shadow-[0_8px_15px_-3px_rgba(182,111,235,0.2)] p-3 sm:p-6 overflow-hidden">
            <div className="overflow-x-auto -mx-3 sm:-mx-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-200">
                    <TableHead className="w-[40px] sm:w-[50px] py-3 text-slate-700">#</TableHead>
                    <TableHead className="py-3 text-slate-700 cursor-pointer" onClick={() => requestSort("name")}>
                      Name {getSortDirectionIcon("name")}
                    </TableHead>
                    <TableHead className="hidden sm:table-cell py-3 text-slate-700">Symbol</TableHead>
                    <TableHead
                      className="text-right py-3 text-slate-700 cursor-pointer"
                      onClick={() => requestSort("price")}
                    >
                      Price {getSortDirectionIcon("price")}
                    </TableHead>
                    <TableHead className="hidden md:table-cell text-right py-3 text-slate-700">Price (BTC)</TableHead>
                    <TableHead
                      className="text-right py-3 text-slate-700 cursor-pointer"
                      onClick={() => requestSort("change24h")}
                    >
                      24h {getSortDirectionIcon("change24h")}
                    </TableHead>
                    <TableHead className="hidden lg:table-cell py-3 text-slate-700">Chart</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <TableRow key={index} className="hover:bg-slate-50 transition-colors">
                          <TableCell className="py-3">
                            <Skeleton className="h-4 w-4" />
                          </TableCell>
                          <TableCell className="py-3">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
                              <Skeleton className="h-4 w-16 sm:w-24" />
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell py-3">
                            <Skeleton className="h-4 w-12" />
                          </TableCell>
                          <TableCell className="text-right py-3">
                            <Skeleton className="h-4 w-16 sm:w-20 ml-auto" />
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-right py-3">
                            <Skeleton className="h-4 w-16 ml-auto" />
                          </TableCell>
                          <TableCell className="text-right py-3">
                            <Skeleton className="h-4 w-12 sm:w-16 ml-auto" />
                          </TableCell>
                          <TableCell className="hidden lg:table-cell py-3">
                            <Skeleton className="h-8 w-24 sm:h-10 sm:w-32" />
                          </TableCell>
                        </TableRow>
                      ))
                  ) : filteredCryptos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-slate-500">
                        No cryptocurrencies found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCryptos.map((crypto, index) => (
                      <TableRow
                        key={crypto.id}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => handleRowClick(crypto.id)}
                      >
                        <TableCell className="py-3 font-medium text-slate-600">{index + 1}</TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs sm:text-sm">
                              {crypto.symbol.charAt(0)}
                            </div>
                            <span className="text-sm sm:text-base font-medium">{crypto.name}</span>
                          </div>
                        </TableCell>
                        <TableCell
                          className={`hidden sm:table-cell py-3 ${geistMono.className} text-xs sm:text-sm text-slate-600`}
                        >
                          {crypto.symbol}
                        </TableCell>
                        <TableCell
                          className={`text-right py-3 ${geistMono.className} text-sm sm:text-base font-medium`}
                        >
                          $
                          {crypto.price < 1
                            ? crypto.price.toFixed(2)
                            : crypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell
                          className={`hidden md:table-cell text-right py-3 ${geistMono.className} text-xs sm:text-sm text-slate-600`}
                        >
                          {crypto.btcPrice.toFixed(crypto.btcPrice < 0.001 ? 8 : 5)}
                        </TableCell>
                        <TableCell
                          className={`text-right py-3 text-sm sm:text-base font-medium ${
                            crypto.change24h >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          <div className="flex items-center justify-end gap-1">
                            {crypto.change24h >= 0 ? (
                              <ArrowUp size={14} className="sm:w-4 sm:h-4" />
                            ) : (
                              <ArrowDown size={14} className="sm:w-4 sm:h-4" />
                            )}
                            <span
                              aria-label={`${Math.abs(crypto.change24h).toFixed(2)}% ${crypto.change24h >= 0 ? "increase" : "decrease"}`}
                            >
                              {Math.abs(crypto.change24h).toFixed(2)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell py-3">
                          <div className="h-8 sm:h-9 w-24 sm:w-32 bg-slate-50 rounded-md flex items-center p-1">
                            <div
                              className={`h-6 sm:h-7 ${
                                crypto.change24h >= 0 ? "bg-green-500" : "bg-red-500"
                              } rounded-md transition-all duration-300`}
                              style={{ width: `${Math.min(Math.abs(crypto.change24h) * 5, 100)}%` }}
                              aria-hidden="true"
                            ></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}
