"use client"

import { useState, useEffect } from "react"
import { Trash2, TrendingUp, TrendingDown, Plus, Edit2, Check, X, DollarSign, PieChart, ArrowLeft, Eye } from "lucide-react"
import Image from "next/image"
import { usePortfolio } from "@/hooks/usePortfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { signOut } from "next-auth/react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


export default function CryptoPortfolioPage() {
  const { portfolio, assets, marketData, refreshAssets, refreshAll, isLoading, error } = usePortfolio()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState<number>("")
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState<any>(null)
  const [quantity, setQuantity] = useState("")
  const [showBalance, setShowBalance] = useState(true)
  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;
  const name = session?.user?.name;
  

  // Calculate totals from portfolio data
  const totalValue = portfolio?.totalValue || 0
  const totalChange = portfolio?.breakdown?.reduce((sum, asset) => {
    return sum + (asset.changePercent || 0) * (asset.value || 0)
  }, 0) / totalValue * 100 || 0

  const buzzClick = () => {
    if(navigator.vibrate) {
      navigator.vibrate(100)
    }
  }

  const handleDeleteAsset = async (name: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return

    try {
      setIsSending(true)
      const response = await fetch(`/api/assets/${name}?userId=${userId}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete asset")
      setMessage("Asset deleted successfully!")
      setMessageType("success")
      await refreshAssets()
      setTimeout(() => {alert('Address deleted successfully!')}, 3000);
    } catch (error) {
      console.error(error)
      setMessage("Failed to delete asset.")
      setMessageType("error")
      setTimeout(() => {alert("Failed to delete asset.")}, 3000);
    } finally {
      setIsSending(false)
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handleEditAmount = (id: string, currentAmount: number) => {
    setEditingId(id)
    setEditAmount(currentAmount.toString())
  }

const handleCancelEdit = () => {
    setEditingId(null)
    setEditAmount("")
  }

  const handleAddClick = (coin: any) => {
    setSelectedCoin(coin)
    setIsModalOpen(true)
    setQuantity("")
    buzzClick()
  }


  const handleSaveAmount = async (name: string, quantity: number) => {
    const newAmount = parseFloat(editAmount)
    if (isNaN(newAmount) || newAmount < 0) return

    try {
      setIsSending(true)
      const response = await fetch(`/api/assets/${name}?userId=${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newAmount }),
      })

      if (!response.ok) throw new Error("Failed to update asset")

      setMessage("Asset updated successfully!")
      setMessageType("success")
      await refreshAll()
      setEditingId(null)
      setEditAmount("")
      setTimeout(() => {alert('Asset updated successfully!')}, 3000);
      handleCancelEdit()
    } catch (error) {
      console.error(error)
      setMessage("Failed to update asset.")
      refreshAssets()
      setMessageType("error")
      setTimeout(() => {alert("Failed to update asset.")}, 3000);
      handleCancelEdit()
    } finally {
      setIsSending(false)
      setTimeout(() => setMessage(""), 3000)
    }
  }

  


  const handleAddAsset = async () => {
    if (!quantity || parseFloat(quantity) <= 0) return
    if (!selectedCoin || !userId) return

    setMessage("")
    setMessageType("")
    setIsSending(true)

    try {
      const assetExists = assets.some(
        (asset) =>
          asset.name.trim().toLowerCase() ===
          selectedCoin.name.trim().toLowerCase()
      )

      const url = assetExists
        ? `/api/assets/${encodeURIComponent(selectedCoin.name)}?userId=${userId}`
        : `/api/assets?userId=${userId}`

      const response = await fetch(url, {
        method: assetExists ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedCoin.name,
          quantity: parseFloat(quantity),
          lastPrice: selectedCoin.price,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setMessage(
        assetExists
          ? `${selectedCoin.name} updated successfully!`
          : `${selectedCoin.name} added successfully!`
      )
      setMessageType("success")
      await refreshAssets()
      setTimeout(() => {
        setIsModalOpen(false)
        setMessage("")
        setMessageType("")
        setQuantity("")
      }, 1500)
    } catch (error) {
      console.error(error)
      setMessage("An error occurred. Please try again.")
      setMessageType("error")
      setTimeout(() => {
        setMessage("")
        setMessageType("")
      }, 3000)
    } finally {
      setIsSending(false)
    }
  }

  const cryptoCoins = marketData?.map((coin: any) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    price: coin.price || 0,
    change: coin.priceChange1d || 0,
    icon: coin.icon || coin.symbol.charAt(0).toUpperCase()
  })) || []

  // Get enriched assets with market data
  const enrichedAssets = assets.map(asset => {
    const marketCoin = marketData?.find(
      coin => coin.name.toLowerCase() === asset.name.toLowerCase()
    )
    return {
      ...asset,
      price: marketCoin?.price || asset.lastPrice || 0,
      change24h: marketCoin?.priceChange1d || 0,
      icon: marketCoin?.icon || asset.name.charAt(0).toUpperCase(),
      symbol: marketCoin?.symbol || asset.name.substring(0, 3).toUpperCase(),
      value: (marketCoin?.price || asset.lastPrice || 0) * asset.quantity
    }
  })

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
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
                        <span
                          className="font-bold text-sm sm:text-lg leading-tight"
                          style={{ color: "#c750f7" }}
                        >
                          crypto
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 font-bold text-sm sm:text-lg leading-tight -mt-1">
                          Snoop
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </header>
      
              <div className="flex justify-center mt-20 sm:mt-24 lg:mt-28">
                <div className="w-16 h-16 border-4 border-[#c750f7] border-t-transparent rounded-full animate-spin"></div>
              </div>
      
              <footer className="mt-[60vh] bg-white text-gray-900 py-12 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <div className="flex items-center justify-center gap-6 mb-6">
                    <a
                      href="/home/privacy"
                      className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline"
                    >
                      privacy policy
                    </a>
                    <a
                      href="/home/help"
                      className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline"
                    >
                      Help
                    </a>
                    <a
                      href={`https://twitter.com/intent/follow?screen_name=${`cryptosnoop_app`}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline"
                    >
                      our socials
                    </a>
                    <a
                      href="#logout"
                      className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline"
                    >
                      Logout
                    </a>
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
                    <h4 className="text-xl font-bold">CryptoSnoop.app</h4>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">
                    Track your crypto journey with confidence
                  </p>
                  <p className="text-gray-600">
                    © 2025 CryptoSnoop. All rights reserved.
                  </p>
                </div>
              </footer>
            </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
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
                        <span
                          className="font-bold text-sm sm:text-lg leading-tight"
                          style={{ color: "#c750f7" }}
                        >
                          crypto
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 font-bold text-sm sm:text-lg leading-tight -mt-1">
                          Snoop
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </header>
      
              <div className="mt-20 sm:mt-12 lg:mt-32">
                <div className="text-center">
                  <p className="text-black mb-4">Error connecting</p>
                  <Button
                    onClick={refreshAll}
                    style={{ backgroundColor: "#c750f7" }}
                    className="text-white"
                  >
                    Retry
                  </Button>
                </div>
              </div>
      
              <footer className="mt-[60vh] bg-white text-gray-900 py-12 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <div className="flex items-center justify-center gap-6 mb-6">
                    <a
                      href="/home/privacy"
                      className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline"
                    >
                      privacy policy
                    </a>
                    <a
                      href="/home/help"
                      className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline"
                    >
                      Help
                    </a>
                    <a
                      href={`https://twitter.com/intent/follow?screen_name=${`cryptosnoop_app`}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline"
                    >
                      our socials
                    </a>
                    <a
                      href="#logout"
                      className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline"
                    >
                      Logout
                    </a>
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
                    <h4 className="text-xl font-bold">CryptoSnoop.app</h4>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">
                    Track your crypto journey with confidence
                  </p>
                  <p className="text-gray-600">
                    © 2025 CryptoSnoop. All rights reserved.
                  </p>
                </div>
              </footer>
            </main>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <a href="/home">
          <button className="flex items-center gap-2 text-[#c750f7] dark:text-slate-400 hover:text-[#c750f7] transition-colors mb-6">
            <ArrowLeft className="w-8 h-8 font-semibold" />
          </button>
        </a>

        {/* Title */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold dark:text-white text-[#c750f7] bg-clip-text">assets</h1>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowBalance(!showBalance)}>
            <Eye className="w-5 h-5 text-[#c750f7]" />
          </Button>
        </div>

       

        {/* Portfolio Summary */}
        <div className="bg-[#c750f7] rounded-3xl p-8 mb-8 shadow-2xl shadow-purple-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-white/80" />
              <p className="text-white/90 font-medium">Total Portfolio Value</p>
            </div>
            <h2 className="text-5xl font-bold text-white mb-4">
              {showBalance ? `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
            </h2>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${totalChange >= 0 ? "bg-green-500/20" : "bg-red-500/20"}`}>
                {totalChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-300" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-300" />
                )}
                <span className={`font-bold text-sm ${totalChange >= 0 ? "text-green-300" : "text-red-300"}`}>
                  {showBalance ? `${totalChange >= 0 ? "+" : ""}${totalChange.toFixed(2)}%` : '••••'}
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
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#c750f7] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all border-2 border-[#d575fc]"
            >
              <Plus className="w-4 h-4" />
              Add Asset
            </button>
          </div>

          {enrichedAssets.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center shadow-xl border border-purple-100 dark:border-purple-900">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <PieChart className="w-10 h-10 text-[#c750f7]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Assets Yet</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">Start building your portfolio by adding cryptocurrencies</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-[#c750f7] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all inline-flex items-center gap-2 border-2 border-[#d575fc]"
              >
                <Plus className="w-5 h-5" />
                Add Your First Asset
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {enrichedAssets.map(asset => {
                const percentOfPortfolio = totalValue > 0 ? (asset.value / totalValue) * 100 : 0

                return (
                  <div
                    key={asset._id}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900 hover:shadow-2xl hover:border-[#c750f7]/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                       {/* Success/Error Message */}
        
                      <div className="flex items-center gap-4">
                        {typeof asset.icon === 'string' && asset.icon.startsWith('http') ? (
                          <img 
                            src={asset.icon} 
                            alt={asset.name}
                            className="w-14 h-14 rounded-2xl"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-[#c750f7]/20 to-purple-200/20 rounded-2xl flex items-center justify-center">
                            <span className="text-2xl font-bold text-[#c750f7]">{asset.icon}</span>
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{asset.name}</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">{asset.symbol}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditAmount(asset._id, asset.quantity)}
                          className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset.name)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          disabled={isSending}
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Holdings</p>
                        {editingId === asset._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editAmount}
                              onChange={e => setEditAmount(e.target.value)}
                              className="w-24 px-2 py-1 border border-[#c750f7] rounded-lg text-sm font-bold dark:bg-slate-800 dark:text-white"
                              maxLength={9} 
                            />
                            <button onClick={() => handleSaveAmount(asset.name, editAmount)} className="p-1 bg-green-500 rounded">
                              <Check className="w-3 h-3 text-white" />
                            </button>
                            <button onClick={handleCancelEdit} className="p-1 bg-red-500 rounded">
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ) : (
                          <p className="font-bold text-slate-900 dark:text-white">
                            {showBalance ? `${asset.quantity.toFixed(asset.price < 1 ? 4 : 6)} ${asset.symbol}` : '••••••'}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Price</p>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {showBalance ? `$${asset.price.toLocaleString(undefined, {
                            minimumFractionDigits: asset.price < 1 ? 2 : 0,
                            maximumFractionDigits: asset.price < 1 ? 6 : 2,
                          })}` : '••••••'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">24h Change</p>
                        <p
                          className={`font-bold flex items-center gap-1 ${
                            asset.change24h >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {asset.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {showBalance ? `${asset.change24h >= 0 ? "+" : ""}${asset.change24h.toFixed(2)}%` : '••••'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Value</p>
                        <p className="font-bold text-[#c750f7]">
                          {showBalance ? `$${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Portfolio Weight</p>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {showBalance ? `${percentOfPortfolio.toFixed(1)}%` : '••••'}
                        </p>
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
      </div>

      {/* Add Asset Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !isSending && setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: '0 20px 60px -10px rgba(199, 80, 247, 0.5)',
            }}
          >
            {/* Spinner overlay when loading */}
            {isSending && (
              <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
                <div className="w-16 h-16 border-4 border-[#c750f7] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <button
              onClick={() => {
                if (!isSending) {
                  setIsModalOpen(false)
                  setSelectedCoin(null)
                  setQuantity("")
                  buzzClick()
                }
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors z-10"
            >
              <X className="w-6 h-6 font-extrabold text-[#c750f7]" />
            </button>

            {selectedCoin ? (
              // Selected Coin View
              <div className="p-6">
                <div className="text-center mb-6">
                  {typeof selectedCoin.icon === 'string' && selectedCoin.icon.startsWith('http') ? (
                    <img
                      src={selectedCoin.icon}
                      alt={selectedCoin.name}
                      className="w-20 h-20 mx-auto rounded-full mb-4"
                    />
                  ) : (
                    <div
                      className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl font-bold text-white mb-4"
                      style={{ backgroundColor: '#c750f7' }}
                    >
                      {selectedCoin.icon}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                    {assets.some(
                      (asset) =>
                        asset.name.trim().toLowerCase() ===
                        selectedCoin.name.trim().toLowerCase()
                    )
                      ? `Update ${selectedCoin.name}`
                      : `Add ${selectedCoin.name}`}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {selectedCoin.symbol}
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                      Coin
                    </Label>
                    <Input
                      value={selectedCoin.name}
                      disabled
                      className="bg-purple-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white font-semibold"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                      Quantity
                    </Label>
                    <Input
                      type="number"
                      placeholder="Enter quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="border-slate-300 dark:border-slate-600 focus:border-[#c750f7] focus:ring-[#c750f7]"
                    maxLength={9}
                    />
                     <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                       {quantity.length}/9 characters
                      </p>
                  </div>

                  {quantity && (
                    <div className="bg-purple-50 dark:bg-slate-700 rounded-lg p-3">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                        Total Value
                      </p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        $
                        {(
                          parseFloat(quantity) * selectedCoin.price
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Success or error message */}
                {message && (
                  <div
                    className={`text-center font-semibold py-2 rounded-lg mb-4 ${
                      messageType === 'success'
                        ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                        : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'
                    }`}
                  >
                    {message}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setSelectedCoin(null)
                      setQuantity("")
                      buzzClick()
                    }}
                    variant="outline"
                    className="flex-1 py-3 rounded-lg border-2 border-slate-300"
                  >
                    Back to List
                  </Button>
                  <Button
                    onClick={handleAddAsset}
                    disabled={!quantity || parseFloat(quantity) <= 0 || isSending}
                    className="flex-1 text-white font-bold py-3 rounded-lg border-4 border-[#d575fc] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#c750f7' }}
                  >
                    {isSending ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        {assets.some(
                          (asset) =>
                            asset.name.trim().toLowerCase() ===
                            selectedCoin.name.trim().toLowerCase()
                        )
                          ? "Update Asset"
                          : "Add Asset"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              // Crypto Coins List View
              <div className="p-6 overflow-y-auto max-h-[85vh]">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">
                  Select Cryptocurrency
                </h3>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-3 sm:p-6">
                    <div className="space-y-2 sm:space-y-3">
                      {cryptoCoins.map((coin) => (
                        <div
                          key={coin.id}
                          className="flex items-center justify-between p-2 sm:p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:shadow-md transition-shadow gap-2 sm:gap-4 flex-wrap sm:flex-nowrap cursor-pointer"
                          onClick={() => handleAddClick(coin)}
                        >
                          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                            {typeof coin.icon === 'string' && coin.icon.startsWith('http') ? (
                              <img
                                src={coin.icon}
                                alt={coin.name}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
                              />
                            ) : (
                              <div
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white flex-shrink-0"
                                style={{ backgroundColor: '#c750f7' }}
                              >
                                {coin.icon}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white truncate">
                                {coin.name}
                              </p>
                              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                {coin.symbol}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-sm sm:text-base text-slate-800 dark:text-white">
                              ${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </p>
                            <p
                              className={`text-xs sm:text-sm font-semibold ${
                                coin.change >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {coin.change >= 0 ? (
                                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                              ) : (
                                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                              )}
                              {coin.change >= 0 ? '+' : ''}
                              {coin.change.toFixed(2)}%
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className="text-white font-semibold text-xs sm:text-sm h-8 sm:h-10 flex-shrink-0 border-2 border-[#d575fc]"
                            style={{ backgroundColor: '#c750f7' }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddClick(coin)
                            }}
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
          </div>
        </div>
      )}
      
       <footer className="bottom-0 left-0 w-full mt-8 bg-white text-gray-900 py-12  z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="flex items-center justify-center gap-6 mb-6">
                  <a href="/home/privacy" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline">privacy policy</a>
                  <a href="/home/help" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline">Help</a>
                   <a href={`https://twitter.com/intent/follow?screen_name=${`cryptosnoop_app`}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline" >our socials</a>
                  <a onClick={() => signOut({ callbackUrl: "/auth/signin" })} className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline">Logout</a>
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
                  <h4 className="text-xl font-bold">CryptoSnoop.app</h4>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-2">Track your crypto journey with confidence</p>
                <p className="text-gray-600">© {new Date().getFullYear()} CryptoSnoop. All rights reserved.</p>
              </div>
            </footer>
    </div>
  )
}