"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { signOut } from "next-auth/react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DarkModeToggle } from "@/components/darkToggle"

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
  Album,
  ChartBarIncreasingIcon,
  X
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { usePortfolio } from "@/hooks/usePortfolio"
import {useEffect} from 'react'
import { Settings, Check } from 'lucide-react';
import ProfileModal from '@/components/profileModal'


export default function UserProfile() {
  const [showBalance, setShowBalance] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)
  const [activeTab, setActiveTab] = useState("assets")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState<any>(null)
  const [quantity, setQuantity] = useState("")
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  
  const [profile, setProfile] = useState<number | undefined>(2)
  const [userName, setUserName] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const avatarOptions = [
  { id: 1, emoji: '👤', color: '#c750f7', label: 'Default' },
  { id: 2, emoji: '🎨', color: '#ff6b6b', label: 'Artist' },
  { id: 3, emoji: '🚀', color: '#4ecdc4', label: 'Explorer' },
  { id: 4, emoji: '⚡', color: '#ffd93d', label: 'Energy' },
  { id: 5, emoji: '🌟', color: '#a8e6cf', label: 'Star' }
];
const [userAvatar, setUserAvatar] = useState(avatarOptions[2])
 
  const { data: session, status } = useSession();
  const router = useRouter();

   useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

   const userId = session?.user?.id;
   const name = session?.user?.name;
   
  

  const {
    portfolio,
    assets,
    accounts,
    addresses,
    marketData,
    isLoading,
    error,
    refreshAssets,
    refreshAll
  } = usePortfolio()

  console.log(marketData)
  console.log(portfolio)
  console.log(accounts)
  console.log(addresses)
  console.log(assets)
   console.log(profile)
    console.log(profile)

 const totalValue = portfolio?.totalValue || 0;
const totalChange = portfolio?.portfolioChangePercent ?? 0;
  console.log(totalChange)
    
  const totalAssets = assets?.length || 0

   const cryptoCoins =
    marketData?.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price || 0,
      change: coin.priceChange1d || 0,
      icon: coin.icon || coin.symbol.charAt(0).toUpperCase()
    })) || []
  
  const handleNavigation = (path: string) => {
    window.location.href = path
  }

 const buzzClick = () => {
   if(navigator.vibrate) {
    navigator.vibrate(100); //buzzz buzzz baby
   } else {
    console.log("Vibration api is not supported on this device.")
   }
}

  const handleAddClick = (coin: any) => {
    setSelectedCoin(coin)
    setIsModalOpen(true)
    setQuantity("")
    buzzClick()
  }


 const [isSending, setIsSending] = useState(false);

  
  
