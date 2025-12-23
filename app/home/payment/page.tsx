"use client"
import { signOut as nextAuthSignOut } from 'next-auth/react';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { ethers } from 'ethers';
import Image from 'next/image';
import { usePortfolio } from '@/hooks/usePortfolio';
 
          {error && (<div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6"><p className="font-semibold text-red-700 dark:text-red-300">Error:</p><p className="text-sm text-red-600 dark:text-red-400">{error}</p></div>)}

          {txHash && (<div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-2xl p-4 mb-6"><p className="font-semibold text-green-700 dark:text-green-300">✓ Payment Successful!</p><p className="text-sm text-green-600 dark:text-green-400 break-all">Transaction: {txHash}</p><p className="text-sm text-green-600 dark:text-green-400 mt-2">Redirecting to dashboard...</p></div>)}

          <button onClick={handleCryptoClick} disabled={isProcessing || !!txHash} className="w-full bg-[#c750f7] text-white rounded-2xl p-4 font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">{isProcessing ? 'Waiting for MetaMask...' : txHash ? 'Payment Complete' : 'Pay with MetaMask'}</button>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mt-6"><p className="text-blue-900 dark:text-blue-300 font-semibold mb-2">Instructions:</p><ol className="space-y-1 text-sm text-blue-800 dark:text-blue-400 list-decimal list-inside"><li>Click "Pay with MetaMask" button</li><li>Confirm transaction in MetaMask popup</li><li>Wait for confirmation</li></ol></div>
        </div>
      </main>
    );
  }

  // FIAT PAYMENT FLOW
  if (paymentMethod === 'fiat') {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
          <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Image src="/cryptosnooplogo1.png" alt="Cryptosnoop Logo" width={48} height={32} className="object-contain" priority />
                <div className="flex flex-col leading-none"><span className="font-bold text-sm sm:text-lg leading-tight" style={{ color: '#c750f7' }}>crypto</span><span className="text-slate-700 font-bold text-sm sm:text-lg leading-tight -mt-1 dark:text-white">Snoop</span></div>
              </div>
            </div>
            <button onClick={handleBack} className="flex items-center gap-2 text-[#c750f7] hover:opacity-80 cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
          </div>
        </header>

        <div className="container mx-auto px-3 sm:px-6 py-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900 mb-6"><p className="text-slate-600 dark:text-slate-400 text-center mb-2">{planName && <span className="font-semibold">{planName}</span>}</p><p className="text-slate-600 dark:text-slate-400 text-center mb-2">Amount Due</p><h1 className="text-4xl font-bold text-center text-slate-900 dark:text-white">${paymentAmount.toFixed(2)}</h1></div>

          <div className="space-y-4"><p className="text-slate-600 dark:text-slate-400 font-semibold">Select Payment Method</p><div className="flex justify-center mt-20 sm:mt-24 lg:mt-28"><div className="w-12 h-12 sm:w-8 sm:h-8 border-2 border-[#c750f7] border-t-transparent rounded-full animate-spin"></div></div></div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 mt-6"><p className="text-green-900 dark:text-green-300 font-semibold mb-2">🔒 Secure Payment</p><p className="text-sm text-green-800 dark:text-green-400">Your payment information is encrypted and secured by industry-standard protocols.</p></div>
        </div>

        <footer className="mt-8 bg-white text-gray-900 py-12 relative z-10 dark:bg-slate-900/60"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"><div className="flex flex-wrap items-center justify-center gap-6 mb-6 text-[10px] sm:text-xs md:text-sm"><a href="/home/privacy" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white">privacy policy</a><a href="/home/help" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white">Help</a><a href={`https://twitter.com/intent/follow?screen_name=${`cryptosnoop_app`}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white">our socials</a><a onClick={() => nextAuthSignOut({ callbackUrl: "/" })} className="text-gray-600 cursor-pointer hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white">Logout</a></div><div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4"><div className="w-12 h-12 flex items-center justify-center"><Image src="/cryptosnooplogo1.png" alt="cryptosnooplogo Logo" width={48} height={32} className="object-contain" priority /></div><h4 className="text-sm sm:text-base md:text-lg font-bold dark:text-white">CryptoSnoop.app</h4></div><p className="text-[10px] sm:text-xs md:text-sm text-slate-600 dark:text-white mb-1">Track your crypto journey with confidence</p><p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-white">© {new Date().getFullYear()} CryptoSnoop. All rights reserved.</p></div></footer>
      </main>
    );
  }
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4">Loading...</div>}>
      <PaymentInner />
    </Suspense>
  );
}
            </div>
          )}

          {/* Payment Button */}
          <button
            onClick={handleCryptoClick}
            disabled={isProcessing || !!txHash}
            className="w-full bg-[#c750f7] text-white rounded-2xl p-4 font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Waiting for MetaMask...' : txHash ? 'Payment Complete' : 'Pay with MetaMask'}
          </button>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mt-6">
            <p className="text-blue-900 dark:text-blue-300 font-semibold mb-2">Instructions:</p>
            <ol className="space-y-1 text-sm text-blue-800 dark:text-blue-400 list-decimal list-inside">
              <li>Click "Pay with MetaMask" button</li>
              <li>Confirm transaction in MetaMask popup</li>
              <li>Wait for confirmation</li>
            </ol>
          </div>
        </div>
      </main>
    );
  }

  // ============================================
  // FIAT PAYMENT FLOW
  // ============================================
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
     
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
     
         {/* Right Side: Back button */}
        <button
              onClick={handleBack}
              className="flex items-center gap-2 text-[#c750f7] hover:opacity-80 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
     
       </div>
     </header>
     
     



      <div className="container mx-auto px-3 sm:px-6 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900 mb-6">
          <p className="text-slate-600 dark:text-slate-400 text-center mb-2">
            {planName && <span className="font-semibold">{planName}</span>}
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-2">Amount Due</p>
          <h1 className="text-4xl font-bold text-center text-slate-900 dark:text-white">
            ${paymentAmount.toFixed(2)}
          </h1>
        </div>
 