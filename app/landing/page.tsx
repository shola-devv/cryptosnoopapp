"use client"

import React, { useState, useEffect } from 'react';
import { Plus, Shield, Wallet, Lock, TrendingUp, Eye, Database } from 'lucide-react';
import Image from "next/image"

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  icon: string;
  priceChange1d: number;
}

interface ApiResponse {
  source: string;
  data: {
    result: CoinData[];
  };
  timestamp: number;
  age?: number;
  rateLimitRemaining?: number;
}

const CryptoSnoop = () => {
  const [currentCoin, setCurrentCoin] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch market data on component mount and every 2 minutes
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('/api/market-data');
        const data: ApiResponse = await response.json();
        
        if (data.data && data.data.result) {
          setCoins(data.data.result);
        }
      } catch (error) {
        console.error('Failed to fetch market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    
    // Refresh every 2 minutes (120000 ms)
    const refreshInterval = setInterval(fetchMarketData, 180000);

    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (coins.length === 0) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentCoin((prev) => (prev + 1) % coins.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [coins.length]);

  const features = [
    {
      title: "Hassle-Free Tracking",
      description: "CryptoSnoop helps you track your crypto assets and accounts hassle-free without necessarily connecting your wallet. Monitor your portfolio and holdings with real-time data and insights.",
      icon: "/eye.png"
    },
    {
      title: "Easy Management",
      description: "Management help for keeping your crypto account addresses easily accessible. Store and organize all your wallets and label them securely all in one centralized location.",
      icon: "/wallet.png"
    },
    {
      title: "Easy Login and Security",
      description: "Your security is our priority. Access your portfolio with confidence knowing your data is protected with industry-leading encryption and security protocols.",
      icon: "/padlock.png"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Background Image - Only on hero section */}
      <div className="absolute top-0 right-0 w-full h-[100vh] lg:w-1/2 lg:right-[-10%] opacity-60 pointer-events-none z-0">
        <Image
          src="/bitcoin.png"
          alt="Background"
          fill
          className="object-contain object-right-bottom lg:object-right"
          priority
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
            <h1 className="text-xl font-bold bg-black bg-clip-text text-transparent">
            cryptoSnoop
            </h1>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2 rounded-lg bg-[#c750f7] text-white font-semibold hover:bg-[#d575fc] transition-all duration-300 shadow-lg hover:shadow-xl">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-20 sm:pt-32 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex justify-center sm:justify-center  mb-4">
              <span className="px-4 py-1  md:mr-12 lg:mr-16 sm:ml-12 rounded-lg bg-[#c750f7] text-white text-sm font-medium">
                Portfolio Management
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight px-4">
              Keep your eyes on your<br />
              <span className="bg-gradient-to-r from-[#d575fc] to-[#c750f7] bg-clip-text text-transparent">
                crypto assets
              </span>{' '}
              without hassle
            </h2>
            <div className="max-w-2xl mx-auto space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3">
                <Image
                    src="/cryptosnooplogo1.png"
                    alt="DIVAFlex Logo"
                    width={38}
                    height={28}
                    className="object-contain flex-shrink-0 animate-slide-in-left-repeat"
                    priority
                  />
                <p className="text-gray-700 text-base sm:text-lg font-bold">Manage crypto assets with live data</p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Image
                    src="/cryptosnooplogo1.png"
                    alt="DIVAFlex Logo"
                    width={38}
                    height={28}
                    className="object-contain flex-shrink-0 "
                    priority
                  />
                <p className="text-gray-700 text-base sm:text-lg font-bold">Keep all your wallet labels securely in one place</p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Image
                    src="/cryptosnooplogo1.png"
                    alt="DIVAFlex Logo"
                    width={38}
                    height={28}
                    className="object-contain flex-shrink-0 "
                    priority
                  />
                <p className="text-gray-700 text-base sm:text-lg font-bold">Monitor remote crypto wallets</p>
              </div>
            </div>
            <button className="px-8 py-3 rounded-lg bg-[#c750f7] text-white font-semibold hover:bg-[#d575fc] transition-all duration-300 shadow-lg hover:shadow-xl text-lg">
              Get started For Free
            </button>
          </div>

          {/* Coin Widget Carousel */}
          <div className="relative overflow-hidden py-8 my-8">
            <div className="flex justify-center items-center min-h-[220px]">
              {loading ? (
                <div className="w-12 h-12 border-4 border-gray-300 border-t-[#c750f7] rounded-full animate-spin"></div>
              ) : coins.length > 0 ? (
                <div
                  className={`transition-all duration-500 ${
                    isAnimating ? 'opacity-0 transform translate-x-full' : 'opacity-100 transform translate-x-0'
                  }`}
                >
                  <div className="relative backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl p-8 w-80 border border-white/50"
                       style={{
                         background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(108, 198, 255, 0.2))',
                         boxShadow: '0 8px 32px 0 rgba(90, 181, 238, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)',
                       }}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-transparent rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                          <Image
                            src={coins[currentCoin].icon}
                            alt={coins[currentCoin].name}
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{coins[currentCoin].name}</h3>
                          <p className="text-gray-600 text-sm font-medium">{coins[currentCoin].symbol}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-gray-900">
                          ${coins[currentCoin].price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className={`text-sm font-medium mt-1 ${coins[currentCoin].priceChange1d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {coins[currentCoin].priceChange1d >= 0 ? '+' : ''}{coins[currentCoin].priceChange1d.toFixed(2)}% (24h)
                        </p>
                      </div>
                      <button className="bg-[#c750f7] hover:bg-[#d575fc] text-white rounded-xl p-3 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-lg">...</div>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-32 mt-32">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-center gap-12 md:gap-16`}
              >
                <div className="flex-1">
                  <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-[#6CC6FF]/5 to-[#5AB5EE]/0 flex items-center justify-center">
                  <Image
                     src={feature.icon}
                     alt={feature.title}
                     width={300}
                     height={300}
                     className="object-contain w-3/4 h-3/4 transition-all duration-500"
                     priority
                      />
                  </div>

                </div>
                <div className="flex-1 space-y-6">
                  <h3 className="text-4xl font-bold text-gray-900 text-center md:text-left">{feature.title}</h3>
                  <p className="text-xl text-gray-600 leading-relaxed font-bold text-center md:text-left">
              {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-32 text-center rounded-3xl p-16 ">
            <h3 className="text-4xl font-bold text-[#c750f7] mb-6">Want to start tracking?</h3>
            <p className="text-xl text-[#c750f7] mb-8 font-bold">Use cryptosnoop to manage your crypto assets and holdings with ease</p>
            <button className="px-8 py-3 rounded-lg bg-[#c750f7] text-white font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl text-lg">
              Get Tracking now
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
     <footer className="mt-32 bg-white text-gray-900 py-12 relative z-10">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
               <div className="flex items-center justify-center gap-6 mb-6">
                 <p   onClick={() => { window.location.href = 'mailto:cryptosnoopapp@gmail.com?subject=Feedback&body=Hello Cryptosnoop Team,%0D%0A%0D%0AHere is my feedback...';
                }} className="text-gray-600 cursor-pointer hover:text-[#c750f7] transition-colors duration-300 font-medium underline">contact us</p>
                 <a href="/landing/privacy" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline">privacy policy</a>
                  <a href={`https://twitter.com/intent/follow?screen_name=${`cryptosnoop_app`}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline" >our socials</a>
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
  );
};

export default CryptoSnoop;