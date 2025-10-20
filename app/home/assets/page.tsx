"use client"

import { useState, useEffect } from "react"
import { Trash2, TrendingUp, TrendingDown, Plus, Edit2, Check, X, DollarSign, PieChart, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { usePortfolio } from "@/hooks/usePortfolio"

export default function CryptoPortfolioPage() {
  const { assets, refreshPortfolio } = usePortfolio()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState("")
  const [totalValue, setTotalValue] = useState(0)
  const [totalChange, setTotalChange] = useState(0)
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")

  useEffect(() => {
    calculateTotals()
  }, [assets])

  const calculateTotals = () => {
    let total = 0
    let weightedChange = 0

    assets.forEach(asset => {
      const value = asset.amount * asset.price
      total += value
      weightedChange += value * asset.change24h
    })

    setTotalValue(total)
    setTotalChange(total > 0 ? weightedChange / total : 0)
  }

  const handleDeleteAsset = async (id: string) => {
    try {
      setIsSending(true)
      const response = await fetch(`/api/assets/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete asset")
      await refreshPortfolio()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSending(false)
    }
  }

  const handleEditAmount = (id: string, currentAmount: number) => {
    setEditingId(id)
    setEditAmount(currentAmount.toString())
  }

  const handleSaveAmount = async (id: string) => {
    const newAmount = parseFloat(editAmount)
    if (isNaN(newAmount) || newAmount < 0) return

    try {
      setIsSending(true)
      const response = await fetch(`/api/assets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: newAmount }),
      })

      if (!response.ok) throw new Error("Failed to update asset")

      setMessage("Asset updated successfully!")
      setMessageType("success")
      await refreshPortfolio()
      setEditingId(null)
      setEditAmount("")
    } catch (error) {
      console.error(error)
      setMessage("Failed to update asset.")
      setMessageType("error")
    } finally {
      setIsSending(false)
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditAmount("")
  }

  const handleAddAsset = async (assetName: string, quantity: number, price: number, userId: string) => {
    if (!quantity || quantity <= 0) return
    if (!assetName || !userId) return

    setMessage("")
    setMessageType("")
    setIsSending(true)

    try {
      const assetExists = assets.some(
        asset => asset.name.trim().toLowerCase() === assetName.trim().toLowerCase()
      )

      const response = await fetch(
        assetExists
          ? `/api/assets/${assetName}?userId=${userId}`
          : `/api/assets?userId=${userId}`,
        {
          method: assetExists ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: assetName,
            quantity,
            lastPrice: price,
          }),
        }
      )

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Something went wrong")

      setMessage(assetExists ? `${assetName} updated successfully!` : `${assetName} added successfully!`)
      setMessageType("success")
      await refreshPortfolio()
    } catch (error) {
      console.error(error)
      setMessage("An error occurred. Please try again.")
      setMessageType("error")
    } finally {
      setIsSending(false)
      setTimeout(() => setMessage(""), 3000)
    }
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold dark:text-white mb-2 text-[#c750f7] bg-clip-text">assets</h1>
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
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${totalChange >= 0 ? "bg-green-500/20" : "bg-red-500/20"}`}>
                {totalChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-300" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-300" />
                )}
                <span className={`font-bold text-sm ${totalChange >= 0 ? "text-green-300" : "text-red-300"}`}>
                  {totalChange >= 0 ? "+" : ""}
                  {totalChange.toFixed(2)}%
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
              {assets.map(asset => {
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
                          <span className="text-2xl font-bold text-[#c750f7]">{asset.symbol}</span>
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
                        >
                          <Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
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
                              onChange={e => setEditAmount(e.target.value)}
                              className="w-24 px-2 py-1 border border-[#c750f7] rounded-lg text-sm font-bold dark:bg-slate-800"
                            />
                            <button onClick={() => handleSaveAmount(asset.id)} className="p-1 bg-green-500 rounded">
                              <Check className="w-3 h-3 text-white" />
                            </button>
                            <button onClick={handleCancelEdit} className="p-1 bg-red-500 rounded">
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
                            maximumFractionDigits: asset.price < 1 ? 6 : 2,
                          })}
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
                          {asset.change24h >= 0 ? "+" : ""}
                          {asset.change24h.toFixed(2)}%
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Value</p>
                        <p className="font-bold text-[#c750f7]">
                          ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

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
      </div>
    </div>
  )
}
