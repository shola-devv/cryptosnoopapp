'use client'

import Image from 'next/image'
import { signOut } from "next-auth/react";


export default function notFound() {


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
              style={{ color: '#c750f7' }}
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

  {/* Spinner centered horizontally with top spacing */}
  <div className="flex justify-center mt-20 sm:mt-24 lg:mt-28">
    
            <Image
            src="/cryptosnooplogo1.png"
            alt="DIVAFlex Logo"
            width={64}
            height={48}
            className="object-contain animate-bounce"
            priority
            ></Image>
           

  </div>
   <div className="flex justify-center mt-8 sm:mt-8 lg:mt-12 font-bold">
    
          <p>404 | page not found </p>
  </div>
  
  {/* Footer pushed down so only ~1/8 of it is visible */}
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
        <a href={`https://twitter.com/intent/follow?screen_name=${`cryptosnoop_app`}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline" >our socials</a>
        <a
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
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
      <p className="text-gray-600">© {new Date().getFullYear()} CryptoSnoop. All rights reserved.</p>
    </div>
  </footer>
</main>
    )


}