"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Bell, 
  Wallet, 
  ArrowLeft,
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff
} from "lucide-react"
import { Switch } from "@/components/ui/switch"

// Mock crypto data
const cryptoCoins = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    price: 43250.50,
    change: 2.5,
    icon: "₿"
  },
  {
    id: 2,
    name: "Ethereum",
    symbol: "ETH",
    price: 2280.75,
    change: -1.2,
    icon: "Ξ"
  },
  {
    id: 3,
    name: "Cardano",
    symbol: "ADA",
    price: 0.52,
    change: 3.8,
    icon: "₳"
  },
  {
    id: 4,
    name: "Solana",
    symbol: "SOL",
    price: 98.45,
    change: 5.2,
    icon: "◎"
  },
  {
    id: 5,
    name: "Polkadot",
    symbol: "DOT",
    price: 7.32,
    change: -0.8,
    icon: "●"
  }
]

export default function UserProfile() {
  const [showBalance, setShowBalance] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)
  const [portfolio] = useState(cryptoCoins.slice(0, 3))
  const [activeTab, setActiveTab] = useState("assets")

  const totalValue = 69646.94
  const totalChange = 1.8;
  const assets = 7;

  const handleNavigation = (path) => {
    window.location.href = path
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              
                <Image
                                    src="/cryptosnooplogo1.png"
                                    alt="DIVAFlex Logo"
                                    width={48}
                                    height={32}
                                    className="object-contain"
                                    priority
                                  />
              
              <div className="flex flex-col leading-none">
                <span className="font-bold text-sm sm:text-lg leading-tight" style={{ color: '#c750f7' }}>crypto</span>
                <span className="text-slate-700 dark:text-slate-300 font-bold text-sm sm:text-lg leading-tight -mt-1">
                  Snoop
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Profile Header */}
        <section className="mb-6">
          <Card className="border-0 shadow-lg" style={{ boxShadow: '0 8px 30px -3px rgba(199, 80, 247, 0.3)' }}>
            <CardContent className="p-3 sm:p-6">
              {/* Mobile Layout */}
              <div className="flex sm:hidden flex-col gap-4">
                {/* Top Row: Avatar and Hello Text */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-full blur-lg opacity-40" style={{ backgroundColor: '#c750f7' }}></div>
                    <Avatar className="w-12 h-12 border-2 relative" style={{ borderColor: '#c750f7' }}>
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt="John Doe" />
                      <AvatarFallback className="text-sm font-bold text-white" style={{ backgroundColor: '#c750f7' }}>JD</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">WELCOME!</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => setShowBalance(!showBalance)}>
                    {showBalance ? <Eye className="w-4 h-4 font-extrabold" /> : <EyeOff className="w-4 h-4 font-extrabold" />}
                  </Button>
                </div>

                {/* Order Value Section */}
                <div className=" dark:from-slate-700 dark:to-slate-800 rounded-lg p-3">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total balance</p>
                  <div className="flex items-baseline justify-between">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {showBalance ? totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '••••••'}
                    </p>
                    <Button 
                      size="sm" 
                      className="text-white font-semibold text-xs h-7 px-2"
                      style={{ backgroundColor: '#c750f7' }}
                    >
                      Monitor
                      <MapPin />
                    </Button>
                  </div>
                </div>

                {/* Profit Section */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-3">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Change in 24HR</p>
                    <p className="text-base font-bold text-green-600">
                      {showBalance ? `+${(totalChange * totalValue / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '••••••'}
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-3">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Assets</p>
                    <p className="text-base font-bold text-red-600">
                      {showBalance ? `-${assets}` : '••••••'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Desktop Layout */}
              <div className="hidden sm:flex flex-row items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-full blur-lg opacity-40" style={{ backgroundColor: '#c750f7' }}></div>
                  <Avatar className="w-16 h-16 border-2 relative" style={{ borderColor: '#c750f7' }}>
                    <AvatarImage src="/walodja.jpg" alt="profile picture" />
                    <AvatarFallback className="text-lg font-bold text-white" style={{ backgroundColor: '#c750f7' }}>JD</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">welcome!</h2>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowBalance(!showBalance)}>
                      {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <div className=" dark:from-slate-700 dark:to-slate-800 rounded-lg p-4 mb-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total Ballance</p>
                    <div className="flex items-baseline justify-between">
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        {showBalance ? totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '••••••'}
                      </p>
                      <Button 
                        size="sm" 
                        className="text-white font-semibold"
                        style={{ backgroundColor: '#c750f7' }}
                      >
                       Monitor 
                       <MapPin />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className=" dark:bg-slate-800 rounded-lg p-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Change in 24HR</p>
                      <p className="text-lg font-bold text-green-600">
                        {showBalance ? `+${(totalChange * totalValue / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '••••••'}
                      </p>
                    </div>
                    <div className="  dark:bg-slate-800 rounded-lg p-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Assets</p>
                      <p className="text-lg font-bold text-red-600">
                        {showBalance ? `-${assets}` : '••••••'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tabs Section */}
        <section className="mb-8">
          <div className="grid w-full grid-cols-3 mb-2 h-auto p-1 gap-1 rounded-lg">
            <button 
              onClick={() => handleNavigation("/home/assets")}
              className="relative h-full font-semibold flex flex-col items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 rounded-lg transition-colors"
            
            >
              <div className="w-16 h-12 sm:w-24 sm:h-18 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0" style={{ backgroundColor: '#eee8f0' }}>
                <img src="/assets.png" alt="Assets" className="w-8 h-8 sm:w-12 sm:h-12 object-contain" />
              </div>
              <span className="text-xs sm:text-sm leading-tight">Assets</span>
            </button>
            <button 
              onClick={() => handleNavigation("/home/monitor-accounts")}
              className="relative h-full font-semibold flex flex-col items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 rounded-lg transition-colors"
              
            >
              <div className="w-16 h-12 sm:w-24 sm:h-18 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0" style={{ backgroundColor: '#eee8f0' }}>
                <img src="/accounts.png" alt="Monitor Accounts" className="w-8 h-8 sm:w-12 sm:h-12 object-contain" />
              </div>
              <span className="text-xs sm:text-sm leading-tight">Accounts</span>
            </button>
            <button 
              onClick={() => handleNavigation("/home/wallets")}
              className="relative h-full font-semibold flex flex-col items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 rounded-lg transition-colors"
            >
              <div className="w-16 h-12 sm:w-24 sm:h-18 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0" style={{ backgroundColor: '#eee8f0' }}>
                <img src="/address.png" alt="Wallets" className="w-8 h-8 sm:w-12 sm:h-12 object-contain" />
              </div>
              <span className="text-xs sm:text-sm leading-tight">Adresses</span>
            </button>
          </div>
          
          
             <Card className="border-0 shadow-lg" style={{ boxShadow: '0 8px 30px -3px rgba(199, 80, 247, 0.2)' }}>
                <CardContent className="p-3 sm:p-6">
                  <div className="space-y-2 sm:space-y-3">
                    {cryptoCoins.map((coin) => (
                      <div 
                        key={coin.id} 
                        className="flex items-center justify-between p-2 sm:p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:shadow-md transition-shadow gap-2 sm:gap-4 flex-wrap sm:flex-nowrap"
                      >
                        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                          <div 
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: '#c750f7' }}
                          >
                            {coin.icon}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white truncate">{coin.name}</p>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{coin.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-sm sm:text-base text-slate-800 dark:text-white">${coin.price.toLocaleString()}</p>
                          <p className={`text-xs sm:text-sm font-semibold ${coin.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {coin.change >= 0 ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />}
                            {coin.change >= 0 ? '+' : ''}{coin.change}%
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          className="text-white font-semibold text-xs sm:text-sm h-8 sm:h-10 flex-shrink-0"
                          style={{ backgroundColor: '#c750f7' }}
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

                </section>
      </div>
 <footer className="mt-8 bg-white text-gray-900 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-6 mb-6">
            <a href="/home/privacy" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline">privacy policy</a>
            <a href="/home/help" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline">Help</a>
            <a href="#assets" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline">our socials</a>
            <a href="#logout" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline">Logout</a>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 flex items-center justify-center">
                  <Image
                    src="/cryptosnooplogo1.png"
                    alt="DIVAFlex Logo"
                    width={48}
                    height={32}
                    className="object-contain"
                    priority
                  />
                </div>
            <h4 className="text-xl font-bold">CryptoSnoop</h4>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-2">Track your crypto journey with confidence</p>
          <p className="text-gray-600">© 2025 CryptoSnoop. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}