const handleAddAsset = async () => {
  if (!quantity || parseFloat(quantity) <= 0) return;
  if (!selectedCoin || !userId) return;

  setMessage("");
  setMessageType("");
  setIsSending(true);

  try {
    setIsSending(true);
    setMessage("");
    setMessageType("");

    const assetExists = assets.some(
      (asset) =>
        asset.name.trim().toLowerCase() ===
        selectedCoin.name.trim().toLowerCase()
    );
     
    {/*why localhost rere*/}
    const url = assetExists
  ? `/api/assets/${encodeURIComponent(selectedCoin.name)}?userId=${userId}`
  : `/api/assets?userId=${userId}`;


    const response = await fetch(url, {
      method: assetExists ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: selectedCoin.name,
        quantity: parseFloat(quantity),
        lastPrice: selectedCoin.price,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    setMessage(
      assetExists
        ? `${selectedCoin.name} updated successfully!`
        : `${selectedCoin.name} added successfully!`
    );
    setMessageType("success");
    refreshAll();
    setTimeout(() => {
      setIsModalOpen(false);
      setMessage("");
      setMessageType("");
    }, 1500);
  } catch (error) {
    console.error(error);
    setMessage("An error occurred. Please try again.");
    setMessageType("error");
    setTimeout(() => {
      setIsModalOpen(false);
      setMessage("");
      setMessageType("");
    }, 6000);
  } finally {
    setIsSending(false);
  }
};



  

//profile handler
const fetchUserProfile = async (userId) => {
  try {
    console.log('fetching profile data')
    const response = await fetch(`/api/users?userId=${userId}`, {
    method: "GET",
  });;
    const data = await response.json();
    
    if (response.ok && data.user) {
      const avatarIndex = data.user.profile ?? 2;
      setProfile(avatarIndex);
      setUserAvatar(avatarOptions[avatarIndex]);
      setUserName(data.user.username || data.user.name || 'User');
      console.log(data.user.username)
      console.log(data.user.name)

    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  
  }
};

// Load profile on mount
useEffect(() => {
  if (session?.user?.id) {
    fetchUserProfile(session.user.id);
  }
}, [session?.user?.id]);

// Optimistic update handler
const handleProfileSave = (newName, newAvatarIndex) => {
  // Immediately update UI (optimistic)
  setProfile(newAvatarIndex);
  setUserAvatar(avatarOptions[newAvatarIndex]);
  setUserName(newName);
  
  // Then fetch from server to confirm
  if (session?.user?.id) {
    fetchUserProfile(session.user.id);
  }
};



  // ✅ LOADING STATE
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
          <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/cryptosnooplogo1.png"
                  alt=" Cryptosnoop logo Logo"
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
          <div className="w-12 h-12 sm:w-8 sm:h-8 border-2 border-[#c750f7] border-t-transparent rounded-full animate-spin"></div>
        </div>

       <footer className="mt-[60vh] bg-white text-gray-900 py-12 relative z-10 dark:bg-slate-900/60">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    
    {/* Links */}
    <div className="flex flex-wrap items-center justify-center gap-6 mb-6 text-[10px] sm:text-xs md:text-sm">
      <a href="/home/privacy" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white">
        privacy policy
      </a>
      <a href="/home/help" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white">
        Help
      </a>
      <a 
        href={`https://twitter.com/intent/follow?screen_name=${`cryptosnoop_app`}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white"
      >
        our socials
      </a>
      <a onClick={() => signOut({ callbackUrl: "/" })} className="text-gray-600 cursor-pointer hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white">
        Logout
      </a>
    </div>

    {/* Logo + App Name */}
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
      <div className="w-12 h-12 flex items-center justify-center">
        <Image
          src="/cryptosnooplogo1.png"
          alt="cryptosnooplogo Logo"
          width={48}
          height={32}
          className="object-contain"
          priority
        />
      </div>
      <h4 className="text-sm sm:text-base md:text-lg font-bold dark:text-white">
        CryptoSnoop.app
      </h4>
    </div>

    {/* Footer notes */}
    <p className="text-[10px] sm:text-xs md:text-sm text-slate-600 dark:text-white mb-1">
      Track your crypto journey with confidence
    </p>
    <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-white">
      © {new Date().getFullYear()} CryptoSnoop. All rights reserved.
    </p>

  </div>
</footer>

      </main>
    )
  }

  // ✅ ERROR STATE
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
            <p className="text-black mb-4 dark:text-white">Error connecting</p>
            <Button
              onClick={refreshAll}
              style={{ backgroundColor: "#c750f7" }}
              className="text-white"
            >
              Retry
            </Button>
          </div>
        </div>

        <footer className="mt-[60vh] bg-white text-gray-900 py-12 relative z-10 dark:bg-slate-900/60">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    
    {/* Links */}
    <div className="flex flex-wrap items-center justify-center gap-6 mb-6 text-[10px] sm:text-xs md:text-sm">
      <a href="/home/privacy" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white">
        privacy policy
      </a>
      <a href="/home/help" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white">
        Help
      </a>
      <a 
        href={`https://twitter.com/intent/follow?screen_name=${`cryptosnoop_app`}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white"
      >
        our socials
      </a>
      <a onClick={() => signOut({ callbackUrl: "/" })} className="text-gray-600 cursor-pointer hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white">
        Logout
      </a>
    </div>

    {/* Logo + App Name */}
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
      <div className="w-12 h-12 flex items-center justify-center">
        <Image
          src="/cryptosnooplogo1.png"
          alt="cryptosnooplogo Logo"
          width={48}
          height={32}
          className="object-contain"
          priority
        />
      </div>
      <h4 className="text-sm sm:text-base md:text-lg font-bold dark:text-white">
        CryptoSnoop.app
      </h4>
    </div>

    {/* Footer notes */}
    <p className="text-[10px] sm:text-xs md:text-sm text-slate-600 dark:text-white mb-1">
      Track your crypto journey with confidence
    </p>
    <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-white">
      © {new Date().getFullYear()} CryptoSnoop. All rights reserved.
    </p>

  </div>
</footer>

      </main>
    )
  }


  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
  <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">

    {/* Left Side: Logo */}
    <div className="flex items-center gap-2 sm:gap-4">
      <div className="flex items-center gap-2">

        <Image
          src="/cryptosnooplogo1.png"
          alt="Cryptosnoop Logo"
          width={48}
          height={32}
          className="object-contain"
          priority
        />

        <div className="flex flex-col leading-none">
          <span className="font-bold text-sm sm:text-lg leading-tight" style={{ color: '#c750f7' }}>
            crypto
          </span>
          <span className="text-slate-700  font-bold text-sm sm:text-lg leading-tight -mt-1 dark:text-white">
            Snoop
          </span>
        </div>
      </div>
    </div>

    {/* Right Side: Dark Mode Toggle */}
    <DarkModeToggle />

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
 <div className="relative w-12 h-12 flex-shrink-0">

  <div className="absolute inset-0 rounded-full blur-lg opacity-40"
       style={{ backgroundColor: userAvatar.color }}></div>

  <div
    className="w-full h-full rounded-full border-2 relative overflow-hidden flex items-center justify-center text-xl"
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

</div>


  <div className="flex-1 flex items-center gap-2">
    <p className="text-sm font-semibold text-slate-800 dark:text-white">Welcome {userName}!</p>
    <button 
      onClick={() => {setShowProfileModal(true); buzzClick();}}
      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
    >
      <Settings className="w-4 h-4 dark:text-white text-slate-800 hover:text-[#c750f7]" />
    </button>
  </div>
  <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => setShowBalance(!showBalance)}>
    <Eye className="w-4 h-4 font-extrabold dark:text-white" />
  </Button>
</div>

                {/* Order Value Section */}
                <div className=" dark:from-slate-700 dark:to-slate-800 rounded-lg p-3">
                  <p className="text-xs text-slate-600 dark:text-white mb-1">Total balance</p>
                  <div className="flex items-baseline justify-between">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {showBalance ? `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '••••••'}
                    </p>
                    <Button 
                      size="sm" 
                      variant="ghost"
                         
                      className="text-white  text-xs sm:text-sm h-8 sm:h-10 flex-shrink-0  bg-gradient-to-b from-[#c750f7]/60 to-[#c750f7] 
               shadow-[0_8px_12px_-2px_rgba(0,0,0,0.35)] 
               active:translate-y-1 active:shadow-none 
               hover:brightness-95 overflow-hidden transition-all duration-200"

                      onClick={() => {handleNavigation("/home/monitor-accounts"); buzzClick();}}
                    >
                      Monitor
                      <ChartBarIncreasingIcon />
                    </Button>
                  </div>
                </div>

                {/* Profit Section */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-3">
                      
<p className="text-sm text-slate-600 dark:text-white mb-1">
  Change in 24HR
</p>
<p className={`text-lg font-bold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
  {showBalance
    ? `${totalChange >= 0 ? '+' : '-'}$${Math.abs((totalChange * totalValue) / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : '••••••'}
</p>


                  </div>
                  <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-3">
                    <p className="text-xs text-slate-600 dark:text-white mb-1">Total Assets</p>
                    <p className="text-base font-bold ">
                      {showBalance ? `${totalAssets}` : '••••••'}
                    </p>
                  </div>
                </div>
              </div>
              
             {/* Desktop Layout */}
<div className="hidden sm:flex flex-row items-start gap-4">
  <div className="relative flex-shrink-0">
    <div className="absolute inset-0 rounded-full blur-lg opacity-40" style={{ backgroundColor: userAvatar.color }}></div>
   <div
  className="w-12 h-12 rounded-full border-2 relative overflow-hidden flex items-center justify-center text-xl"
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

  </div>
  
  <div className="flex-1 w-full">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">welcome {userName}!</h2>
        <button 
          onClick={() => {setShowProfileModal(true); buzzClick();}}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
        >
          <Settings className="w-5 h-5 text-slate-600 dark:text-white hover:text-[#c750f7]" />
        </button>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 dark:text-white" onClick={() => setShowBalance(!showBalance)}>
        <Eye className="w-4 h-4" />
      </Button>
    </div>
                  
                  <div className=" dark:from-slate-700 dark:to-slate-800 rounded-lg p-4 mb-4">
                    <p className="text-sm text-slate-600 dark:text-white mb-2">Total Balance</p>
                    <div className="flex items-baseline justify-between">
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        {showBalance ? `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '••••••'}
                      </p>
                      <Button 
                        size="lg" 
                        variant="ghost"
                          className="text-white  text-xs sm:text-sm h-8 sm:h-10 flex-shrink-0  bg-gradient-to-b from-[#c750f7]/60 to-[#c750f7] 
               shadow-[0_8px_12px_-2px_rgba(0,0,0,0.35)] 
               active:translate-y-1 active:shadow-none 
               hover:brightness-95 overflow-hidden transition-all duration-200"

                         onClick={() => {handleNavigation("/home/monitor-accounts"); buzzClick();}}
                      >
                       Monitor 
                       <ChartBarIncreasingIcon className="font-extrabold w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className=" dark:bg-slate-800 rounded-lg p-4">
                      
<p className="text-sm text-slate-600 dark:text-white mb-1">
  Change in 24HR
</p>
<p className={`text-lg font-bold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
  {showBalance ? (
    `${totalChange >= 0 ? '+' : '-'}$${Math.abs((totalChange * totalValue) / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })} | ${Math.abs(totalChange).toFixed(2)}%`
  ) : (
    '••••••'
  )}
</p>

                    </div>
                    <div className="  dark:bg-slate-800 rounded-lg p-4">
                      <p className="text-sm text-slate-600 dark:text-white mb-1">Total Assets</p>
                      <p className="text-lg font-bold">
                        {showBalance ? `${totalAssets}` : '••••••'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tabs Section */}
        <section className="mb-8 dark:text-white">
          <div className="grid w-full grid-cols-3 mb-2 h-auto p-1 gap-1 rounded-lg">
            <button
  onClick={() => {
    handleNavigation("/home/assets");
    buzzClick();
  }}
  className="relative h-full font-semibold flex flex-col items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 rounded-lg transition-colors"
>
  <div
    className="w-12 h-10 sm:w-16 sm:h-12 md:w-18 md:h-14 
               rounded-xl flex items-center justify-center flex-shrink-0 
               bg-gradient-to-b from-[#c750f7]/60 to-[#c750f7] 
               shadow-[0_8px_12px_-2px_rgba(0,0,0,0.35)] 
               active:translate-y-1 active:shadow-none 
               hover:brightness-95 overflow-hidden transition-all duration-200"
  >
    <Album className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
  </div>

  <span
    className="text-sm sm:text-base md:text-lg font-medium tracking-wide text-gray-900 dark:text-white"
  >
    Assets
  </span>
</button>

           <button
  onClick={() => {
    handleNavigation("/home/monitor-accounts");
    buzzClick();
  }}
  className="relative h-full font-semibold flex flex-col items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 rounded-lg transition-colors"
>
  <div
    className="w-12 h-10 sm:w-16 sm:h-12 md:w-18 md:h-14 
               rounded-xl flex items-center justify-center flex-shrink-0 
               bg-gradient-to-b from-[#c750f7]/60 to-[#c750f7] 
               shadow-[0_8px_12px_-2px_rgba(0,0,0,0.35)] 
               active:translate-y-1 active:shadow-none 
               hover:brightness-95 overflow-hidden transition-all duration-200"
  >
    <ChartBarIncreasingIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
  </div>

  <span
    className="text-sm sm:text-base md:text-lg font-medium tracking-wide text-gray-900 dark:text-white"
  >
    Accounts
  </span>
</button>

           <button
  onClick={() => {
    handleNavigation("/home/addresses");
    buzzClick();
  }}
  className="relative h-full font-semibold flex flex-col items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 rounded-lg transition-colors"
>
  <div
    className="w-12 h-10 sm:w-16 sm:h-12 md:w-18 md:h-14 
               rounded-xl flex items-center justify-center flex-shrink-0 
               bg-gradient-to-b from-[#c750f7]/60 to-[#c750f7] 
               shadow-[0_8px_12px_-2px_rgba(0,0,0,0.35)] 
               active:translate-y-1 active:shadow-none 
               hover:brightness-95 overflow-hidden transition-all duration-200"
  >
    <MapPin className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
  </div>

  <span
    className="text-sm sm:text-base md:text-lg font-medium tracking-wide text-gray-900 dark:text-white"
  >
    Addresses
  </span>
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
                            <p className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white truncate">{coin.name}</p>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-white">{coin.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-sm sm:text-base text-slate-800 dark:text-white">${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                          <p className={`text-xs sm:text-sm font-semibold ${coin.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {coin.change >= 0 ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />}
                            {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%
                          </p>
                        </div>
                        <Button 
                          
                          variant="ghost"
                          size="sm" 
                          className="text-white  text-xs sm:text-sm h-8 sm:h-10 flex-shrink-0  bg-gradient-to-b from-[#c750f7]/60 to-[#c750f7] 
               shadow-[0_8px_12px_-2px_rgba(0,0,0,0.35)] 
               active:translate-y-1 active:shadow-none 
               hover:brightness-95 overflow-hidden transition-all duration-200"

                          onClick={() => handleAddClick(coin)}
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <p className="text-center text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium mt-4">
         Support for more coins coming soon!
      </p>
                </section>
      </div>

      {isModalOpen && selectedCoin && (
  <div
    className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={() => setIsModalOpen(false)}
  >
    <div
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative overflow-hidden"
      onClick={(e) => e.stopPropagation()}
      style={{
        boxShadow: '0 20px 60px -10px rgba(199, 80, 247, 0.5)',
      }}
    >
      {/* Spinner overlay when loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
          <div className="w-16 h-16 border-4 border-[#c750f7] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <button
        onClick={() => {
          setIsModalOpen(false);
          buzzClick();
        }}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
      >
        <X className="w-6 h-6 font-extrabold text-[#c750f7]" />
      </button>

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
            onChange={(e) => {
    const value = e.target.value;
    // Limit to 9 digits
    if (value.length <= 9) {
      setQuantity(value);
    }
  }}
    
            className="border-slate-300 dark:border-slate-600 focus:border-[#c750f7] focus:ring-[#c750f7]"
          />
           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {quantity.toString().length}/9 digits
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

      {/* ✅ success or error message */}
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

      <Button
  onClick={handleAddAsset}
  disabled={!quantity || parseFloat(quantity) <= 0 || isSending}
  className="w-full text-white font-bold py-3 rounded-lg border-4 border-[#d575fc] disabled:opacity-50 disabled:cursor-not-allowed"
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
)}

{/* Profile Modal */}
<ProfileModal 
  isOpen={showProfileModal}
  onClose={() => setShowProfileModal(false)}
  currentName={name}
  currentAvatar={profile ?? 0}          // numeric 0–4 from session
  currentUserId={session?.user?.id}   // 👈 required for PATCH
  onSave={handleProfileSave}
/>



 <footer className="mt-8 bg-white text-gray-900 py-12 relative z-10 dark:bg-slate-900/60">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    
    {/* Links */}
    <div className="flex flex-wrap items-center justify-center gap-6 mb-6 text-[10px] sm:text-xs md:text-sm">
      <a href="/home/privacy" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white">
        privacy policy
      </a>
      <a href="/home/help" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white">
        Help
      </a>
      <a 
        href={`https://twitter.com/intent/follow?screen_name=${`cryptosnoop_app`}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white"
      >
        our socials
      </a>
      <a onClick={() => signOut({ callbackUrl: "/" })} className="text-gray-600 cursor-pointer hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white">
        Logout
      </a>
    </div>

    {/* Logo + App Name */}
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
      <div className="w-12 h-12 flex items-center justify-center">
        <Image
          src="/cryptosnooplogo1.png"
          alt="cryptosnooplogo Logo"
          width={48}
          height={32}
          className="object-contain"
          priority
        />
      </div>
      <h4 className="text-sm sm:text-base md:text-lg font-bold dark:text-white">
        CryptoSnoop.app
      </h4>
    </div>

    {/* Footer notes */}
    <p className="text-[10px] sm:text-xs md:text-sm text-slate-600 dark:text-white mb-1">
      Track your crypto journey with confidence
    </p>
    <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-white">
      © {new Date().getFullYear()} CryptoSnoop. All rights reserved.
    </p>

  </div>
</footer>

    </main>
  )
}
