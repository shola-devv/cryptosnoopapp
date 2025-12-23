"use client"
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { usePortfolio } from '@/hooks/usePortfolio';

// Smart Contract ABI (minimal) and address
const PAYMENT_CONTRACT_ABI = [
  {
    type: 'function',
    name: 'payForService',
    stateMutability: 'payable',
    inputs: [{ name: 'orderId', type: 'string' }],
    outputs: [],
  },
  {
    type: 'event',
    name: 'PaymentReceived',
    inputs: [
      { name: 'payer', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'orderId', type: 'string', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
];

const CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';

function PaymentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { marketData } = usePortfolio();

  const [paymentMethod, setPaymentMethod] = useState<'select' | 'crypto' | 'fiat'>('select');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [planName, setPlanName] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  function handleBack() {
    router.back();
  }

  // Read URL params (amount, name, plan)
  useEffect(() => {
    const amount = searchParams.get('amount');
    const name = searchParams.get('name') || searchParams.get('plan');

    if (amount) {
      const parsed = Number(amount);
      if (!Number.isNaN(parsed)) setPaymentAmount(parsed);
      // If an amount is present in the URL, default to crypto payment flow
      setPaymentMethod((prev) => (prev === 'select' ? 'crypto' : prev));
    }

    if (name) {
      try {
        setPlanName(decodeURIComponent(name));
      } catch {
        setPlanName(name);
      }
    }
  }, [searchParams]);

  // Extract ETH price from market data
  const realEthPrice = marketData?.find((coin: any) =>
    coin?.symbol?.toLowerCase?.() === 'eth' || coin?.id?.toLowerCase?.() === 'ethereum'
  )?.price as number | undefined;

  const ethPrice = realEthPrice ?? 2500;

  // Compute ETH amount (string with 6 decimal places)
  const ethAmount = paymentAmount > 0 ? (paymentAmount / ethPrice).toFixed(6) : '0.000000';

  async function handleCryptoClick() {
    const result = await makeSmartContractPayment();
    if (result.success) {
      console.log('Payment successful!', result);
      setTimeout(() => router.push('/home/subscribe'), 3000);
    }
  }

  // Wallet address to show for manual transfers
  const walletAddress = '0xf9b3715CF2De8C164e1140f122dDFa798B5D72Aa';

  const copyToClipboard = () => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ============================================
  // Smart Contract Payment Function
  // ============================================
  async function makeSmartContractPayment() {
    setIsProcessing(true);
    setError('');
    setTxHash(null);

    try {
      const anyWindow = window as any;
      if (!anyWindow?.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const orderId = `ORDER-${Date.now()}`;

      // Dynamically import ethers to avoid server-side bundling issues
      const ethersMod: any = await import('ethers');

      // Provider & signer
      const provider = new ethersMod.BrowserProvider(anyWindow.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();

      // Contract instance
      const contract: any = new ethersMod.Contract(CONTRACT_ADDRESS, PAYMENT_CONTRACT_ABI, signer);

      // Convert ETH to Wei
      const weiAmount = ethersMod.parseEther(ethAmount);

      // Send payment
      const tx: any = await contract.payForService(orderId, {
        value: weiAmount,
        gasLimit: 100000,
      });

      setTxHash(tx.hash);
      await tx.wait(1);

      return { success: true, txHash: tx.hash, orderId, amount: ethAmount };
    } catch (err: any) {
      const errorMessage = err?.reason || err?.message || 'Payment failed';
      setError(errorMessage);
      console.error('Payment error:', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
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
            <button
              onClick={() => setPaymentMethod('crypto')}
              className={`px-4 py-2 rounded-md transition-colors ${paymentMethod === 'crypto' ? 'bg-[#c750f7] text-white' : 'bg-white dark:bg-slate-900 border'}`}
            >
              Crypto
            </button>
            <button
              onClick={() => setPaymentMethod('fiat')}
              className={`px-4 py-2 rounded-md transition-colors ${paymentMethod === 'fiat' ? 'bg-[#c750f7] text-white' : 'bg-white dark:bg-slate-900 border'}`}
            >
              Fiat
            </button>
          </div>
        </div>

        {paymentMethod === 'select' && (
          <div className="mt-8 text-center text-sm text-slate-600">Choose a payment method to proceed.</div>
        )}

        {paymentMethod === 'crypto' && (
          <div className="mt-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900 mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Ethereum Amount</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{ethAmount} ETH</p>
            </div>

            {/* Wallet Address */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900 mb-6">
              <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-3">Send to wallet address:</p>
              <div className="flex items-center gap-2 bg-purple-50 dark:bg-slate-800 rounded-xl p-3">
                <code className="flex-1 font-mono text-sm text-slate-900 dark:text-white break-all">{walletAddress}</code>
                <button onClick={copyToClipboard} className="flex-shrink-0 p-2 hover:bg-purple-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  {copied ? (<Check className="w-5 h-5 text-green-600" />) : (<Copy className="w-5 h-5 text-slate-600 dark:text-slate-400" />)}
                </button>
              </div>
            </div>

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

     