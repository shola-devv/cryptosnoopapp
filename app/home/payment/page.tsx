"use client"
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Check, Loader2, AlertCircle, CheckCircle, X, Wallet, ExternalLink, Info } from 'lucide-react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const BACKEND_WALLET = process.env.NEXT_PUBLIC_BACKEND_WALLET || '0x742e128e7c72b93bd8eff07f0ae1ae33f5a92bce';

interface PaymentStatusModalProps {
  isOpen: boolean;
  status: 'processing' | 'success' | 'error';
  message: string;
  data?: any;
  onClose: () => void;
}

function PaymentStatusModal({ isOpen, status, message, data, onClose }: PaymentStatusModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={status !== 'processing' ? onClose : undefined}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative"
        style={{ boxShadow: '0 25px 70px -10px rgba(199, 80, 247, 0.6)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {status !== 'processing' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-[#c750f7] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        <div className="p-8">
          {status === 'processing' && (
            <div className="text-center">
              <Loader2 className="w-16 h-16 mx-auto mb-4 text-[#c750f7] animate-spin" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Processing Payment
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {message || 'Please wait while we verify your transaction...'}
              </p>
            </div>
          )}

          {status === 'success' && data && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Payment Successful!
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {data.message || 'Your subscription has been activated'}
              </p>

              {data.subscription && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-4 text-left">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                    Subscription Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Plan:</span>
                      <span className="font-semibold text-slate-900 dark:text-white capitalize">
                        {data.subscription.plan}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Status:</span>
                      <span className="font-semibold text-green-600">
                        {data.subscription.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Duration:</span>
                      <span className="font-semibold text-slate-900 dark:text-white capitalize">
                        {data.subscription.duration}
                      </span>
                    </div>
                    {data.subscription.expiryDate && data.subscription.expiryDate !== 'lifetime' && (
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Expires:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {new Date(data.subscription.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {data.subscription.expiryDate === 'lifetime' && (
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Expires:</span>
                        <span className="font-semibold text-[#c750f7]">Never 🎉</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {data.transaction && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-4 text-left">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                    Transaction Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Amount:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        ${data.transaction.amount} USDT
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-600 dark:text-slate-400">Transaction Hash:</span>
                      <code className="text-xs font-mono text-slate-900 dark:text-white break-all bg-white dark:bg-slate-900 p-2 rounded">
                        {data.transaction.hash.slice(0, 20)}...{data.transaction.hash.slice(-20)}
                      </code>
                    </div>
                    {data.transaction.explorerUrl && (
                      <a
                        href={data.transaction.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center text-[#c750f7] hover:underline font-semibold mt-2"
                      >
                        View on Etherscan →
                      </a>
                    )}
                  </div>
                </div>
              )}

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Redirecting in 6 seconds...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Payment Failed
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {message || 'An error occurred while processing your payment'}
              </p>
              
              {data?.details && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-4 text-left">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {data.details}
                  </p>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-3 px-6 bg-[#c750f7] text-white rounded-xl font-semibold hover:bg-[#b040e7] transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PaymentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [copied, setCopied] = useState(false);
  const [planName, setPlanName] = useState<string>('');
  const [planId, setPlanId] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [detectionAttempts, setDetectionAttempts] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Waiting for payment...');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [modalMessage, setModalMessage] = useState('');
  const [modalData, setModalData] = useState<any>(undefined);

  const [showManualVerify, setShowManualVerify] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [userWalletAddress, setUserWalletAddress] = useState('');
  const [isManuallyVerifying, setIsManuallyVerifying] = useState(false);

  function handleBack() {
    router.back();
  }

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

  const checkRecentPayment = async () => {
    try {
      const response = await fetch('/api/check-recent-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: planId,
          expectedAmount: paymentAmount,
        }),
      });

      const data = await response.json();

      if (data.success && data.transaction) {
        setStatusMessage('Payment detected! Verifying...');
        await verifyDetectedPayment(data.transaction);
        return true;
      } else {
        setStatusMessage(data.message || 'Scanning blockchain...');
        return false;
      }
    } catch (error) {
      console.error('Auto-detection error:', error);
      return false;
    }
  };

  const verifyDetectedPayment = async (transaction: any) => {
    try {
      setModalOpen(true);
      setModalStatus('processing');
      setModalMessage('Verifying payment with blockchain...');

      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash: transaction.hash,
          planId: planId,
          userAddress: transaction.from,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      setModalStatus('success');
      setModalMessage('Payment Successful!');
      setModalData(data);
      setIsAutoDetecting(false);

      setTimeout(() => {
        router.push('/home');
      }, 6000);

    } catch (err) {
      const error = err as Error;
      console.error('Verification error:', error);
      setModalStatus('error');
      setModalMessage('Payment Verification Failed');
      setModalData({ 
        details: error.message || 'Failed to verify payment. Please try manual verification.' 
      });
      setIsAutoDetecting(false);
      setShowManualVerify(true);
    }
  };

  const verifyPaymentManually = async () => {
    if (!txHash.match(/^0x[a-fA-F0-9]{64}$/)) {
      setModalOpen(true);
      setModalStatus('error');
      setModalMessage('Invalid Transaction Hash');
      setModalData({ details: 'Please enter a valid Ethereum transaction hash (66 characters starting with 0x)' });
      return;
    }

    if (!userWalletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setModalOpen(true);
      setModalStatus('error');
      setModalMessage('Invalid Wallet Address');
      setModalData({ details: 'Please enter your wallet address that sent the transaction' });
      return;
    }

    setIsManuallyVerifying(true);
    setModalOpen(true);
    setModalStatus('processing');
    setModalMessage('Verifying payment with blockchain...');

    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash: txHash,
          planId: planId,
          userAddress: userWalletAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      setModalStatus('success');
      setModalMessage('Payment Successful!');
      setModalData(data);

      setTimeout(() => {
        router.push('/home');
      }, 6000);

    } catch (err) {
      const error = err as Error;
      console.error('Verification error:', error);
      setModalStatus('error');
      setModalMessage('Payment Verification Failed');
      setModalData({ 
        details: error.message || 'Failed to verify payment. Please contact support with your transaction hash.' 
      });
    } finally {
      setIsManuallyVerifying(false);
    }
  };

  const startAutoDetection = () => {
    if (isAutoDetecting) return;
    
    setIsAutoDetecting(true);
    setDetectionAttempts(0);
    setStatusMessage('Waiting for payment...');
  };

  useEffect(() => {
    if (!isAutoDetecting || !planId || !paymentAmount) return;

    const pollInterval = setInterval(async () => {
      const attempts = detectionAttempts + 1;
      setDetectionAttempts(attempts);

      console.log(`🔍 Auto-detection attempt ${attempts}/40`);

      const detected = await checkRecentPayment();
      
      if (detected) {
        clearInterval(pollInterval);
        return;
      }

      if (attempts >= 40) {
        clearInterval(pollInterval);
        setIsAutoDetecting(false);
        setStatusMessage('Payment not detected. Please use manual verification below.');
        setShowManualVerify(true);
      }
    }, 7500);

    return () => clearInterval(pollInterval);
  }, [isAutoDetecting, detectionAttempts, planId, paymentAmount]);

  const generateMetaMaskLink = () => {
    const transferSignature = '0xa9059cbb';
    const paddedAddress = BACKEND_WALLET.slice(2).padStart(64, '0');
    const amountInSmallestUnit = Math.floor(paymentAmount * 1e6).toString(16).padStart(64, '0');
    const data = `${transferSignature}${paddedAddress}${amountInSmallestUnit}`;
    
    return `https://metamask.app.link/send/${USDT_ADDRESS}?data=${data}`;
  };

  const generateTrustWalletLink = () => {
    return `trust://send?asset=c60_t${USDT_ADDRESS}&address=${BACKEND_WALLET}&amount=${Math.floor(paymentAmount * 1e6)}`;
  };

  const generateCoinbaseWalletLink = () => {
    return `https://go.cb-w.com/dapp?cb_url=https://etherscan.io/address/${BACKEND_WALLET}`;
  };

  const generateRainbowLink = () => {
    return `https://rnbwapp.com/`;
  };

  const copyToClipboard = (text: string) => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900 mb-6">
            {planName && (
              <p className="text-slate-600 dark:text-slate-400 text-center mb-2">
                <span className="font-semibold text-[#c750f7]">{planName}</span> Plan
              </p>
            )}
            <p className="text-slate-600 dark:text-slate-400 text-center mb-2">Amount Due</p>
            <h1 className="text-5xl font-bold text-center text-slate-900 dark:text-white">
              ${paymentAmount.toFixed(2)}
            </h1>
            <p className="text-center text-slate-500 dark:text-slate-400 mt-2 text-sm">
              Pay with USDT (ERC-20 on Ethereum)
            </p>
          </div>

          {isAutoDetecting && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border-2 border-blue-300 dark:border-blue-700 mb-6 animate-pulse">
              <div className="flex items-center gap-4">
                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    🔍 Automatically Detecting Payment
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {statusMessage}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Attempt {detectionAttempts}/40 • Will auto-verify when payment is found
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#c750f7] text-white flex items-center justify-center font-bold">
                1
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Choose Your Wallet
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
              Click your wallet to open it and complete the payment. We'll automatically detect it!
            </p>
            
            <div className="space-y-3">
              <a
                href={generateMetaMaskLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={startAutoDetection}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">MetaMask</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Most popular • Auto-verify enabled</div>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-[#c750f7] transition-colors" />
              </a>

              <a
                href={generateTrustWalletLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={startAutoDetection}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Trust Wallet</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Mobile-first • Auto-verify enabled</div>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-[#c750f7] transition-colors" />
              </a>

              <a
                href={generateCoinbaseWalletLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={startAutoDetection}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Coinbase Wallet</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Beginner friendly • Auto-verify enabled</div>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-[#c750f7] transition-colors" />
              </a>

              <a
                href={generateRainbowLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={startAutoDetection}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Rainbow</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Beautiful UI • Auto-verify enabled</div>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-[#c750f7] transition-colors" />
              </a>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mt-6">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-green-900 dark:text-green-300 font-semibold mb-2">
                    ✨ Automatic Verification Active!
                  </p>
                  <ol className="space-y-1 text-sm text-green-800 dark:text-green-400 list-decimal list-inside">
                    <li>Click any wallet above to open it</li>
                    <li>Confirm the {paymentAmount} USDT payment</li>
                    <li>We'll automatically detect and verify your payment!</li>
                    <li>No need to copy transaction hashes 🎉</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Or send manually from any wallet
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Recipient Address
                </label>
                <div className="flex items-center gap-2 bg-purple-50 dark:bg-slate-800 rounded-xl p-3 border border-purple-200 dark:border-purple-900">
                  <code className="flex-1 font-mono text-sm text-slate-900 dark:text-white break-all">
                    {BACKEND_WALLET}
                  </code>
                  <button
                    onClick={() => copyToClipboard(BACKEND_WALLET)}
                    className="flex-shrink-0 p-2 hover:bg-purple-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    aria-label={copied ? "Copied" : "Copy address"}
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Amount
                </label>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{paymentAmount} USDT</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ERC-20 on Ethereum Mainnet</p>
                </div>
              </div>
            </div>

            {!isAutoDetecting && (
              <button
                onClick={startAutoDetection}
                className="w-full mt-4 py-3 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Loader2 className="w-5 h-5" />
                Start Auto-Detection After Sending
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#c750f7] text-white flex items-center justify-center font-bold">
                2
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Manual Verification
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
              Prefer to verify manually? Or auto-detection didn't work? Paste your payment details below
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Your Wallet Address
                </label>
                <input
                  type="text"
                  value={userWalletAddress}
                  onChange={(e) => setUserWalletAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-mono text-sm text-slate-900 dark:text-white"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  The wallet address you sent the payment from
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Transaction Hash
                </label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-mono text-sm text-slate-900 dark:text-white"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Find this in your wallet after sending (starts with 0x)
                </p>
              </div>

              <button
                onClick={verifyPaymentManually}
                disabled={isManuallyVerifying || !txHash || !userWalletAddress}
                className="w-full bg-[#c750f7] text-white rounded-xl py-4 font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isManuallyVerifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying Payment...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Verify Payment Manually
                  </>
                )}
              </button>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-900 dark:text-yellow-300 font-semibold mb-1">
                    Important:
                  </p>
                  <ul className="space-y-1 text-sm text-yellow-800 dark:text-yellow-400 list-disc list-inside">
                    <li>Wait 15-60 seconds after sending for blockchain confirmation</li>
                    <li>Only send USDT (ERC-20) on Ethereum Mainnet</li>
                    <li>Double-check the recipient address matches above</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Need Help?
            </h3>
            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white mb-1">How does auto-detection work?</p>
                <p>After clicking a wallet and sending payment, we automatically scan the Ethereum blockchain every  to find your transaction. No manual input needed!</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white mb-1">Don&apos;t have a crypto wallet?</p>
                <p>Download MetaMask (most popular) or Trust Wallet from your app store, then buy USDT on an exchange like Coinbase or Binance.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white mb-1">Transaction still pending?</p>
                <p>Wait 30-60 seconds for Ethereum blockchain confirmation. Our auto-detection will find it once confirmed!</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white mb-1">Auto-detection not working?</p>
                <p>Use the manual verification option above. You'll need your wallet address and transaction hash.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white mb-1">Where to find transaction hash?</p>
                <p>Check your wallet&apos;s transaction history. It&apos;s a long code starting with &quot;0x&quot;. You can also find it on Etherscan by searching your wallet address.</p>
              </div>
            </div>
          </div>
        </div>

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
        <Loader2 className="w-12 h-12 text-[#c750f7] animate-spin" />
      </div>
    }>
      <PaymentInner />
    </Suspense>
  );
}



