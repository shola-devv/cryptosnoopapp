"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUp, ArrowDown } from "lucide-react"

// Initialize font
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
]

export default function CryptoTable() {
  const router = useRouter()
  const [cryptos, setCryptos] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      try {
        // Check if we have cached data in localStorage
        const cachedData = localStorage.getItem("cryptoData")
        const cachedTimestamp = localStorage.getItem("cryptoDataTimestamp")

        // If we have cached data and it's less than 5 minutes old, use it
        if (cachedData && cachedTimestamp) {
          const parsedData = JSON.parse(cachedData)
          const timestamp = Number.parseInt(cachedTimestamp)
          const now = Date.now()

          // If data is less than 5 minutes old
          if (now - timestamp < 5 * 60 * 1000) {
            setCryptos(parsedData)
            setLoading(false)
            return
          }
        }

        // In a real implementation, you would fetch from an API
        // const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1')
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

          // Save to localStorage with timestamp
          localStorage.setItem("cryptoData", JSON.stringify(updatedData))
          localStorage.setItem("cryptoDataTimestamp", Date.now().toString())
        }, 1500)
      } catch (error) {
        console.error("Error fetching crypto data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate total portfolio value (for demo purposes)
  const calculateTotalValue = (data: CryptoData[]): number => {
    return data.reduce((total, crypto) => total + crypto.price, 0)
  }

  // Calculate 24h change percentage
  const calculate24hChange = (data: CryptoData[]): number => {
    const totalValue = calculateTotalValue(data)
    const totalChange = data.reduce((total, crypto) => total + (crypto.price * crypto.change24h) / 100, 0)
    return (totalChange / totalValue) * 100
  }

  // Export these calculations for use in other components
  if (typeof window !== "undefined") {
    window.cryptoData = {
      data: cryptos,
      totalValue: calculateTotalValue(cryptos),
      totalAssets: cryptos.length,
      change24h: calculate24hChange(cryptos),
    }
  }

  // Handle row click to navigate to crypto detail page
  const handleRowClick = (cryptoId: string) => {
    router.push(`/crypto/${cryptoId}`)
  }

  return (
    <div className="overflow-x-auto -mx-3 sm:-mx-6">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200 dark:border-slate-700">
            <TableHead className="w-[40px] sm:w-[50px] py-3 text-slate-700 dark:text-slate-300">#</TableHead>
            <TableHead className="py-3 text-slate-700 dark:text-slate-300">Name</TableHead>
            <TableHead className="hidden sm:table-cell py-3 text-slate-700 dark:text-slate-300">Symbol</TableHead>
            <TableHead className="text-right py-3 text-slate-700 dark:text-slate-300">Price</TableHead>
            <TableHead className="hidden md:table-cell text-right py-3 text-slate-700 dark:text-slate-300">
              Price (BTC)
            </TableHead>
            <TableHead className="text-right py-3 text-slate-700 dark:text-slate-300">24h</TableHead>
            <TableHead className="hidden lg:table-cell py-3 text-slate-700 dark:text-slate-300">Chart</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-4 dark:bg-slate-700" />
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-full dark:bg-slate-700" />
                        <Skeleton className="h-4 w-16 sm:w-24 dark:bg-slate-700" />
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell py-3">
                      <Skeleton className="h-4 w-12 dark:bg-slate-700" />
                    </TableCell>
                    <TableCell className="text-right py-3">
                      <Skeleton className="h-4 w-16 sm:w-20 ml-auto dark:bg-slate-700" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right py-3">
                      <Skeleton className="h-4 w-16 ml-auto dark:bg-slate-700" />
                    </TableCell>
                    <TableCell className="text-right py-3">
                      <Skeleton className="h-4 w-12 sm:w-16 ml-auto dark:bg-slate-700" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell py-3">
                      <Skeleton className="h-8 w-24 sm:h-10 sm:w-32 dark:bg-slate-700" />
                    </TableCell>
                  </TableRow>
                ))
            : cryptos.map((crypto, index) => (
                <TableRow
                  key={crypto.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(crypto.id)}
                >
                  <TableCell className="py-3 font-medium text-slate-600 dark:text-slate-400">{index + 1}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs sm:text-sm">
                        {crypto.symbol.charAt(0)}
                      </div>
                      <span className="text-sm sm:text-base font-medium dark:text-white">{crypto.name}</span>
                    </div>
                  </TableCell>
                  <TableCell
                    className={`hidden sm:table-cell py-3 ${geistMono.className} text-xs sm:text-sm text-slate-600 dark:text-slate-400`}
                  >
                    {crypto.symbol}
                  </TableCell>
                  <TableCell
                    className={`text-right py-3 ${geistMono.className} text-sm sm:text-base font-medium dark:text-white`}
                  >
                    $
                    {crypto.price < 1
                      ? crypto.price.toFixed(2)
                      : crypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell
                    className={`hidden md:table-cell text-right py-3 ${geistMono.className} text-xs sm:text-sm text-slate-600 dark:text-slate-400`}
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
                    <div className="h-8 sm:h-9 w-24 sm:w-32 bg-slate-50 dark:bg-slate-700 rounded-md flex items-center p-1">
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
              ))}
        </TableBody>
      </Table>
    </div>
  )
}
