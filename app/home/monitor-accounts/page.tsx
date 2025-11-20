"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { 
  Eye,
  Plus,
  RefreshCw,
  ArrowLeft
} from "lucide-react"
import { usePortfolio } from "@/hooks/usePortfolio"
import { signOut } from "next-auth/react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SUPPORTED_CHAINS = [
  { id: 'ethereum', name: 'Ethereum', icon: '⟠', color: '#627EEA' },
  { id: 'solana', name: 'Solana', icon: '◎', color: '#14F195' },
  { id: 'polygon', name: 'Polygon', icon: '⬡', color: '#8247E5' },
  { id: 'bsc', name: 'BSC', icon: '◆', color: '#F3BA2F' },
  { id: 'arbitrum', name: 'Arbitrum', icon: '◢', color: '#28A0F0' },
  { id: 'optimism', name: 'Optimism', icon: '🔴', color: '#FF0420' },
  { id: 'avalanche', name: 'Avalanche', icon: '▲', color: '#E84142' }
];

const avatarOptions = [
  { color: '#FF6B6B', label: 'Red' },
  { color: '#4ECDC4', label: 'Teal' },
  { color: '#95E1D3', label: 'Mint' },
  { color: '#F38181', label: 'Pink' },
  { color: '#AA96DA', label: 'Purple' },
  { color: '#FCBAD3', label: 'Light Pink' },
];

interface Asset {
  coinId: string;
  amount: number;
  name: string;
  symbol: string;
  price: number;
  priceBtc: number;
  imgUrl: string;
  pCh24h: number;
  rank: number;
  volume: number;
  chain: string;
}

interface WalletData {
  address: string;
  chain: string;
  tokens: Asset[];
  totalValue: number;
  change24h: number;
  assetCount: number;
  timestamp: number;
  source: string;
}

interface CachedWallet {
  walletData: WalletData;
  walletAddress: string;
  selectedChain: string;
  timestamp: number;
}

// localStorage utility functions
const walletStorage = {
  setCachedWallet: (wallet: CachedWallet) => {
    try {
      localStorage.setItem('cachedWallet', JSON.stringify(wallet));
    } catch (error) {
      console.error('Error saving wallet to localStorage:', error);
    }
  },
  
  getCachedWallet: (): CachedWallet | null => {
    try {
      const cached = localStorage.getItem('cachedWallet');
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error retrieving wallet from localStorage:', error);
      return null;
    }
  },
  
  clearCachedWallet: () => {
    try {
      localStorage.removeItem('cachedWallet');
    } catch (error) {
      console.error('Error clearing wallet cache:', error);
    }
  }
};

