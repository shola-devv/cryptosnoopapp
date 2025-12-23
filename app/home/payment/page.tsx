"use client"
import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

function PaymentInner() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'select' | 'crypto' | 'fiat'>('select');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const planName = 'Pro Plan';
  const paymentAmount = 9.99;

  function handleBack() {
    router.back();
  }

  async function handleCryptoClick() {
    setError(null);
    setIsProcessing(true);
    try {
      // Simulate a wallet flow for build-time safety; integrate ethers logic in a later iteration
      await new Promise((res) => setTimeout(res, 1200));
      setTxHash('0x' + Math.random().toString(16).slice(2, 10));
      setIsProcessing(false);
      setTimeout(() => router.push('/home'), 800);
    } catch (err) {
      setError('Payment failed.');
      setIsProcessing(false);
    }
  }

  return (
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
          <button onClick={handleBack} className="flex items-center gap-2 text-[#c750f7] hover:opacity-80 cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-6 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900 mb-6">
          <p className="text-slate-600 dark:text-slate-400 text-center mb-2">{planName && <span className="font-semibold">{planName}</span>}</p>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-2">Amount Due</p>
          <h1 className="text-4xl font-bold text-center text-slate-900 dark:text-white">${paymentAmount.toFixed(2)}</h1>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6">
            <p className="font-semibold text-red-700 dark:text-red-300">Error:</p>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {txHash && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-2xl p-4 mb-6">
            <p className="font-semibold text-green-700 dark:text-green-300">✓ Payment Successful!</p>
            <p className="text-sm text-green-600 dark:text-green-400 break-all">Transaction: {txHash}</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">Redirecting to dashboard...</p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400 font-semibold">Select Payment Method</p>
          <div className="flex gap-4">
            <button onClick={() => setPaymentMethod('crypto')} className="px-4 py-2 rounded-md bg-[#c750f7] text-white">Crypto</button>
            <button onClick={() => setPaymentMethod('fiat')} className="px-4 py-2 rounded-md border">Fiat</button>
          </div>
        </div>

        {paymentMethod === 'select' && (
          <div className="mt-8 text-center text-sm text-slate-600">Choose a payment method to proceed.</div>
        )}

        {paymentMethod === 'crypto' && (
          <div className="mt-6">
            <button onClick={handleCryptoClick} disabled={isProcessing || !!txHash} className="w-full bg-[#c750f7] text-white rounded-2xl p-4 font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isProcessing ? 'Waiting for MetaMask...' : txHash ? 'Payment Complete' : 'Pay with MetaMask'}
            </button>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mt-6">
              <p className="text-blue-900 dark:text-blue-300 font-semibold mb-2">Instructions:</p>
              <ol className="space-y-1 text-sm text-blue-800 dark:text-blue-400 list-decimal list-inside">
                <li>Click "Pay with MetaMask" button</li>
                <li>Confirm transaction in MetaMask popup</li>
                <li>Wait for confirmation</li>
              </ol>
            </div>
          </div>
        )}

        {paymentMethod === 'fiat' && (
          <div className="mt-8 text-center">
            <div className="w-12 h-12 mx-auto border-2 border-[#c750f7] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-6 text-green-800 dark:text-green-300">🔒 Secure Payment — processing</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4">Loading...</div>}>
      <PaymentInner />
    </Suspense>
  );
}

     