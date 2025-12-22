'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  X,
  TrendingUp,
  BarChart3,
  Bell,
  Shield,
  ArrowLeft
} from 'lucide-react';
import Image from "next/image"
import Link from "next/link"


// -------------------
// Test Modal Component
// -------------------
function TestPlanModal({ isOpen, onClose, onActivate }) {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
  setLoading(true);

  // run both functions immediately
  onActivate();
    // your second function

  // stop spinner after 7 seconds
  setTimeout(() => setLoading(false), 7000);
};

  const testFeatures = [
     {
      icon: Bell,
      title: 'Track and label up to 50 addresses, organized your way with expanded storage for the entire week.',
      description: 'Organize up to 50 addresses with clean labeling and flexible sorting, giving you total control without storage restrictions.'
    },
    {
      icon: TrendingUp,
      title: '7 days of unlimited portfolio tracking',
      description: 'Track every asset in your portfolio with complete freedom - no limits, no locked tools, just smooth insights your way for a full week.'
    },
    {
      icon: BarChart3,
      title: '7 days of unlimited remote wallet tracking, fully powered and always on.',
      description: 'Monitor any wallet instantly and in real time, giving you full visibility across your ecosystem for 7 days of uninterrupted tracking.'
    },
    
    {
      icon: 'Bell',
      title: 'Faster Real-time price updates, delivered your way the moment markets move.',
      description: 'Stay ahead with live market data sent directly as prices shift — always fast, always fresh, always in sync.'
    },
     
     
  ];

  return (
   <div
  className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm dark:bg-black/70"
  style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
  onClick={onClose}
>
  <div
    className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
    style={{
      boxShadow: '0 25px 70px -10px rgba(199, 80, 247, 0.6)'
    }}
    onClick={(e) => e.stopPropagation()}
  >
    {/* Close Button */}
    <button
      onClick={onClose}
      className="absolute top-6 right-6 text-slate-400 dark:text-slate-500 hover:text-[#c750f7] transition-colors z-10"
    >
      <X className="w-7 h-7" />
    </button>

    {/* Header */}
    <div className="p-8">
      <Sparkles className="w-12 h-12 mb-4 text-[#c750f7]" />
      <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
        Test Our Premium Features
      </h2>
      <p className="text-slate-600 dark:text-slate-300">
        Experience what it's like to have full access to CryptoSnoop Pro
      </p>
    </div>

    {/* Features */}
    <div className="p-8 pt-0">
      <div className="grid gap-6 mb-8">
        {testFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center"> <Icon className="w-6 h-6 text-[#c750f7]" /> </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Test Plan Details */}
      <div className="bg-purple-50 dark:bg-purple-900/30 rounded-2xl p-6 mb-6">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            🧪 7-Day Test Plan
          </h3>
          <div className="text-right">
            <span className="text-3xl font-bold text-[#c750f7]">$3.99</span>
            <span className="text-slate-600 dark:text-slate-300 text-sm ml-1">
              for 7 days
            </span>
          </div>
        </div>

        <ul className="space-y-2 text-slate-700 dark:text-slate-300">
          <li className="flex items-start">
            <Check className="w-5 h-5 mr-2 text-[#c750f7] flex-shrink-0 mt-0.5" />
            Full access to all premium features
          </li>
          <li className="flex items-start">
            <Check className="w-5 h-5 mr-2 text-[#c750f7] flex-shrink-0 mt-0.5" />
            One-time payment, no recurring charges
          </li>
          <li className="flex items-start">
            <Check className="w-5 h-5 mr-2 text-[#c750f7] flex-shrink-0 mt-0.5" />
            Try before committing to monthly/yearly plans
          </li>
          <li className="flex items-start">
            <Check className="w-5 h-5 mr-2 text-[#c750f7] flex-shrink-0 mt-0.5" />
            Automatic downgrade after 7 days
          </li>
        </ul>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onClose}
          className="flex-1 py-4 px-6 rounded-xl font-bold border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          Maybe Later
        </button>
        <button
  onClick={handleButtonClick}
  disabled={loading}
  className={`flex-1 py-4 px-6 rounded-xl font-bold text-[#c750f7] border-2 border-[#c750f7]
    hover:bg-[#c750f7]/10 dark:hover:bg-[#c750f7]/20 transition-all flex items-center justify-center gap-2
    ${loading ? "opacity-70 cursor-not-allowed" : ""}
  `}
>
  {loading ? (
    <span className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full"></span>
  ) : (
    "Start Test for $3.99 🚀"
  )}
</button>

      </div>
    </div>
  </div>
</div>

  );
}

