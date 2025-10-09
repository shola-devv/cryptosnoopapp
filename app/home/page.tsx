"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: '#c750f7' }}>
                <span className="text-white font-bold text-lg sm:text-xl">C</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-base sm:text-lg leading-tight" style={{ color: '#c750f7' }}>crypto</span>
                <span className="text-slate-700 dark:text-slate-300 font-bold text-base sm:text-lg leading-tight -mt-1">
                  Snoop
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Profile Header */}
        <section className="mb-6">
          <Card className="border-0 shadow-lg" style={{ boxShadow: '0 8px 30px -3px rgba(199, 80, 247, 0.3)' }}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-full blur-lg opacity-40" style={{ backgroundColor: '#c750f7' }}></div>
                  <Avatar className="w-16 h-16 border-2 relative" style={{ borderColor: '#c750f7' }}>
                    <AvatarImage src="/placeholder.svg?height=64&width=64" alt="John Doe" />
                    <AvatarFallback className="text-lg font-bold text-white" style={{ backgroundColor: '#c750f7' }}>JD</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Welcome!</h2>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowBalance(!showBalance)}>
                      {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Value</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-white">
                        {showBalance ? `${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '••••••'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">24h Change</p>
                      <p className={`text-lg font-bold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {showBalance ? `${totalChange >= 0 ? '+' : ''}${Math.abs(totalChange * totalValue / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '••••••'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Assets</p>
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
          <Tabs defaultValue="assets" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-2 h-auto p-1" style={{ backgroundColor: 'rgba(199, 80, 247, 0.1)' }}>
              <TabsTrigger 
                value="assets" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 relative h-full text-sm font-semibold flex flex-col items-center gap-2 py-3"
                asChild
              >
                <a href="/home/assets">
                  <div className="w-24 h-18 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center overflow-hidden">
                    <img src="/placeholder.svg?height=72&width=96" alt="Assets" className="w-full h-full object-cover" />
                  </div>
                  <span>ASSETS</span>
                </a>
              </TabsTrigger>
              <TabsTrigger 
                value="monitor" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 relative h-full text-sm font-semibold flex flex-col items-center gap-2 py-3"
                asChild
              >
                <a href="/home/monitor-accounts">
                  <div className="w-24 h-18 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center overflow-hidden">
                    <img src="/placeholder.svg?height=72&width=96" alt="Monitor Accounts" className="w-full h-full object-cover" />
                  </div>
                  <span>MONITOR ACCOUNTS</span>
                </a>
              </TabsTrigger>
              <TabsTrigger 
                value="wallets" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 relative h-full text-sm font-semibold flex flex-col items-center gap-2 py-3"
                asChild
              >
                <a href="/home/wallets">
                  <div className="w-24 h-18 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center overflow-hidden">
                    <img src="/placeholder.svg?height=72&width=96" alt="Wallets" className="w-full h-full object-cover" />
                  </div>
                  <span>WALLETS</span>
                </a>
              </TabsTrigger>
            </TabsList>
            
            {/* Indicator Dots */}
            <div className="flex justify-center gap-2 mb-6">
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

            {/* Assets Tab */}
            <TabsContent value="assets">
              <Card className="border-0 shadow-lg" style={{ boxShadow: '0 8px 30px -3px rgba(199, 80, 247, 0.2)' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" style={{ color: '#c750f7' }} />
                    Available Cryptocurrencies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cryptoCoins.map((coin) => (
                      <div 
                        key={coin.id} 
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                            style={{ backgroundColor: '#c750f7' }}
                          >
                            {coin.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white">{coin.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{coin.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right mr-4">
                          <p className="font-bold text-slate-800 dark:text-white">${coin.price.toLocaleString()}</p>
                          <p className={`text-sm font-semibold ${coin.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {coin.change >= 0 ? <TrendingUp className="w-4 h-4 inline mr-1" /> : <TrendingDown className="w-4 h-4 inline mr-1" />}
                            {coin.change >= 0 ? '+' : ''}{coin.change}%
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          className="text-white font-semibold"
                          style={{ backgroundColor: '#c750f7' }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="monitor">
              <Card className="border-0 shadow-lg" style={{ boxShadow: '0 8px 30px -3px rgba(199, 80, 247, 0.2)' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" style={{ color: '#c750f7' }} />
                    Monitor Accounts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-8 text-slate-500">
                    <p>Monitor accounts feature coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="wallets">
              <Card className="border-0 shadow-lg" style={{ boxShadow: '0 8px 30px -3px rgba(199, 80, 247, 0.2)' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" style={{ color: '#c750f7' }} />
                    My Crypto Wallets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {portfolio.map((coin) => (
                      <div 
                        key={coin.id} 
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                            style={{ backgroundColor: '#c750f7' }}
                          >
                            {coin.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white">{coin.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right mr-4">
                          <p className="font-bold text-slate-800 dark:text-white">${coin.price.toLocaleString()}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="font-semibold"
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
              <Card className="border-0 shadow-lg mt-6" style={{ boxShadow: '0 8px 30px -3px rgba(199, 80, 247, 0.2)' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" style={{ color: '#c750f7' }} />
                    Add Coins to Portfolio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cryptoCoins.filter(coin => !portfolio.find(p => p.id === coin.id)).map((coin) => (
                      <div 
                        key={coin.id} 
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                            style={{ backgroundColor: '#c750f7' }}
                          >
                            {coin.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white">{coin.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right mr-4">
                          <p className="font-bold text-slate-800 dark:text-white">${coin.price.toLocaleString()}</p>
                        </div>
                        <Button 
                          size="sm" 
                          className="text-white font-semibold"
                          style={{ backgroundColor: '#c750f7' }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </main>
  )
}