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
// import { usePrivy } from '@privy-io/react-auth'

export default function HelpPage() {
  const { logout } : string = "" /*usePrivy() */
  const [isWalletConnected, setIsWalletConnected] = useState(true)
  const [networkName, setNetworkName] = useState("Base")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const faqItems = [
    {
      question: "How do I fund my account?",
      answer: "You can fund your account by clicking the 'Fund Account' button in the header or on your profile page. Connect your wallet and transfer USDC to start betting. The minimum deposit is 10 USDC."
    },
    {
      question: "What sports can I bet on?",
      answer: "DIVAFlex currently supports betting on Football, Baseball, Golf, and Basketball. We're constantly adding new sports and events based on user demand."
    },
    {
      question: "How do withdrawals work?",
      answer: "You can withdraw your funds at any time from your profile page. Your withdrawable balance includes your account balance minus any active bets. Withdrawals are processed instantly to your connected wallet."
    },
    {
      question: "What is the difference between Account Balance and Allowance?",
      answer: "Account Balance is the total amount you've deposited. Allowance is the amount you've approved for the smart contract to use for placing bets. You need to approve allowance before placing your first bet."
    },
    {
      question: "How are odds calculated?",
      answer: "Our odds are calculated based on real-time market data and adjusted dynamically based on betting activity. We use a decentralized oracle system to ensure fair and accurate odds."
    },
    {
      question: "What happens if a game is cancelled?",
      answer: "If a game is cancelled or postponed, all bets are automatically voided and your funds are returned to your account balance within 24 hours."
    },
    {
      question: "Is there a betting limit?",
      answer: "Yes, betting limits vary by sport and event. Minimum bet is 1 USDC, and maximum bet depends on the liquidity pool for each event. You'll see the max bet amount when placing your bet."
    },
    {
      question: "How do I check my betting history?",
      answer: "Go to the 'Positions' page from the main navigation to view all your active and past bets, including results and payout history."
    },
    {
      question: "What wallets are supported?",
      answer: "We support MetaMask, Coinbase Wallet, WalletConnect, and Rabby Wallet. Make sure you're connected to the Base network for the best experience."
    },
    {
      question: "How do I contact support?",
      answer: "You can reach our support team by clicking the 'Contact Support' button below or emailing us directly at support@divaflex.com. We typically respond within 24 hours."
    }
  ]

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
            href="/betPage" 
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors font-semibold"
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
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-semibold text-left">{item.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
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
                href="/home/wallets"
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
                className="h-12 bg-gradient-to-b from-purple-500 to-purple-700 shadow-[0_10px_15px_-2px_rgba(0,0,0,0.4)] active:translate-y-1 active:shadow-none hover:brightness-95 hover:bg-purple-700 font-bold text-white "
                onClick={() => {
                  window.location.href = 'mailto:support@divaflex.com?subject=Support Request&body=Hello DIVAFlex Support Team,%0D%0A%0D%0APlease describe your issue here...';
                }}
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Support
              </Button>
              
              <Button
                variant="outline"
                className="h-12  border-purple-500 text-purple-600 hover:bg-purple-50 active:translate-y-1 font-bold  shadow-lg"
                onClick={() => {
                  window.location.href = 'mailto:feedback@divaflex.com?subject=Feedback&body=Hello DIVAFlex Team,%0D%0A%0D%0AHere is my feedback...';
                }}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Send Feedback
              </Button>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Support Email:</strong> support@divaflex.com</p>
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
                  <a href="#home" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline">Home</a>
                  <a href="#help" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline">Help</a>
                  <a href="#assets" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline">Assets</a>
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