// -------------------
// Subscription Page
// -------------------
export default function SubscriptionPage() {
  const router = useRouter();
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$7.99',
      priceValue: 7.99,
      period: '/month',
      icon: "zap.png",
      color: '#4ecdc4',
      features: [
         'One month of unlimited remote wallet tracking, fully powered and always on.',
        'Track and label up to 50 addresses, organized your way with expanded storage.',
        'One month of unlimited portfolio tracking, built your way with every feature unlocked.',
        'Faster Real-time price updates, delivered your way the moment markets move.',
        'Priority support, shaped around your needs every step of the month.',
        'Early access to new updates, rolled out your way before anyone else.'
      ],
      popular: false
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '$79.99',
      priceValue: 79.99,
      period: '/year',
      savings: 'Save $16',
      icon: "star.png",
      color: '#c750f7',
      features: [
        'One year of unlimited remote wallet tracking, fully powered and always on.',
        'Track and label up to 50 addresses, organized your way with expanded storage all year long.',
        'One year of unlimited portfolio tracking, built your way with every feature unlocked.',
        'Faster Real-time price updates, delivered your way the moment markets move.',
        'Priority support, shaped around your needs throughout the year.',
        'Early access to new updates, rolled out your way before anyone else.'
      ],
      popular: true
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '$269',
      priceValue: 269,
      period: 'one-time',
      savings: 'Best Value',
      icon: "Crown.png",
      color: '#ffd93d',
      features: [
        'Lifetime unlimited remote wallet tracking, fully powered and always on without limits.',
        'Track and label up to 50 addresses, organized your way with permanently expanded storage.',
        'Lifetime unlimited portfolio tracking, built your way with every feature unlocked forever.',
        'Faster Real-time price updates, delivered your way the moment markets move.',
        'Priority support, shaped around your needs for life.',
        'Early access to new updates, rolled out your way long before anyone else.',
       
      ],
      popular: false
    }
  ];
const [loading, setLoading] = useState(false);

  const handleSelectPlan = (plan) => {
    setLoading(true);
  setTimeout(() => setLoading(false), 7000);
    // Navigate immediately to payment page with amount
    router.push(`/home/payment?amount=${plan.priceValue}&plan=${plan.id}&name=${encodeURIComponent(plan.name)}`);
    
  };

  const handleTestPlanActivate = () => {
    setIsTestModalOpen(false);
    // Navigate to payment page with test plan amount
    router.push('/home/payment?amount=3.99&plan=test&name=Test%20Plan');
  };

  return (
    <>
      <TestPlanModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onActivate={handleTestPlanActivate}
      />

      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
        {/* Header */}
      
       
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
         <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
       
           {/* Left Side: Logo */}
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
            <Link href="/home"
              
                    className="flex items-center gap-2 text-[#c750f7] hover:opacity-80 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                 </Link>
           
         </div>
       </header>
       

        {/* Content */}
        <div className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Upgrade Your Plan
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Choose the perfect plan for your crypto portfolio tracking needs
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => {
                const Icon = plan.icon;
                const isSelected = selectedPlan === plan.id;

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 backdrop-blur-xl border bg-white/10 ${
                      plan.popular ? 'ring-4 ring-purple-500 ring-opacity-50 border-white/30' : 'border-white/20'
                    }`}
                    style={{
                      boxShadow: plan.popular
                        ? `0 20px 60px -10px ${plan.color}60`
                        : '0 10px 40px -10px rgba(0,0,0,0.1)'
                    }}
                  >
                    {plan.popular && (
                      <div
                        className="absolute top-0 right-0 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl backdrop-blur-sm border-l border-b border-white/20"
                        style={{ background: 'rgba(199, 80, 247, 0.8)' }}
                      >
                        MOST POPULAR
                      </div>
                    )}

                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                         <img
    src={`/${plan.icon}`} // ✅ uses the filename from plan.icon
    alt={plan.name}
    className="w-16 h-10"
    style={{ color: plan.color }} // note: this won’t change PNG color, only for SVGs
  />
                        {plan.savings && !plan.popular && (
                          <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold border border-white/20 text-slate-700 dark:text-slate-300">
                            {plan.savings}
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{plan.name}</h3>
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                        <span className="ml-2 text-slate-600 dark:text-slate-400">
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    <div className="p-8 pt-0">
                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check
                              className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
                              style={{ color: plan.color }}
                            />
                            <span className="text-slate-700 dark:text-slate-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                   <button
  onClick={() => handleSelectPlan(plan)}
  disabled={loading}
  className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 border-2
    hover:shadow-lg hover:scale-105 backdrop-blur-sm flex items-center justify-center gap-2
    ${loading ? "opacity-70 cursor-not-allowed" : ""}
  `}
  style={{
    borderColor: plan.color,
    color: plan.color
  }}
>
  {loading ? (
    <span className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full"></span>
  ) : (
    "Get Started"
  )}
</button>



                    </div>
                  </div>
                );
              })}
            </div>

            {/* Test Plan CTA */}
            <div className="text-center mt-8 mb-12">
              <p className="text-slate-700 dark:text-slate-300 text-base">
                Want to test out our plan to see what it's like to upgrade?{' '}
                <button
                  onClick={() => setIsTestModalOpen(true)}
                  className="text-[#c750f7] font-bold underline hover:text-[#a742d1] transition-colors"
                >
                  Click here
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
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
    </>
  );
}