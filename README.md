#6A5ACD

rgb(106, 90, 205)



#6Cc6CFF
rgb(108, 108, 255)


[#5AB5EE]
[#6CC6FF]/20


GOOD CODE 
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  const totalChange = 1.8

  const handleNavigation = (path) => {
    window.location.href = path
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#c750f7' }}>
                <span className="text-white font-bold text-sm sm:text-lg">C</span>
              </div>
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
              <div className="flex sm:hidden flex-col gap-3">
                {/* Top Row: Avatar, Welcome + Total Value, Eye Icon */}
                <div className="flex items-start justify-between">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-full blur-lg opacity-40" style={{ backgroundColor: '#c750f7' }}></div>
                    <Avatar className="w-10 h-10 border-2 relative" style={{ borderColor: '#c750f7' }}>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="John Doe" />
                      <AvatarFallback className="text-sm font-bold text-white" style={{ backgroundColor: '#c750f7' }}>JD</AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-end gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowBalance(!showBalance)}>
                      {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </Button>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-0.5">Welcome!</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Total Value</p>
                      <p className="text-base font-bold text-slate-800 dark:text-white">
                        {showBalance ? `${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '••••••'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Row: 24h Change, Total Assets, Button */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">24h Change</p>
                      <p className={`text-sm font-bold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {showBalance ? `${totalChange >= 0 ? '+' : ''}${Math.abs(totalChange * totalValue / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '••••••'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Total Assets</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{portfolio.length}</p>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="text-white font-semibold text-xs h-8 px-3"
                    style={{ backgroundColor: '#c750f7' }}
                  >
                    View
                  </Button>
                </div>
              </div>
              
              {/* Desktop Layout - Unchanged */}
              <div className="hidden sm:flex flex-row items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-full blur-lg opacity-40" style={{ backgroundColor: '#c750f7' }}></div>
                  <Avatar className="w-16 h-16 border-2 relative" style={{ borderColor: '#c750f7' }}>
                    <AvatarImage src="/placeholder.svg?height=64&width=64" alt="John Doe" />
                    <AvatarFallback className="text-lg font-bold text-white" style={{ backgroundColor: '#c750f7' }}>JD</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Welcome!</h2>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowBalance(!showBalance)}>
                      {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Value</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-white">
                        {showBalance ? `${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '••••••'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">24h Change</p>
                      <p className={`text-lg font-bold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {showBalance ? `${totalChange >= 0 ? '+' : ''}${Math.abs(totalChange * totalValue / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '••••••'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Assets</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-white">{portfolio.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tabs Section */}
        <section className="mb-8">
          <div className="grid w-full grid-cols-3 mb-2 h-auto p-1 gap-1 rounded-lg" style={{ backgroundColor: 'rgba(199, 80, 247, 0.1)' }}>
            <button 
              onClick={() => handleNavigation("/home/assets")}
              className="relative h-full font-semibold flex flex-col items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 rounded-lg transition-colors"
              style={{ backgroundColor: activeTab === 'assets' ? 'white' : 'transparent' }}
            >
              <div className="w-16 h-12 sm:w-24 sm:h-18 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src="/placeholder.svg?height=72&width=96" alt="Assets" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs sm:text-sm leading-tight">ASSETS</span>
            </button>
            <button 
              onClick={() => handleNavigation("/home/monitor-accounts")}
              className="relative h-full font-semibold flex flex-col items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 rounded-lg transition-colors"
              style={{ backgroundColor: activeTab === 'monitor' ? 'white' : 'transparent' }}
            >
              <div className="w-16 h-12 sm:w-24 sm:h-18 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src="/placeholder.svg?height=72&width=96" alt="Monitor Accounts" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs sm:text-sm leading-tight">MONITOR</span>
            </button>
            <button 
              onClick={() => handleNavigation("/home/wallets")}
              className="relative h-full font-semibold flex flex-col items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 rounded-lg transition-colors"
              style={{ backgroundColor: activeTab === 'wallets' ? 'white' : 'transparent' }}
            >
              <div className="w-16 h-12 sm:w-24 sm:h-18 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src="/placeholder.svg?height=72&width=96" alt="Wallets" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs sm:text-sm leading-tight">WALLETS</span>
            </button>
          </div>
          
          {/* Indicator Dots */}
          <div className="flex justify-center gap-2 mb-4 sm:mb-6">
            <div 
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{ backgroundColor: activeTab === 'assets' ? '#c750f7' : '#cbd5e1' }}
            ></div>
            <div 
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{ backgroundColor: activeTab === 'monitor' ? '#c750f7' : '#cbd5e1' }}
            ></div>
            <div 
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{ backgroundColor: activeTab === 'wallets' ? '#c750f7' : '#cbd5e1' }}
            ></div>
          </div>

          {activeTab === 'assets' && (
            <div>
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
            </div>
          )}

          {activeTab === 'monitor' && (
            <div>
              <Card className="border-0 shadow-lg" style={{ boxShadow: '0 8px 30px -3px rgba(199, 80, 247, 0.2)' }}>
                <CardHeader className="p-3 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#c750f7' }} />
                    Monitor Accounts
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 space-y-6">
                  <div className="text-center py-8 text-slate-500 text-sm sm:text-base">
                    <p>Monitor accounts feature coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'wallets' && (
            <div>
              <Card className="border-0 shadow-lg" style={{ boxShadow: '0 8px 30px -3px rgba(199, 80, 247, 0.2)' }}>
                <CardHeader className="p-3 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#c750f7' }} />
                    My Crypto Wallets
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <div className="space-y-2 sm:space-y-3">
                    {portfolio.map((coin) => (
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
                          <div>
                            <p className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white">{coin.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-sm sm:text-base text-slate-800 dark:text-white">${coin.price.toLocaleString()}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="font-semibold text-xs sm:text-sm h-8 sm:h-10 flex-shrink-0"
                          style={{ borderColor: '#c750f7', color: '#c750f7' }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Available Coins to Add */}
              <Card className="border-0 shadow-lg mt-4 sm:mt-6" style={{ boxShadow: '0 8px 30px -3px rgba(199, 80, 247, 0.2)' }}>
                <CardHeader className="p-3 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#c750f7' }} />
                    Add Coins to Portfolio
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <div className="space-y-2 sm:space-y-3">
                    {cryptoCoins.filter(coin => !portfolio.find(p => p.id === coin.id)).map((coin) => (
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
                          <div>
                            <p className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white">{coin.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-sm sm:text-base text-slate-800 dark:text-white">${coin.price.toLocaleString()}</p>
                        </div>
                        <Button 
                          size="sm" 
                          className="text-white font-semibold text-xs sm:text-sm h-8 sm:h-10 flex-shrink-0"
                          style={{ backgroundColor: '#c750f7' }}
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      </div>
      <footer className=" bg-white dark:bg-slate-900 border-t border-purple-200 dark:border-purple-900 py-12">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#c750f7] to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">CryptoSnoop</h4>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-2">Track your crypto journey with confidence</p>
          <p className="text-slate-500 dark:text-slate-500 text-sm">© 2025 CryptoSnoop. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  const totalChange = 1.8

  const handleNavigation = (path) => {
    window.location.href = path
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#c750f7' }}>
                <span className="text-white font-bold text-sm sm:text-lg">C</span>
              </div>
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
              <div className="flex sm:hidden flex-col gap-3">
                {/* Top Row: Avatar, Welcome + Total Value, Eye Icon */}
                <div className="flex items-start justify-between">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-full blur-lg opacity-40" style={{ backgroundColor: '#c750f7' }}></div>
                    <Avatar className="w-10 h-10 border-2 relative" style={{ borderColor: '#c750f7' }}>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="John Doe" />
                      <AvatarFallback className="text-sm font-bold text-white" style={{ backgroundColor: '#c750f7' }}>JD</AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-end gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowBalance(!showBalance)}>
                      {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </Button>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-0.5">Welcome!</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Total Value</p>
                      <p className="text-base font-bold text-slate-800 dark:text-white">
                        {showBalance ? `${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '••••••'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Row: 24h Change, Total Assets, Button */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">24h Change</p>
                      <p className={`text-sm font-bold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {showBalance ? `${totalChange >= 0 ? '+' : ''}${Math.abs(totalChange * totalValue / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '••••••'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Total Assets</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{portfolio.length}</p>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="text-white font-semibold text-xs h-8 px-3"
                    style={{ backgroundColor: '#c750f7' }}
                  >
                    View
                  </Button>
                </div>
              </div>
              
              {/* Desktop Layout - Unchanged */}
              <div className="hidden sm:flex flex-row items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-full blur-lg opacity-40" style={{ backgroundColor: '#c750f7' }}></div>
                  <Avatar className="w-16 h-16 border-2 relative" style={{ borderColor: '#c750f7' }}>
                    <AvatarImage src="/placeholder.svg?height=64&width=64" alt="John Doe" />
                    <AvatarFallback className="text-lg font-bold text-white" style={{ backgroundColor: '#c750f7' }}>JD</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Welcome!</h2>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowBalance(!showBalance)}>
                      {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Value</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-white">
                        {showBalance ? `${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '••••••'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">24h Change</p>
                      <p className={`text-lg font-bold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {showBalance ? `${totalChange >= 0 ? '+' : ''}${Math.abs(totalChange * totalValue / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '••••••'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Assets</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-white">{portfolio.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tabs Section */}
        <section className="mb-8">
          <div className="grid w-full grid-cols-3 mb-2 h-auto p-1 gap-1 rounded-lg" style={{ backgroundColor: 'rgba(199, 80, 247, 0.1)' }}>
            <button 
              onClick={() => handleNavigation("/home/assets")}
              className="relative h-full font-semibold flex flex-col items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 rounded-lg transition-colors"
            
            >
              <div className="w-16 h-12 sm:w-24 sm:h-18 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src="/cryptosnooplogo1.png" alt="Assets" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs sm:text-sm leading-tight">ASSETS</span>
            </button>
            <button 
              onClick={() => handleNavigation("/home/monitor-accounts")}
              className="relative h-full font-semibold flex flex-col items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 rounded-lg transition-colors"
              
            >
              <div className="w-16 h-12 sm:w-24 sm:h-18 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src="/cryptosnooplogo1.png" alt="Monitor Accounts" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs sm:text-sm leading-tight">MONITOR</span>
            </button>
            <button 
              onClick={() => handleNavigation("/home/wallets")}
              className="relative h-full font-semibold flex flex-col items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 rounded-lg transition-colors"
            >
              <div className="w-16 h-12 sm:w-24 sm:h-18 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src="/cryptosnooplogo1.png" alt="Wallets" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs sm:text-sm leading-tight">WALLETS</span>
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
      <footer className=" bg-white dark:bg-slate-900 border-t border-purple-200 dark:border-purple-900 py-12">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#c750f7] to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">CryptoSnoop</h4>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-2">Track your crypto journey with confidence</p>
          <p className="text-slate-500 dark:text-slate-500 text-sm">© 2025 CryptoSnoop. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}