'use client'
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { ethers } from 'ethers';
import Image from "next/image";
import { usePortfolio } from "@/hooks/usePortfolio";

// Smart Contract ABI
const PAYMENT_CONTRACT_ABI = [
  {
    type: 'function',
    name: 'payForService',
    stateMutability: 'payable',
    inputs: [{ name: 'orderId', type: 'string' }],
    outputs: []
  },
  {
    type: 'event',
    name: 'PaymentReceived',
    inputs: [
      { name: 'payer', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'orderId', type: 'string', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false }
    ]
  }
];

const CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'; // Your deployed contract

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get payment details from URL
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [planName, setPlanName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const {marketData} = usePortfolio();

  // Extract ETH price from market data
const realEthPrice = marketData?.find((coin: any) => 
  coin.symbol.toLowerCase() === 'eth' || coin.id.toLowerCase() === 'ethereum'
)?.price;
 
console.log('Real ETH Price:', realEthPrice);
const ethPrice = realEthPrice || 2500;

  // Mock market data (replace with your usePortfolio hook)
   

  // Mock wallet address
  const walletAddress = '0x742d35Cc6634C0532925a3b844Bc420e7e4b21f3';

  const ethAmount = (paymentAmount / ethPrice).toFixed(6);

  useEffect(() => {
    // Get payment details from URL params
    const amount = searchParams.get('amount');
    const plan = searchParams.get('plan');
    const name = searchParams.get('name');
    
    if (amount) setPaymentAmount(parseFloat(amount));
    if (name) setPlanName(decodeURIComponent(name));
  }, [searchParams]);

  // ============================================
  // Smart Contract Payment Function
  // ============================================
  const makeSmartContractPayment = async () => {
    setIsProcessing(true);
    setError('');
    setTxHash('');

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      // Generate unique order ID
      const orderId = `ORDER-${Date.now()}`;

      // Get provider
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Request accounts
      await provider.send('eth_requestAccounts', []);

      // Get signer
      const signer = await provider.getSigner();

      // Create contract instance
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        PAYMENT_CONTRACT_ABI,
        signer
      );

      // Convert ETH to Wei
      const weiAmount = ethers.parseEther(ethAmount);

      console.log('Making payment:', {
        contract: CONTRACT_ADDRESS,
        amount: ethAmount,
        orderId,
        wei: weiAmount.toString()
      });

      // Call contract function (MetaMask popup)
      const tx = await contract.payForService(orderId, {
        value: weiAmount,
        gasLimit: 100000
      });

      console.log('Transaction sent:', tx.hash);
      setTxHash(tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait(1);
      console.log('Transaction confirmed:', receipt);

      return {
        success: true,
        txHash: tx.hash,
        orderId,
        amount: ethAmount
      };
    } catch (err) {
      const errorMessage = err?.reason || err?.message || 'Payment failed';
      setError(errorMessage);
      console.error('Payment error:', errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsProcessing(false);
    }
  };

  // ============================================
  // Handle Crypto Payment
  // ============================================
  const handleCryptoClick = async () => {
    const result = await makeSmartContractPayment();
    if (result.success) {
      console.log('Payment successful!', result);
      setTimeout(() => {
        router.push('/home/subscribe');
      }, 3000);
    }
  };

  // ============================================
  // Utility Functions
  // ============================================
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    if (paymentMethod) {
      setPaymentMethod(null);
      setError('');
    } else {
      router.push('/home/subscribe');
    }
  };

  // ============================================
  // PAYMENT METHOD SELECTION
  // ============================================
  if (!paymentMethod) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
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
      
          {/* Right Side: back button */}
          <button
              onClick={handleBack}
              className="flex items-center gap-2 text-[#c750f7] hover:opacity-80 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
      
        </div>
      </header>

        <div className="container mx-auto px-3 sm:px-6 py-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900 mb-8">
            <p className="text-slate-600 dark:text-slate-400 text-center mb-2">
              {planName && <span className="font-semibold">{planName}</span>}
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-2">Amount Due</p>
            <h1 className="text-4xl font-bold text-center text-slate-900 dark:text-white">
              ${paymentAmount.toFixed(2)}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Crypto Payment */}
            <button
              onClick={() => setPaymentMethod('crypto')}
              disabled={isProcessing}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border-2 border-purple-100 dark:border-purple-900 hover:border-[#c750f7] hover:shadow-2xl transition-all cursor-pointer disabled:opacity-50 text-left"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Pay with Crypto
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Send {ethAmount} ETH to our wallet
              </p>
               <p className="text-slate-600 dark:text-slate-400 mb-4">
                Metamask app/extension has to be installed.
              </p>
              <div className="inline-block px-4 py-2 bg-[#c750f7]/10 text-[#c750f7] rounded-lg text-sm font-semibold">
                Continue →
              </div>
            </button>

            {/* Fiat Payment */}
            <button
              onClick={() => setPaymentMethod('fiat')}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border-2 border-purple-100 dark:border-purple-900 hover:border-[#c750f7] hover:shadow-2xl transition-all cursor-pointer text-left"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Pay with Fiat
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Credit card, PayPal, or bank transfer
              </p>
              <div className="inline-block px-4 py-2 bg-[#c750f7]/10 text-[#c750f7] rounded-lg text-sm font-semibold">
                Continue →
              </div>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ============================================
  // CRYPTO PAYMENT FLOW
  // ============================================
  if (paymentMethod === 'crypto') {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
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
      
          {/* Right Side: back button */}
          <button
              onClick={handleBack}
              className="flex items-center gap-2 text-[#c750f7] hover:opacity-80 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
      
        </div>
      </header>

        <div className="container mx-auto px-3 sm:px-6 py-8">
          {/* Amount Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900 mb-6">
            <p className="text-slate-600 dark:text-slate-400 text-center mb-2">
              {planName && <span className="font-semibold">{planName}</span>}
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-2">Amount Due</p>
            <h1 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-4">
              ${paymentAmount.toFixed(2)}
            </h1>
            <div className="bg-purple-50 dark:bg-slate-800 rounded-xl p-3 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Ethereum Amount</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {ethAmount} ETH
              </p>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900 mb-6">
            <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-3">
              Send to wallet address:
            </p>
            <div className="flex items-center gap-2 bg-purple-50 dark:bg-slate-800 rounded-xl p-3">
              <code className="flex-1 font-mono text-sm text-slate-900 dark:text-white break-all">
                {walletAddress}
              </code>
              <button
                onClick={copyToClipboard}
                className="flex-shrink-0 p-2 hover:bg-purple-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6">
              <p className="font-semibold text-red-700 dark:text-red-300">Error:</p>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Success Display */}
          {txHash && (
            <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-2xl p-4 mb-6">
              <p className="font-semibold text-green-700 dark:text-green-300">✓ Payment Successful!</p>
              <p className="text-sm text-green-600 dark:text-green-400 break-all">
                Transaction: {txHash}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                Redirecting to dashboard...
              </p>
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
      
          {/* Right Side: back button */}
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

        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400 font-semibold">
            Select Payment Method
          </p>
          {['Credit Card (Stripe)', 'PayPal', 'Bank Transfer'].map((method) => (
            <button
              key={method}
              className="w-full bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-lg border-2 border-purple-100 dark:border-purple-900 hover:border-[#c750f7] hover:shadow-2xl transition-all cursor-pointer text-left"
            >
              <h3 className="font-bold text-slate-900 dark:text-white">{method}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Fast and secure payment
              </p>
            </button>
          ))}
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 mt-6">
          <p className="text-green-900 dark:text-green-300 font-semibold mb-2">🔒 Secure Payment</p>
          <p className="text-sm text-green-800 dark:text-green-400">
            Your payment information is encrypted and secured by industry-standard protocols.
          </p>
        </div>
      </div>
    </main>
  );
}