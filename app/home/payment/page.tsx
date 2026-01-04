"use client"
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Check, Loader2, AlertCircle, CheckCircle, X, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

const BACKEND_WALLET = process.env.NEXT_PUBLIC_BACKEND_WALLET || '0x742e128e7c72b93bd8eff07f0ae1ae33f5a92bce';

// ✅ Proper type definition for modal data
interface ModalData {
  message?: string;
  details?: string;
  subscription?: {
    plan: string;
    status: string;
    duration: string;
    expiryDate: string | 'lifetime';
  };
  transaction?: {
    hash: string;
    amount: number;
    explorerUrl?: string;
  };
}

// Keep your existing PaymentStatusModal component - it's perfect as is

function PaymentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [copied, setCopied] = useState(false);
  const [planName, setPlanName] = useState<string>('');
  const [planId, setPlanId] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  
  // Auto-check state
  const [isChecking, setIsChecking] = useState(false);
  const [checkCount, setCheckCount] = useState(0);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [modalMessage, setModalMessage] = useState('');
  const [modalData, setModalData] = useState<ModalData | undefined>(undefined);

  function handleBack() {
    router.back();
  }

  // Read URL params
  useEffect(() => {
    const amount = searchParams.get('amount');
    const name = searchParams.get('name');
    const plan = searchParams.get('plan');

    if (amount) {
      const parsed = Number(amount);
      if (!Number.isNaN(parsed)) setPaymentAmount(parsed);
    }

    if (name) {
      try {
        setPlanName(decodeURIComponent(name));
      } catch {
        setPlanName(name);
      }
    }

    if (plan) {
      setPlanId(plan);
    }
  }, [searchParams]);

  // Auto-check for payment every 15 seconds
  useEffect(() => {
    if (!planId) return;

    const checkPayment = async () => {
      setIsChecking(true);
      
      try {
        const response = await fetch('/api/verify-payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: planId,
            expectedAmount: paymentAmount,
          }),
        });

        const data = await response.json();

        if (data.found) {
          // Payment detected!
          setModalOpen(true);
          setModalStatus('success');
          setModalMessage('Payment Detected!');
          setModalData(data);

          setTimeout(() => {
            router.push('/home');
          }, 6000);
        } else {
          setCheckCount(prev => prev + 1);
        }
      } catch (error) {
        console.error('Check payment error:', error);
      } finally {
        setIsChecking(false);
      }
    };

    // Check immediately on mount
    checkPayment();

    // Then check every 15 seconds
    const interval = setInterval(checkPayment, 15000);

    // Stop checking after 10 minutes (40 checks)
    if (checkCount >= 40) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [planId, paymentAmount, checkCount, router]);

  const copyToClipboard = () => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(BACKEND_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const manualCheck = async () => {
    setIsChecking(true);
    setModalOpen(true);
    setModalStatus('processing');
    setModalMessage('Checking for your payment...');

    try {
      const response = await fetch('/api/verify-payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: planId,
          expectedAmount: paymentAmount,
        }),
      });

      const data = await response.json();

      if (data.found) {
        setModalStatus('success');
        setModalMessage('Payment Found!');
        setModalData(data);

        setTimeout(() => {
          router.push('/home');
        }, 4000);
      } else {
        setModalStatus('error');
        setModalMessage('Payment Not Found Yet');
        setModalData({ 
          details: 'Please wait a few seconds and try again. Blockchain confirmations can take 15-60 seconds.' 
        });
      }
    } catch (error) {
      setModalStatus('error');
      setModalMessage('Check Failed');
      setModalData({ 
        details: 'Unable to check payment status. Please try again.' 
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <PaymentStatusModal
        isOpen={modalOpen}
        status={modalStatus}
        message={modalMessage}
        data={modalData}
        onClose={() => {
          setModalOpen(false);
          if (modalStatus === 'success') {
            router.push('/home');
          }
        }}
      />

      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
          <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Image src="/cryptosnooplogo1.png" alt="Cryptosnoop Logo" width={48} height={32} className="object-contain" priority />
                <div className="flex flex-col leading-none">
                  <span className="font-bold text-sm sm:text-lg leading-tight" style={{ color: '#c750f7' }}>crypto</span>
                  <span className="text-slate-700 font-bold text-sm sm:text-lg leading-tight -mt-1 dark:text-white">Snoop</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleBack} 
              className="flex items-center gap-2 text-[#c750f7] hover:opacity-80 cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="container mx-auto px-3 sm:px-6 py-8 max-w-2xl">
          
          {/* Payment Amount Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900 mb-6">
            {planName && (
              <p className="text-slate-600 dark:text-slate-400 text-center mb-2">
                <span className="font-semibold text-[#c750f7]">{planName}</span> Plan
              </p>
            )}
            <p className="text-slate-600 dark:text-slate-400 text-center mb-2">Amount to Pay</p>
            <h1 className="text-5xl font-bold text-center text-slate-900 dark:text-white">
              ${paymentAmount.toFixed(2)}
            </h1>
            <p className="text-center text-slate-500 dark:text-slate-400 mt-2 text-sm">
              USDT (Tether) - Ethereum Network
            </p>
          </div>

          {/* Auto-Check Status */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isChecking ? (
                  <Loader2 className="w-5 h-5 text-[#c750f7] animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-[#c750f7]" />
                )}
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {isChecking ? 'Checking for payment...' : 'Monitoring for payment'}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    We&apos;ll detect your payment automatically
                  </p>
                </div>
              </div>
              <button
                onClick={manualCheck}
                disabled={isChecking}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-[#c750f7] transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                <span className="text-sm font-semibold">Check Now</span>
              </button>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900 mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              📤 Send Payment
            </h2>
            
            <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-3">
              Send exactly <span className="text-[#c750f7] font-bold">${paymentAmount} USDT</span> to:
            </p>
            
            <div className="flex items-center gap-2 bg-purple-50 dark:bg-slate-800 rounded-xl p-3 mb-4">
              <code className="flex-1 font-mono text-sm text-slate-900 dark:text-white break-all">
                {BACKEND_WALLET}
              </code>
              <button
                onClick={copyToClipboard}
                className="flex-shrink-0 p-2 hover:bg-purple-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="Copy address"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                )}
              </button>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <p className="text-yellow-900 dark:text-yellow-300 font-semibold mb-2">
                ⚠️ Important:
              </p>
              <ul className="space-y-1 text-sm text-yellow-800 dark:text-yellow-400 list-disc list-inside">
                <li>Use <strong>Ethereum network</strong> only</li>
                <li>Send exactly ${paymentAmount} USDT</li>
                <li>Other networks = lost funds ❌</li>
                <li>We&apos;ll detect payment automatically ✅</li>
              </ul>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
            <p className="text-blue-900 dark:text-blue-300 font-semibold mb-2">
              🎯 How it works:
            </p>
            <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-400 list-decimal list-inside">
              <li>Copy the address above</li>
              <li>Send ${paymentAmount} USDT from your wallet</li>
              <li>Wait 15-60 seconds for blockchain confirmation</li>
              <li>We&apos;ll automatically detect and verify your payment</li>
              <li>Your subscription activates instantly! 🎉</li>
            </ol>
            <p className="text-xs text-blue-700 dark:text-blue-500 mt-3">
              💡 No transaction hash needed - fully automatic!
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 bg-white text-gray-900 py-12 dark:bg-slate-900/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex flex-wrap items-center justify-center gap-6 mb-6 text-xs">
              <a href="/home/privacy" className="text-gray-600 hover:text-[#c750f7] transition-colors font-medium underline dark:text-white">
                Privacy Policy
              </a>
              <a href="/home/help" className="text-gray-600 hover:text-[#c750f7] transition-colors font-medium underline dark:text-white">
                Help
              </a>
              <button 
                onClick={() => signOut({ callbackUrl: "/" })} 
                className="text-gray-600 cursor-pointer hover:text-[#c750f7] transition-colors font-medium underline dark:text-white"
              >
                Logout
              </button>
            </div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image src="/cryptosnooplogo1.png" alt="Logo" width={48} height={32} className="object-contain" priority />
              <h4 className="text-base font-bold dark:text-white">CryptoSnoop.app</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-white">
              © {new Date().getFullYear()} CryptoSnoop. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#c750f7] animate-spin" />
      </div>
    }>
      <PaymentInner />
    </Suspense>
  );
}