"use client"

import { useState, useEffect } from "react"
import { Trash2, TrendingUp, TrendingDown, Plus, Edit2, Check, X, DollarSign, PieChart, ArrowLeft, LogOut } from "lucide-react"
import Image from "next/image"

export default function CryptoPortfolioPage() {
  const [assets, setAssets] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editAmount, setEditAmount] = useState("")
  const [totalValue, setTotalValue] = useState(0)
  const [totalChange, setTotalChange] = useState(0)

  // Mock crypto prices (in real app, fetch from API)
  const cryptoPrices = {
    bitcoin: { price: 65432.1, change24h: 2.5, symbol: "BTC" },
    ethereum: { price: 3521.45, change24h: -1.2, symbol: "ETH" },
    solana: { price: 142.87, change24h: 5.7, symbol: "SOL" },
    cardano: { price: 0.45, change24h: -0.8, symbol: "ADA" },
    ripple: { price: 0.52, change24h: 1.3, symbol: "XRP" }
  }

  useEffect(() => {
    // Load assets from memory on component mount
    loadAssets()
  }, [])

  useEffect(() => {
    // Calculate total portfolio value
    calculateTotals()
  }, [assets])

  const loadAssets = () => {
    // In real app, fetch from backend or state management
    // For demo, using mock data
    const mockAssets = [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        amount: 0.5,
        price: 65432.1,
        change24h: 2.5
      },
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        amount: 2.3,
        price: 3521.45,
        change24h: -1.2
      }
    ]
    setAssets(mockAssets)
  }

  const calculateTotals = () => {
    let total = 0
    let weightedChange = 0

    assets.forEach(asset => {
      const value = asset.amount * asset.price
      total += value
      weightedChange += (value * asset.change24h)
    })

    setTotalValue(total)
    setTotalChange(total > 0 ? (weightedChange / total) : 0)
  }

  const handleDeleteAsset = (id) => {
    setAssets(assets.filter(asset => asset.id !== id))
  }

  const handleEditAmount = (id, currentAmount) => {
    setEditingId(id)
    setEditAmount(currentAmount.toString())
  }

  const handleSaveAmount = (id) => {
    const newAmount = parseFloat(editAmount)
    if (!isNaN(newAmount) && newAmount >= 0) {
      setAssets(assets.map(asset => 
        asset.id === id ? { ...asset, amount: newAmount } : asset
      ))
    }
    setEditingId(null)
    setEditAmount("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditAmount("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900">
      {/* Header */}
      

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <a href="/home">
        <button className="flex items-center gap-2 text-[#c750f7]  dark:text-slate-400 hover:text-[#c750f7] dark:hover:text-[#c750f7] transition-colors mb-6">
          <ArrowLeft className="w-8 h-8 font-semibold" />
        </button>
        </a>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold dark:text-white mb-2 text-[#c750f7] bg-clip-text ">
            assets
          </h1>
        </div>

        {/* Portfolio Summary Card */}
        <div className="bg-[#c750f7] rounded-3xl p-8 mb-8 shadow-2xl shadow-purple-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-white/80" />
              <p className="text-white/90 font-medium">Total Portfolio Value</p>
            </div>
            <h2 className="text-5xl font-bold text-white mb-4">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${totalChange >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {totalChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-300" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-300" />
                )}
                <span className={`font-bold text-sm ${totalChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)}%
                </span>
              </div>
              <span className="text-white/70 text-sm">24h Change</span>
            </div>
          </div>
        </div>

        {/* Assets List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-6 h-6 text-[#c750f7]" />
              Your Assets
            </h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#c750f7] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all">
              <Plus className="w-4 h-4" />
              Add Asset
            </button>
          </div>

          {assets.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center shadow-xl border border-purple-100 dark:border-purple-900">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <PieChart className="w-10 h-10 text-[#c750f7]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Assets Yet</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">Start building your portfolio by adding cryptocurrencies</p>
              <button className="px-6 py-3 bg-[#c750f7] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Your First Asset
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {assets.map((asset) => {
                const value = asset.amount * asset.price
                const percentOfPortfolio = totalValue > 0 ? (value / totalValue) * 100 : 0

                return (
                  <div 
                    key={asset.id} 
                    className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900 hover:shadow-2xl hover:border-[#c750f7]/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#c750f7]/20 to-purple-600/20 rounded-2xl flex items-center justify-center">
                          <span className="text-2xl font-bold text-[#c750f7]">{asset.symbol.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{asset.name}</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">{asset.symbol}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditAmount(asset.id, asset.amount)}
                          className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                          title="Edit amount"
                        >
                          <Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </button>
                        <button 
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Remove asset"
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Holdings</p>
                        {editingId === asset.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              className="w-24 px-2 py-1 border border-[#c750f7] rounded-lg text-sm font-bold dark:bg-slate-800"
                              step="0.000001"
                              min="0"
                            />
                            <button onClick={() => handleSaveAmount(asset.id)} className="p-1 bg-green-500 rounded hover:bg-green-600 transition-colors">
                              <Check className="w-3 h-3 text-white" />
                            </button>
                            <button onClick={handleCancelEdit} className="p-1 bg-red-500 rounded hover:bg-red-600 transition-colors">
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ) : (
                          <p className="font-bold text-slate-900 dark:text-white">
                            {asset.amount.toFixed(asset.price < 1 ? 4 : 6)} {asset.symbol}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Price</p>
                        <p className="font-bold text-slate-900 dark:text-white">
                          ${asset.price.toLocaleString(undefined, { 
                            minimumFractionDigits: asset.price < 1 ? 2 : 0,
                            maximumFractionDigits: asset.price < 1 ? 6 : 2 
                          })}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">24h Change</p>
                        <p className={`font-bold flex items-center gap-1 ${asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {asset.change24h >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Value</p>
                        <p className="font-bold text-[#c750f7]">
                          ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

                    {/* Portfolio Percentage Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Portfolio Weight</p>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{percentOfPortfolio.toFixed(1)}%</p>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#c750f7] to-[#cf56ff] rounded-full transition-all duration-500"
                          style={{ width: `${percentOfPortfolio}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {assets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Total Assets</p>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{assets.length}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Best Performer</p>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {assets.reduce((best, asset) => asset.change24h > best.change24h ? asset : best, assets[0])?.symbol || '-'}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[#c750f7]" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Largest Holding</p>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {assets.reduce((largest, asset) => (asset.amount * asset.price) > (largest.amount * largest.price) ? asset : largest, assets[0])?.symbol || '-'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-32 bg-white text-gray-900 py-12 relative z-10">
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
    </div>
  )
}