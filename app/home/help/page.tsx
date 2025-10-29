"use client"

import { useState } from "react"
import { 
  ArrowLeft, 
  HelpCircle, 
  Mail, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp,
  LogOut,
  CheckCircle,
  XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { signOut } from "next-auth/react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
const { data: session, status } = useSession();

// import { usePrivy } from '@privy-io/react-auth'

export default function HelpPage() {
  
  const [isWalletConnected, setIsWalletConnected] = useState(true)
  const [networkName, setNetworkName] = useState("Base")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const router = useRouter();
    const userId = session?.user?.id;
    const name = session?.user?.name;


  const faqItems = [
  {
    question: "What is CryptoSnoop?",
    answer:
      "CryptoSnoop is a crypto tracking platform that helps you monitor wallet addresses, portfolio performance, and smart money movements across multiple chains in real time.",
  },
  {
    question: "Do I need to connect my wallet?",
    answer:
      "No, you don’t have to connect your wallet to start tracking. Simply paste any wallet address to view its portfolio, token holdings, and recent transactions instantly.",
  },
  {
    question: "Which blockchains are supported?",
    answer:
      "CryptoSnoop supports major blockchains like Ethereum, Base, Arbitrum, Polygon, and Binance Smart Chain — with more networks being added over time.",
  },
  {
    question: "Can I track multiple wallets?",
    answer:
      "Yes, you can add and label as many wallets as you want. CryptoSnoop keeps your watchlist organized so you can monitor different portfolios in one dashboard.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. Your wallet data is never stored on our servers. We use read-only blockchain access and advanced encryption to ensure your information stays private and secure.",
  },
  {
    question: "How often is data updated?",
    answer:
      "Portfolio data, balances, and token prices are updated in real time using reliable blockchain APIs and market feeds to ensure accurate insights every second.",
  },
  {
    question: "Can I see what smart money is doing?",
    answer:
      "Yes! CryptoSnoop lets you track smart wallets, see where large traders are moving funds, and discover trending tokens based on live on-chain activity.",
  },
  {
    question: "Is CryptoSnoop free to use?",
    answer:
      "Yes, basic tracking features are free. Premium plans with deeper analytics, alerts, and early-access features will be available soon.",
  },
  {
    question: "Can I export my portfolio data?",
    answer:
      "No. You can export wallet data and transaction history in CSV format for personal analysis or accounting purposes.",
  },
  {
    question: "How do I get help or report a bug?",
    answer:
      "If you experience any issues or have suggestions, reach out via the 'Contact Support' button in the app or email us directly at support@cryptosnoop.com.",
  },
];


  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      try {
        await logout()
      } catch (error) {
        console.error("Logout failed", error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Back Button and Connection Status */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href="/home" 
            className="inline-flex items-center text-[#c750f7] hover:text-[#c750f7] transition-colors font-semibold"
          >
            <ArrowLeft className="w-8 h-8 font-extrabold mr-2" />
          </Link>
          </div>
          {/* Help & Support and Connection Status - Right Side */}
         

        <p className="text-gray-600 mb-6 text-center">Find answers to common questions or contact our support team</p>

        {/* FAQ Section */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <div key={index} className="border text-[#c750f7] rounded-lg overflow-hidden">
                  <button
                    className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-semibold text-left">{item.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-[#c750f7] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#c750f7] text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 py-3 bg-purple-50 border-t border-gray-200">
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link 
                href="/betPage/profile"
                className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <h3 className="font-bold text-purple-600 mb-1">Your Profile</h3>
                <p className="text-sm text-gray-600">Manage your account and view balance</p>
              </Link>
              
              <Link 
                href="/home/assets"
                className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <h3 className="font-bold text-purple-600 mb-1">Your assets</h3>
                <p className="text-sm text-gray-600">View your added assets</p>
              </Link>
              
              <Link 
                href="/home/addresses"
                className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <h3 className="font-bold text-purple-600 mb-1">your Adresses</h3>
                <p className="text-sm text-gray-600">view saved and labelled adresses</p>
              </Link>
              
              <Link 
                href="/home/monitor-accounts"
                className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <h3 className="font-bold text-purple-600 mb-1">Monitor Account</h3>
                <p className="text-sm text-gray-600">Monitor remote account</p>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Contact Support</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Need personalized assistance? Our support team is here to help you with any questions or issues.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                className="h-12bg-gradient-to-b from-[#c750f7]/60 to-[#c750f7] shadow-[0_10px_15px_-2px_rgba(0,0,0,0.4)] active:translate-y-1 active:shadow-none hover:brightness-95 overflow-hidden hover:  font-bold text-white "
                onClick={() => {
                  window.location.href = 'mailto:cryptosnoopapp.com?subject=Support Request&body=Hello Cryptosnoop Support Team,%0D%0A%0D%0APlease describe your issue here...';
                }}
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Support
              </Button>
              
              <Button
                variant="outline"
                className="h-12  text-[#c750f7] border-[#c750f7] hover:bg-purple-50 active:translate-y-1 font-bold  shadow-lg"
                onClick={() => {
                  window.location.href = 'mailto:cryptosnoopapp@gmail.com?subject=Feedback&body=Hello Cryptosnoop Team,%0D%0A%0D%0AHere is my feedback...';
                }}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Send Feedback
              </Button>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Response Time:</strong> Within 24 hours</p>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <div className="mt-12 flex justify-center">
          <Button
            variant="outline"
            className="px-6 py-3 bg-red-600 text-white border-red-600 active:translate-y-1  font-bold"
            onClick={handleLogout}
          >
          
            Logout
          </Button>
        </div>
      </div>
       <footer className="mt-32 bg-white text-gray-900 py-12 relative z-10">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                 <div className="flex items-center justify-center gap-6 mb-6">
                   <a href="/home/privacy" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline">privacy policy</a>
                   <a href="/home/help" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline">Help</a>
                   <a href={`https://twitter.com/intent/follow?screen_name=${`cryptosnoop_app`}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline" >our socials</a>
                   <a onClick={() => signOut({ callbackUrl: "/auth/signin" })} className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline">Logout</a>
                 </div>
                 <div className="flex items-center justify-center gap-3 mb-4">
                 <div className="w-12 h-12 flex items-center justify-center">
                         <Image
                           src="/cryptosnooplogo1.png"
                           alt="cryptosnoop Logo"
                           width={48}
                           height={32}
                           className="object-contain"
                           priority
                         />
                       </div>
                   <h4 className="text-xl font-bold">CryptoSnoop.app</h4>
                 </div>
                 <p className="text-slate-600 dark:text-slate-400 mb-2">Track your crypto journey with confidence</p>
                 <p className="text-gray-600">© 2025 CryptoSnoop. All rights reserved.</p>
               </div>
             </footer>
    </div>
  )
}