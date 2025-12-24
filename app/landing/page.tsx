"use client";


import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Image from "next/image";
import AuthModal from "@/components/AuthModal";
import SlideIn from '@/components/SlideIn';

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
 
  // Fetch market data on component mount and every 3 minutes
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch("/api/market-data");
        const data: ApiResponse = await response.json();

        if (data.data && data.data.result) {
          setCoins(data.data.result);
        }
      } catch (error) {
        console.error("Failed to fetch market data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();

    // Refresh every 3 minutes (180000 ms)
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
      description:
        "CryptoSnoop helps you track your crypto assets and holdings hassle-free without necessarily connecting your wallet. Monitor your portfolio and wallets with real-time data and insights accross all chains.",
      icon: "/eye.png",
    },
    {
      title: "Easy Management",
      description:
        "Management help for keeping your crypto account addresses easily accessible. Store and organize all your wallets and label them securely all in one centralized location.",
      icon: "/wallet.png",
    },
    {
      title: "Easy Login and Top-tier Security",
      description:
        "Your security is our priority. Access your portfolio with confidence knowing your data is protected with industry-leading encryption and security protocols.",
      icon: "/padlock.png",
    },
     
  ];

  //second part text
  const additions = [
  {
    title: "Secure Crypto portfolio tracking",
    description:
      "Track your crypto assets effortlessly with just a click, keeping all your holdings organized and up-to-date.",
    icon: "/bitcoinbag.png",
  },
  {
    title: "Remote wallet monitoring across all chains",
    description:
       "Paste your wallet addresses to instantly view your portfolio and holdings across multiple blockchains, all in one centralized dashboard.",
    icon: "/greencursor.png",
  },
  {
    title: "secure labelling for all your addresses",
    description:
      "Organize and label all your wallets safely, ensuring easy access and management while keeping your account information secure.",
    icon: "/coinbag.png",
  },
  {
    title: "real time price updates",
    description:
       "Stay informed with up-to-the-second price changes across your portfolio, helping you make timely decisions.",
    icon: "/zap.png",
  },
  {
    title: "Top-tier security",
    description:
 "Your security is our priority. Access your portfolio with confidence, protected by industry-leading encryption and security protocols.",
   
    icon: "/padlock.png",
  },
];

  return (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
  {/* Background Image */}
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
                        <span className="text-slate-700  font-bold text-sm sm:text-lg leading-tight -mt-1">
                          Snoop
                        </span>
                      </div>
                    </div>
      <div className="flex gap-3">
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-4 py-2 sm:px-6 sm:py-2 rounded-lg bg-[#c750f7] 
          text-sm sm:text-base md:text-lg
          text-white font-semibold hover:bg-[#d575fc] transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Get Started
        </button>
      </div>
    </div>
  </header>

  {/* Hero Section */}
  <main className="pt-20 sm:pt-32 pb-8 sm:pb-4 relative z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <span className="px-4 py-1 rounded-lg bg-[#c750f7] text-white 
            text-xs sm:text-sm md:text-base font-medium">
            Portfolio Management
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight px-4">
          Keep your eyes on your <br />
          <span className="bg-gradient-to-r from-[#d575fc] to-[#c750f7] bg-clip-text text-transparent">
            crypto assets
          </span>{" "}
          without hassle
        </h2>

        <div className="max-w-2xl mx-auto flex flex-col gap-2 sm:mb-0 md:mb-8">
          {/* Keep these stacked vertically on all screen sizes for consistent alignment */}
          <div className="flex items-center justify-center sm:p-0 p-2">
            <p className="text-sm sm:text-base md:text-lg lg:text-lg text-gray-700 font-semibold text-center">
              Manage your crypto portfolio with real-time data
            </p>
          </div>

          <div className="flex items-center justify-center sm:p-0 p-2">
            <p className="text-sm sm:text-base md:text-lg lg:text-lg text-gray-700 font-semibold text-center">
              Monitor remote crypto wallets
            </p>
          </div>

          <div className="flex items-center justify-center sm:p-0 p-2 ">
            <p className="text-sm sm:text-base md:text-lg lg:text-lg text-gray-700 font-semibold text-center">
              Keep all your address labels securely in one place
            </p>
          </div>
        </div>
        

        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-3 sm:mt-0 md:mt-3 lg:mt-3 rounded-lg bg-[#c750f7] text-white font-semibold 
          text-base sm:text-lg md:text-xl 
          hover:bg-[#d575fc] transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Get started For Free
        </button>
      </div>

      {/* Coin Widget */}
      <div className="relative overflow-hidden pb-2 sm:my-0 sm:-mt-4 md:my-4 ">
        <div className="flex justify-center items-center min-h-[180px] sm:min-h-[220px]">
          {loading ? (
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-300 border-t-[#c750f7] rounded-full animate-spin"></div>
          ) : coins.length > 0 ? (
            <div
              className={`transition-all duration-500 ${
                isAnimating
                  ? "opacity-0 transform translate-x-full"
                  : "opacity-100 transform translate-x-0"
              }`}
            >
              <div
                className="relative backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl p-3 w-64 sm:w-80 border border-white/50"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(108, 198, 255, 0.2))",
                  boxShadow:
                    "0 8px 32px 0 rgba(90, 181, 238, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-transparent rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                      <Image
                        src={coins[currentCoin].icon}
                        alt={coins[currentCoin].name}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                        {coins[currentCoin].name}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">
                        {coins[currentCoin].symbol}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      $
                      {coins[currentCoin].price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p
                      className={`text-xs sm:text-sm font-medium mt-1 ${
                        coins[currentCoin].priceChange1d >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {coins[currentCoin].priceChange1d >= 0 ? "+" : ""}
                      {coins[currentCoin].priceChange1d.toFixed(2)}% (24h)
                    </p>
                  </div>

                  <button
                    className="bg-[#c750f7] hover:bg-[#d575fc] text-white rounded-xl p-2 sm:p-3 
                    transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm sm:text-lg">...</div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-32 mt-32">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center gap-12 md:gap-16">
            <SlideIn
              direction={(index % 2 === 0 ? "left" : "right") as "left" | "right"}
              delay={0.2}
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
            </SlideIn>

            <SlideIn direction={index % 2 === 0 ? "right" : "left"} delay={0.4}>
              <div className="flex-1 space-y-6">
                <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 text-center">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-lg md:text-xl text-gray-900 leading-relaxed font-bold text-center">
                  {feature.description}
                </p>
              </div>
            </SlideIn>
          </div>
        ))}
      </div>
      <section className="w-full max-w-3xl mx-auto px-4 py-24">
      {/* Header */}
      <h2 className="text-center font-bold text-3xl sm:text-4xl md:text-5xl leading-tight mb-8 text-gray-900">
        CryptoSnoop<br />Does crypto tracking<br />Better
      </h2>

      {/* Feature Boxes */}
      <div className="flex flex-col gap-4">
        {additions.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-white shadow-sm rounded-2xl px-4 py-3 border border-gray-200 w-full"
          >
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl  flex items-center justify-center overflow-hidden relative">
  <Image
    src={feature.icon}
    alt={feature.title}
    fill
    className="object-cover"
  />
</div>

            <div className="flex flex-col">
              <p className="font-semibold text-sm sm:text-base md:text-lg text-gray-900">{feature.title}</p>
              <p className="text-gray-900 text-xs sm:text-sm md:text-base leading-snug">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>

      {/* CTA Section */}
      <div className="mt-32 text-center rounded-3xl p-16">
        <SlideIn direction="down" delay={0.2}>
          <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#c750f7] mb-6">
            Want to start tracking?
          </h3>
          <p className="text-sm sm:text-lg md:text-xl text-[#c750f7] mb-8 font-bold">
            Use cryptosnoop to manage your crypto assets and holdings with ease
          </p>
        </SlideIn>

        <SlideIn direction="up" delay={0.2}>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-3 sm:px-8 sm:py-3 rounded-lg bg-[#c750f7] text-white font-semibold 
            text-base sm:text-lg md:text-xl
            hover:bg-[#d575fc] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Tracking now
          </button>
        </SlideIn>
      </div>
    </div>
  </main>

  {/* Footer */}
  <footer className="mt-32 bg-white text-gray-900 py-12 relative z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="flex items-center justify-center gap-6 mb-6">
        <p
          onClick={() => {
            window.location.href =
              "mailto:cryptosnoopapp@gmail.com?subject=Feedback&body=Hello Cryptosnoop Team,%0D%0A%0D%0AHere is my feedback...";
          }}
          className="cursor-pointer text-xs sm:text-sm md:text-base text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline"
        >
          contact us
        </p>
        <a
          href="/landing/privacy"
          className="text-xs sm:text-sm md:text-base text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline"
        >
          privacy policy
        </a>
        <a
          href={`https://twitter.com/intent/follow?screen_name=${`cryptosnoop_app`}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs sm:text-sm md:text-base text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline"
        >
          our socials
        </a>
      </div>

      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 flex items-center justify-center">
          <Image
            src="/cryptosnooplogo1.png"
            alt="CryptoSnoop Logo"
            width={48}
            height={32}
            className="object-contain"
            priority
          />
        </div>
        <h4 className="text-lg sm:text-xl md:text-2xl font-bold">CryptoSnoop.app</h4>
      </div>

      <p className="text-xs sm:text-sm md:text-base text-slate-600 mb-2">
        Track your crypto journey with confidence
      </p>
      <p className="text-xs sm:text-sm md:text-base text-gray-600">
        © {new Date().getFullYear()} CryptoSnoop. All rights reserved.
      </p>
    </div>
  </footer>

  {/* Auth Modal */}
  <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
</div>

  );
}

export default CryptoSnoop