export default function MonitorWalletsPage() {
  const [showBalance, setShowBalance] = useState(true)
  const [walletAddress, setWalletAddress] = useState("")
  const [monitoredWallet, setMonitoredWallet] = useState<WalletData | null>(null)
  const [isLoadingWallet, setIsLoadingWallet] = useState(false)
  const [walletError, setWalletError] = useState("")
  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;
  const [selectedChain, setSelectedChain] = useState('ethereum')
  const [showChainDropdown, setShowChainDropdown] = useState(false)
  const [userAvatar, setUserAvatar] = useState(avatarOptions[2])
  const [profile, setProfile] = useState<number | undefined>(2)
  const [userName, setUserName] = useState('User')
  const [isHydrated, setIsHydrated] = useState(false)

  const selectedChainData = SUPPORTED_CHAINS.find(chain => chain.id === selectedChain)
  const { isLoading, error, refreshAll } = usePortfolio()

  const [isOpen, setIsOpen] = useState(true);

// ensure isOpen follows monitoredWallet changes so the arrow + open state never get out of sync
useEffect(() => {
  setIsOpen(!monitoredWallet);
}, [monitoredWallet]);

// Use isOpen directly in your JSX
const componentOpen = isOpen;


  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('fetching profile data')
      const response = await fetch(`/api/users?userId=${userId}`, {
        method: "GET",
      });
      const data = await response.json();
      
      if (response.ok && data.user) {
        const avatarIndex = data.user.profile ?? 1;
        setProfile(avatarIndex);
        setUserAvatar(avatarOptions[avatarIndex]);
        setUserName(data.user.username || data.user.name || 'User');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  // Load cached wallet data on component mount
  useEffect(() => {
    const cached = walletStorage.getCachedWallet();
    if (cached) {
      setWalletAddress(cached.walletAddress);
      setSelectedChain(cached.selectedChain);
      setMonitoredWallet(cached.walletData);
    }
    setIsHydrated(true);
  }, []);

  // Load profile on mount
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserProfile(session.user.id);
    }
  }, [session?.user?.id]);

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
      const response = await fetch(
        `/api/wallet-balance?address=${encodeURIComponent(walletAddress)}&chain=${selectedChain}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch wallet data")
      }

      setMonitoredWallet(data);
      
      // Save to localStorage
      walletStorage.setCachedWallet({
        walletData: data,
        walletAddress,
        selectedChain,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error(error)
      setWalletError("Failed to fetch wallet data. Please check the address and try again.")
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
      const response = await fetch(
        `/api/wallet-balance?address=${encodeURIComponent(walletAddress)}&chain=${selectedChain}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to refresh wallet data")
      }

      setMonitoredWallet(data);
      
      // Update localStorage with fresh data
      walletStorage.setCachedWallet({
        walletData: data,
        walletAddress,
        selectedChain,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error(error)
      setWalletError("Failed to refresh wallet data. Please try again.")
    } finally {
      setIsLoadingWallet(false)
    }
  }

  const handleClearCache = () => {
    walletStorage.clearCachedWallet();
    setMonitoredWallet(null);
    setWalletAddress("");
    setWalletError("");
  }

  // Get top 15 assets sorted by value
  const topAssets = monitoredWallet?.tokens 
    ? [...monitoredWallet.tokens]
        .sort((a, b) => {
          const valueA = (a.amount || 0) * (a.price || 0);
          const valueB = (b.amount || 0) * (b.price || 0);
          return valueB - valueA;
        })
        .slice(0, 15)
    : [];

  // Loading state
  if (isLoading || !isHydrated) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
          <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/cryptosnooplogo1.png"
                  alt="CryptoSnoop Logo"
                  width={48}
                  height={32}
                  className="object-contain"
                  priority
                />
                <div className="flex flex-col leading-none">
                  <span className="font-bold text-sm sm:text-lg leading-tight" style={{ color: "#c750f7" }}>
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
            <p className="text-gray-600">© 2025 CryptoSnoop. All rights reserved.</p>
          </div>
        </footer>
      </main>
    )
  }

  // Loaded state
  return (
  <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/cryptosnooplogo1.png"
              alt="CryptoSnoop Logo"
              width={48}
              height={32}
              className="object-contain"
              priority
            />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-sm sm:text-lg leading-tight" style={{ color: "#c750f7" }}>
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
        <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#c750f7] dark:hover:text-[#c750f7] transition-colors mb-2 cursor-pointer">
          <ArrowLeft className="w-8 h-8 text-[#c750f7]" />
        </button>
      </a>

      {/* Page Title */}

      {/* Wallet Address Input with Chain Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900 mb-8">
        {/* HEADER: always visible */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#c750f7] rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Add Wallet Address
            </h2>
          </div>

          {/* ARROW TOGGLE (ONLY THIS CONTROLS isOpen) */}
          <svg
            onClick={() => setIsOpen(!isOpen)}
            className={`w-6 h-6 text-slate-700 dark:text-white cursor-pointer transition-transform ${
              componentOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* COLLAPSED MODE → show nothing else */}
        {!componentOpen && <></>}

        {/* EXPANDED MODE */}
        {componentOpen && (
          <>
            {/* Your new responsive small text */}
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
              Track wallet balances across all chains
            </p>

            {/* Chain Selector */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Select Blockchain
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowChainDropdown(!showChainDropdown)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-left flex items-center justify-between hover:border-[#c750f7] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedChainData?.icon}</span>
                    <span className="font-semibold">{selectedChainData?.name}</span>
                  </div>

                  <svg
                    className={`w-5 h-5 transition-transform ${
                      showChainDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showChainDropdown && (
                  <div className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                    {SUPPORTED_CHAINS.map((chain) => (
                      <button
                        key={chain.id}
                        onClick={() => {
                          setSelectedChain(chain.id);
                          setShowChainDropdown(false);
                        }}
                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
                          selectedChain === chain.id ? "bg-purple-50 dark:bg-slate-700" : ""
                        }`}
                      >
                        <span className="text-2xl">{chain.icon}</span>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-slate-900 dark:text-white">{chain.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {chain.id === "ethereum" && "The original smart contract platform"}
                            {chain.id === "solana" && "High-performance blockchain"}
                            {chain.id === "polygon" && "Layer 2 scaling solution"}
                            {chain.id === "bsc" && "Binance Smart Chain"}
                            {chain.id === "arbitrum" && "Optimistic rollup L2"}
                            {chain.id === "optimism" && "Optimistic Ethereum L2"}
                            {chain.id === "avalanche" && "High-throughput blockchain"}
                          </p>
                        </div>
                        {selectedChain === chain.id && (
                          <div className="w-2 h-2 rounded-full bg-[#c750f7]"></div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Wallet Address Input */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder={
                  selectedChain === "solana"
                    ? "Enter Solana address..."
                    : "Enter wallet address (0x...)"
                }
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#c750f7] focus:border-transparent transition-all"
                disabled={isLoadingWallet}
              />

              <Button
                onClick={handleAddWallet}
                disabled={!walletAddress.trim() || isLoadingWallet}
                className="px-6 py-3 bg-[#c750f7] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-4 border-[#d575fc] cursor-pointer"
              >
                {isLoadingWallet ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    <span>Track</span>
                  </div>
                )}
              </Button>
            </div>

            {/* Selected Chain Badge */}
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-slate-600 dark:text-slate-400">Monitoring on:</span>
              <div
                className="px-3 py-1 rounded-full font-semibold text-white flex items-center gap-2"
                style={{ backgroundColor: selectedChainData?.color }}
              >
                <span>{selectedChainData?.icon}</span>
                <span>{selectedChainData?.name}</span>
              </div>
            </div>

            {walletError && (
              <div className="mt-4 text-center font-semibold py-2 rounded-lg bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200">
                {walletError}
              </div>
            )}
          </>
        )}
      </div>

      {/* Wallet Summary Cards */}
      {monitoredWallet && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 mt-2">
          {/* Fused Wallet Address & Balance Card */}
          <Card
            className="border-0 shadow-lg md:col-span-2"
            style={{ boxShadow: '0 8px 30px -3px rgba(199, 80, 247, 0.3)' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-6">
                {/* Left: Profile Avatar & Address */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className="w-16 h-16 rounded-full border-3 relative overflow-hidden flex items-center justify-center text-xl flex-shrink-0"
                    style={{
                      borderColor: userAvatar.color,
                      backgroundColor: userAvatar.color
                    }}
                  >
                    {profile !== undefined ? (
                      <img
                        src={`/profile${profile}.png`}
                        alt={userAvatar.label}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs hidden md:flex text-slate-500 dark:text-slate-400 mb-1">
                      Wallet Address
                    </p>

                    {/* DESKTOP wallet address – hidden on mobile */}
                    <div className="hidden md:flex items-center gap-2 mb-3">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate font-mono">
                        {walletAddress.length > 20
                          ? `${walletAddress.slice(0, 20)}...`
                          : walletAddress}
                      </p>
                      <button
                        onClick={() => navigator.clipboard.writeText(walletAddress)}
                        className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors flex-shrink-0"
                        title="Copy address"
                      >
                        <svg
                          className="w-4 h-4 text-slate-600 dark:text-slate-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                        </svg>
                      </button>
                    </div>

                    {/* Chain – hidden on mobile */}
                    <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400">
                      {selectedChain.charAt(0).toUpperCase() + selectedChain.slice(1)}
                    </p>
                  </div>
                </div>

                {/* Right: Balance & Actions */}
                <div className="flex flex-col items-end gap-3">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 text-right">
                      Total Balance
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {showBalance
                        ? `$${monitoredWallet.totalValue?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0.00'}`
                        : '••••••'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30"
                      onClick={() => setShowBalance(!showBalance)}
                      title={showBalance ? 'Hide balance' : 'Show balance'}
                    >
                      <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </Button>

                    <Button
                      size="sm"
                      className="text-white font-semibold text-xs h-8 px-3 border-2 border-[#d575fc] cursor-pointer hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                      style={{ backgroundColor: '#c750f7' }}
                      onClick={handleRefresh}
                      disabled={isLoadingWallet}
                      title="Refresh wallet data"
                    >
                      {isLoadingWallet ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* DESKTOP 24h Change Footer */}
              <div className="hidden md:flex mt-4 items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  24h Change:
                </span>
                <span
                  className={`text-sm font-bold ${monitoredWallet.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {showBalance
                    ? `${monitoredWallet.change24h >= 0 ? '+' : ''}${Math.abs(monitoredWallet.change24h || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                    : '••••••'}
                </span>
              </div>

              {/* MOBILE: Wallet address footer (replaces 24h change) */}
              <div className="flex md:hidden flex-col gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400">Wallet Address</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate font-mono">
                    {walletAddress.length > 20
                      ? `${walletAddress.slice(0, 20)}...`
                      : walletAddress}
                  </p>

                  <button
                    onClick={() => navigator.clipboard.writeText(walletAddress)}
                    className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-4 h-4 text-slate-600 dark:text-slate-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                    </svg>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* 24h Change & Total Assets Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card
              className="border-0 shadow-lg"
              style={{ boxShadow: '0 8px 30px -3px rgba(199, 80, 247, 0.3)' }}
            >
              <CardContent className="p-6">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Change in 24H
                </p>
                <p className={`text-lg font-bold ${monitoredWallet.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {showBalance
                    ? `${monitoredWallet.change24h >= 0 ? '+' : ''}${Math.abs(monitoredWallet.change24h || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                    : '••••••'}
                </p>
              </CardContent>
            </Card>

            <Card
              className="border-0 shadow-lg"
              style={{ boxShadow: '0 8px 30px -3px rgba(199, 80, 247, 0.3)' }}
            >
              <CardContent className="p-6">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Total Assets
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {monitoredWallet.assetCount || 0}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Top 15 Assets */}
      {monitoredWallet && topAssets.length > 0 && (
        <section className="mb        -12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Top 15 Assets</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topAssets.map(asset => {
              const assetValue = (asset.amount || 0) * (asset.price || 0);
              const percentOfPortfolio = monitoredWallet.totalValue > 0 ? (assetValue / monitoredWallet.totalValue) * 100 : 0;

              return (
                <div
                  key={asset.coinId}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900 hover:shadow-2xl hover:border-[#c750f7]/30 transition-all"
                >
                  {/* Asset Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative flex-shrink-0">
                      {asset.imgUrl ? (
                        <img
                          src={asset.imgUrl}
                          alt={asset.name}
                          className="w-14 h-14 rounded-2xl"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-[#c750f7]/20 to-purple-200/20 rounded-2xl flex items-center justify-center">
                          <span className="text-2xl font-bold text-[#c750f7]">{asset.symbol.charAt(0)}</span>
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2 bg-[#c750f7] text-white text-xs font-bold px-2 py-1 rounded-full">
                        {percentOfPortfolio.toFixed(1)}%
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{asset.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{asset.symbol}</p>
                    </div>
                  </div>

                  {/* Asset Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-3">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Holdings</p>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {showBalance ? `${asset.amount.toFixed(asset.price < 1 ? 4 : 6)}` : '••••••'}
                      </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-3">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Price</p>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {showBalance ? `${asset.price.toLocaleString(undefined, {
                          minimumFractionDigits: asset.price < 1 ? 2 : 0,
                          maximumFractionDigits: asset.price < 1 ? 6 : 2,
                        })}` : '••••••'}
                      </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-3">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Value</p>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {showBalance ? `${assetValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '••••••'}
                      </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-3">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">24h Change</p>
                      <p className={`font-bold text-sm ${asset.pCh24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {asset.pCh24h >= 0 ? '+' : ''}{asset.pCh24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {monitoredWallet && topAssets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">
            No assets found for this wallet on {selectedChainData?.name}
          </p>
        </div>
      )}
    </div>

    <footer className="mt-12 bg-white text-gray-900 py-12 relative z-10 dark:bg-slate-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-6 mb-6">
          <a href="/home/privacy" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white cursor-pointer">
            privacy policy
          </a>
          <a href="/home/help" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white cursor-pointer">
            Help
          </a>
          <a href={`https://twitter.com/intent/follow?screen_name=cryptosnoop_app`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white cursor-pointer">
            our socials
          </a>
          <a onClick={() => signOut({ callbackUrl: "/" })} className="text-gray-600 cursor-pointer hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white">
            Logout
          </a>
        </div>
        <p className="text-slate-600 dark:text-white">Track your crypto journey with confidence</p>
        <p className="text-gray-600 dark:text-white">© {new Date().getFullYear()} CryptoSnoop. All rights reserved.</p>
      </div>
    </footer>
  </main>
);



 

}



 {/* Cache Status Badge - {monitoredWallet && (
            <div className="mt-4 flex items-center justify-between px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
              <span className="text-xs text-blue-700 dark:text-blue-300">
                ✓ Data cached locally • Tap Refresh to update from blockchain
              </span>
              <button 
                onClick={handleClearCache}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
              >
                Clear cache
              </button>
            </div>
          )}
        </div>- */}
          