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
import { deleteAccount } from "@/components/deleteAccount";


// import { usePrivy } from '@privy-io/react-auth'

  export default function HelpPage() {
  
  const [isWalletConnected, setIsWalletConnected] = useState(true)
  const [networkName, setNetworkName] = useState("Base")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
    const name = session?.user?.name;
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const CONFIRM_PHRASE = "DELETE MY ACCOUNT";

 


const handleDelete = async () => {
    // Get the user ID from the session
    if (!session?.user?.id) {
      setError("No user session found");
      return;
    }

    // Verify they typed the correct confirmation phrase
    if (confirmText !== CONFIRM_PHRASE) {
      setError("Please type the confirmation phrase correctly");
      return;
    }

    // Start the deletion process
    setIsDeleting(true);
    setError("");

    // Call the delete account function which will:
    // 1. Call your DELETE /api/users?userId=xxx endpoint
    // 2. If successful, sign out the user
    // 3. Return success or error status
    const result = await deleteAccount(session.user.id);

    // If deletion failed, show error message
    if (!result.success) {
      setError(result.message);
      setIsDeleting(false);
    }
    // If successful, user will already be signed out and redirected
  };

  const handleClose = () => {
    setShowConfirm(false);
    setConfirmText("");
    setError("");
  };



  const faqItems = [
  {
    question: "What is CryptoSnoop?",
    answer:
      "CryptoSnoop is a crypto tracking platform that helps you monitor wallets, track wallet addresses, analyze portfolio performance, and access real-time crypto analytics.",
  },
  {
    question: "Do I need to connect my wallet?",
    answer:
      "Not necessarily. You don’t need to connect your wallet to start tracking. Simply paste any wallet address, choose the blockchain, and view its portfolio and token holdings instantly.",
  },
  {
    question: "Which blockchains are supported?",
    answer:
      "CryptoSnoop supports major blockchains including Ethereum, Solana, Base, Arbitrum, Polygon, and Binance Smart Chain (BSC). We’re adding more networks over time to ensure broad coverage.",
  },
  {
    question: "Can I track multiple wallets?",
    answer:
      "Yes! You can add and track as many wallets as you want. An advanced watchlist feature is coming soon to help you stay organized while monitoring multiple addresses effortlessly.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. Your wallet data is never stored on our servers. We use read-only blockchain access and advanced encryption to keep your information private and secure.",
  },
  {
    question: "Can I label multiple wallets?",
    answer:
      "Yes. On the free plan, you can add and label up to 15 active addresses. On the upgraded CryptoSnoop plan, you can manage and label up to 50 addresses.",
  },
  {
    question: "How often is data updated?",
    answer:
      "Portfolio balances, token prices, and wallet data are updated in real time using reliable blockchain APIs and market feeds, ensuring accurate insights every second.",
  },
  {
    question: "Is CryptoSnoop free to use?",
    answer:
      "Yes! Basic tracking features are free. Premium features—such as advanced wallet tracking across all chains, deeper analytics, more wallet label slots, dark mode, and early-access features—are available when you upgrade.",
  },
  {
    question: "Can I export my portfolio data?",
    answer:
      "Not yet. Exporting wallet data or transaction history in CSV format for personal analysis or accounting is coming soon in a future update.",
  },
  {
    question: "How do I get help or report a bug?",
    answer:
      "If you encounter any issues or have suggestions, reach out via the 'Contact Support' button in the web app or email us directly. We’re always here to help!",
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 text-gray-900 dark:from-slate-900 dark:to-slate-800">
        
       {/* Header with Back Button and Connection Status */}
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
                       
                       <Link 
            href="/home" 
            className="inline-flex items-center text-[#c750f7] hover:text-[#c750f7] transition-colors font-semibold">
            
                        
                               
                              
                                <ArrowLeft className="w-5 h-5" />
                             </Link>
                       
                     </div>
                   </header>
        
          
          {/*  <p className="text-gray-600 mb-6 text-center">Find answers to common questions or contact our support team</p> Help & Support and Connection Status - Right Side */}
         

        

        {/* FAQ Section */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <div key={index} className="border text-white rounded-lg overflow-hidden dark:bg-slate-900/60">
                  <button
                    className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 dark:bg-slate-900/60 transition-colors"
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
                    <div className="px-4 py-3 bg-purple-50 border-t dark:bg-slate-900/60 border-gray-200 ">
                      <p className="text-gray-700 dark:text-white">{item.answer}</p>
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
                href="/home"
                className="p-4 border border-purple-200 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900/60 transition-colors"
              >
                <h3 className="font-bold text-purple-600 mb-1">Your Profile</h3>
                <p className="text-sm text-gray-600 dark:text-white">Manage your account and view balance</p>
              </Link>
              
              <Link 
                href="/home/assets"
                className="p-4 border border-purple-200 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900/60 transition-colors"
              >
                <h3 className="font-bold text-purple-600 mb-1">Your assets</h3>
                <p className="text-sm text-gray-600 dark:text-white">View your added assets</p>
              </Link>
              
              <Link 
                href="/home/addresses"
                className="p-4 border border-purple-200 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900/60 transition-colors"
              >
                <h3 className="font-bold text-purple-600 mb-1">your Adresses</h3>
                <p className="text-sm text-gray-600 dark:text-white">view saved and labelled adresses</p>
              </Link>
              
              <Link 
                href="/home/monitor-accounts"
                className="p-4 border border-purple-200 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900/60 transition-colors"
              >
                <h3 className="font-bold text-purple-600 mb-1">Monitor Account</h3>
                <p className="text-sm text-gray-600 dark:text-white">Monitor remote account</p>
              </Link>

              <Link 
                href="/home/subscribe"
                className="p-4 border border-purple-200 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900/60 transition-colors"
              >
                <h3 className="font-bold text-purple-600 mb-1">Upgrade plan</h3>
                <p className="text-sm text-gray-600 dark:text-white">Upgrade plan to premium to unlock more features</p>
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
            <p className="text-gray-600 mb-4 dark:text-white">
              Need personalized assistance? Our support team is here to help you with any questions or issues.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             
              
              <Button
                 variant="ghost"
                         
                 className="text-white  text-xs sm:text-sm h-8 sm:h-10 flex-shrink-0  bg-gradient-to-b from-[#c750f7]/60 to-[#c750f7] 
               shadow-[0_8px_12px_-2px_rgba(0,0,0,0.35)] 
               active:translate-y-1 active:shadow-none 
               hover:brightness-95 overflow-hidden transition-all duration-200"

                onClick={() => {
                  window.location.href = 'mailto:cryptosnoopapp@gmail.com?subject=Feedback&body=Hello Cryptosnoop Team,%0D%0A%0D%0AHere is my feedback...';
                }}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Send Feedback
              </Button>
            </div>
            <div className="mt-4 text-sm text-gray-600 dark:text-white">
              <p><strong>Response Time:</strong> Within 24 hours</p>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
         
        <div className="mt-12 flex justify-center">
          <Button
            variant="outline"
            className="px-6 py-3 bg-red-500 text-white border-red-500 active:translate-y-1  font-bold"
            onClick={handleLogout}
          >
          
            Logout
          </Button>
        </div>
     
     {/* DELETE Button. the handle delete func shoulf have a alert(are you sure) */}
         
        <div className="mt-12 flex justify-center">
          <button
         variant="outline"
        onClick={() => setShowConfirm(true)}
        className="px-6 py-3 rounded-lg bg-red-500 text-white border-red-500 active:translate-y-1  font-bold"
      >
        Delete Account
      </button>
        </div>


      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-900">
            Are You Sure You Want to Delete This Account?
            </h3>
            
            <div className="mb-6 space-y-3">
              <p className="text-gray-700 font-semibold">
                This action cannot be undone. This will permanently:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                <li>Delete your account</li>
                <li>Remove all your data</li>
                <li>Revoke all access to the web application</li>
              </ul>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-bold text-red-600">{CONFIRM_PHRASE}</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                disabled={isDeleting}
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                disabled={isDeleting || confirmText !== CONFIRM_PHRASE}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
              </button>
              <button
                onClick={handleClose}
                disabled={isDeleting}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md disabled:opacity-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    
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
    </div>
  )
}