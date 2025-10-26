"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { 
  Eye,
  ChartBarIncreasingIcon,
  Plus,
  RefreshCw,
  ArrowLeft
} from "lucide-react"
import { usePortfolio } from "@/hooks/usePortfolio"

export default function MonitorWalletsPage() {
  const [showBalance, setShowBalance] = useState(true)
  const [walletAddress, setWalletAddress] = useState("")
  const [monitoredWallet, setMonitoredWallet] = useState(null)
  const [isLoadingWallet, setIsLoadingWallet] = useState(false)
  const [walletError, setWalletError] = useState("")

  const { isLoading, error, refreshAll } = usePortfolio()

  const buzzClick = () => {
    if(navigator.vibrate) {
      navigator.vibrate(100)
    }
  }

  const handleAddWallet = async () => {
    if (!walletAddress.trim()) return

    setWalletError("")
    setIsLoadingWallet(true)
    buzzClick()

    try {
      const response = await fetch(`/api/wallet-balance?address=${walletAddress}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch wallet data")
      }

      setMonitoredWallet(data)
    } catch (error) {
      console.error(error)
      setWalletError("Failed to fetch wallet balance. Please check the address and try again.")
    } finally {
      setIsLoadingWallet(false)
    }
  }

  const handleRefresh = async () => {
    if (!walletAddress.trim()) return

    setWalletError("")
    setIsLoadingWallet(true)
    buzzClick()

    try {
      const response = await fetch(`/api/wallet-balance?address=${walletAddress}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to refresh wallet data")
      }

      setMonitoredWallet(data)
    } catch (error) {
      console.error(error)
      setWalletError("Failed to refresh wallet balance. Please try again.")
    } finally {
      setIsLoadingWallet(false)
    }
  }

  const handleNavigation = (path) => {
    window.location.href = path
  }

  // Loading state
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

  // Error state
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

        <div className="flex justify-center mt-20 sm:mt-24 lg:mt-28">
          <div className="text-center">
            <p className="text-black mb-4">Error connecting</p>
            <Button onClick={refreshAll} style={{ backgroundColor: '#c750f7' }} className="text-white">
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

  // Loaded state
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
      {/* ...rest of your component stays exactly the same... */}
      {/* Footer fix applied below */}
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

      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Back Button */}
        <a href="/home">
          <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#c750f7] dark:hover:text-[#c750f7] transition-colors mb-6">
            <ArrowLeft className="w-8 h-8 text-[#c750f7]" />
          </button>
        </a>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold dark:text-white text-[#c750f7] mb-2">Monitor Wallet</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Track wallet balances across all chains
          </p>
        </div>

        {/* Wallet Address Input */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#c750f7] rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Wallet Address</h2>
          </div>

          <div className="flex gap-4">
            <Input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter wallet address (0x...)"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#c750f7] focus:border-transparent transition-all"
              disabled={isLoadingWallet}
            />
            <Button
              onClick={handleAddWallet}
              disabled={!walletAddress.trim() || isLoadingWallet}
              className="px-6 py-3 bg-[#c750f7] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-4 border-[#d575fc]"
            >
              {isLoadingWallet ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Add
                </>
              )}
            </Button>
          </div>

          {walletError && (
            <div className="mt-4 text-center font-semibold py-2 rounded-lg bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200">
              {walletError}
            </div>
          )}
        </div>

        {/* Wallet Balance Display */}
        {monitoredWallet && (
          <section className="mb-6">
            <Card className="border-0 shadow-lg" style={{ boxShadow: '0 8px 30px -3px rgba(199, 80, 247, 0.3)' }}>
              <CardContent className="p-3 sm:p-6">
                {/* Mobile Layout */}
                <div className="flex sm:hidden flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">WALLET BALANCE</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => setShowBalance(!showBalance)}>
                      <Eye className="w-4 h-4 font-extrabold" />
                    </Button>
                  </div>

                  <div className="dark:from-slate-700 dark:to-slate-800 rounded-lg p-3">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total balance</p>
                    <div className="flex items-baseline justify-between">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {showBalance ? `$${monitoredWallet.totalValue?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0.00'}` : '••••••'}
                      </p>
                      <Button 
                        size="sm" 
                        className="text-white font-semibold text-xs h-7 px-2 border-4 border-[#d575fc]"
                        style={{ backgroundColor: '#c750f7' }}
                        onClick={handleRefresh}
                        disabled={isLoadingWallet}
                      >
                        {isLoadingWallet ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            Refresh
                            <RefreshCw className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-3">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Change in 24HR</p>
                      <p className={`text-base font-bold ${monitoredWallet.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {showBalance ? `${monitoredWallet.change24h >= 0 ? '+' : ''}$${Math.abs(monitoredWallet.change24h || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '••••••'}
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-3">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Assets</p>
                      <p className="text-base font-bold">
                        {showBalance ? `${monitoredWallet.assetCount || 0}` : '••••••'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Desktop Layout */}
                <div className="hidden sm:flex flex-row items-start gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white">Wallet Balance</h2>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowBalance(!showBalance)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="dark:from-slate-700 dark:to-slate-800 rounded-lg p-4 mb-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total Balance</p>
                      <div className="flex items-baseline justify-between">
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                          {showBalance ? `$${monitoredWallet.totalValue?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0.00'}` : '••••••'}
                        </p>
                        <Button 
                          size="lg" 
                          className="text-white rounded-xl font-extrabold border-4 border-[#d575fc]"
                          style={{ backgroundColor: '#c750f7' }}
                          onClick={handleRefresh}
                          disabled={isLoadingWallet}
                        >
                          {isLoadingWallet ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              Refresh
                              <RefreshCw className="font-extrabold w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="dark:bg-slate-800 rounded-lg p-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Change in 24HR</p>
                        <p className={`text-lg font-bold ${monitoredWallet.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {showBalance ? `${monitoredWallet.change24h >= 0 ? '+' : ''}$${Math.abs(monitoredWallet.change24h || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '••••••'}
                        </p>
                      </div>
                      <div className="dark:bg-slate-800 rounded-lg p-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Assets</p>
                        <p className="text-lg font-bold">
                          {showBalance ? `${monitoredWallet.assetCount || 0}` : '••••••'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>

      <footer className="fixed bottom-0 left-0 w-full mt-8 bg-white text-gray-900 py-12  z-10">
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
            © {new Date().getFullYear()} CryptoSnoop. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
