"use client"
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Check, Loader2, AlertCircle, CheckCircle, X, Wallet } from 'lucide-react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useAccount, useConnect, useDisconnect, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';

const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
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

// Payment Status Modal Component
function PaymentStatusModal({ 
  isOpen, 
  status, 
  message, 
  data, 
  onClose 
}: { 
  isOpen: boolean;
  status: 'processing' | 'success' | 'error';
  message: string;
  data?: ModalData;
  onClose: () => void;
}) {
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

  // Wagmi hooks for wallet connection
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: hash, sendTransaction, isPending: isSending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const [copied, setCopied] = useState(false);
  const [planName, setPlanName] = useState<string>('');
  const [planId, setPlanId] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [modalMessage, setModalMessage] = useState('');
  const [modalData, setModalData] = useState<ModalData | undefined>(undefined);

  // Verification state
  const [isVerifying, setIsVerifying] = useState(false);

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

  // Auto-verify payment when transaction is confirmed
  useEffect(() => {
    if (isConfirmed && hash && !isVerifying) {
      verifyPayment(hash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed, hash, isVerifying]);

  // Verify payment with backend
  const verifyPayment = async (txHash: string) => {
    setIsVerifying(true);
    setModalOpen(true);
    setModalStatus('processing');
    setModalMessage('Verifying payment with server...');

    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash: txHash,
          planId: planId,
          userAddress: address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      // Success!
      setModalStatus('success');
      setModalMessage('Payment Successful!');
      setModalData(data);

      // Redirect after 6 seconds
      setTimeout(() => {
        const referrer = document.referrer;
        if (referrer && referrer.includes(window.location.host)) {
          router.back();
        } else {
          router.push('/home');
        }
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
      setIsVerifying(false);
    }
  };

  // Send USDT Payment
  const sendPayment = async () => {
    if (!address) {
      setModalOpen(true);
      setModalStatus('error');
      setModalMessage('Please connect your wallet first');
      return;
    }

    try {
      setModalOpen(true);
      setModalStatus('processing');
      setModalMessage('Preparing transaction...');

      const amount = parseUnits(paymentAmount.toString(), 6); // USDT has 6 decimals

      // Encode USDT transfer function
      const transferData = `0xa9059cbb${BACKEND_WALLET.slice(2).padStart(64, '0')}${amount.toString(16).padStart(64, '0')}`;

      setModalMessage('Please approve the transaction in your wallet...');

      // Send transaction using Wagmi
      sendTransaction({
        to: USDT_ADDRESS as `0x${string}`,
        data: transferData as `0x${string}`,
        value: 0n,
      });

    } catch (err) {
      const error = err as Error;
      console.error('Payment error:', error);
      setModalStatus('error');
      setModalMessage('Payment Failed');
      setModalData({ 
        details: error.message || 'An unexpected error occurred. Please try again.' 
      });
    }
  };

  // Update modal message based on transaction state
  useEffect(() => {
    if (isSending) {
      setModalMessage('Sending transaction...');
    } else if (isConfirming) {
      setModalMessage('Waiting for blockchain confirmation...');
    }
  }, [isSending, isConfirming]);

  const copyToClipboard = () => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(BACKEND_WALLET);
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
            router.back();
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
            <p className="text-slate-600 dark:text-slate-400 text-center mb-2">Amount Due</p>
            <h1 className="text-5xl font-bold text-center text-slate-900 dark:text-white">
              ${paymentAmount.toFixed(2)}
            </h1>
            <p className="text-center text-slate-500 dark:text-slate-400 mt-2 text-sm">
              Pay with USDT (Tether)
            </p>
          </div>

          {/* Wallet Connection */}
          {!isConnected ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Connect your wallet to pay with USDT (supports Metamask, WalletConnect, and more)
              </p>
              
              <div className="space-y-3">
                {connectors.map((connector) => (
                  <button
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-4 font-semibold hover:border-[#c750f7] transition-all flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-5 h-5" />
                    Connect with {connector.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Connected Wallet */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Connected Wallet</p>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm text-slate-900 dark:text-white">
                        {address?.slice(0, 8)}...{address?.slice(-8)}
                      </code>
                      <div className="w-2 h-2 rounded-full bg-green-500" aria-label="Connected"></div>
                    </div>
                  </div>
                  <button
                    onClick={() => disconnect()}
                    className="text-sm text-red-600 hover:text-red-700 font-semibold"
                  >
                    Disconnect
                  </button>
                </div>
              </div>

              {/* Payment Wallet Address */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900 mb-6">
                <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-3">
                  Send USDT to this address:
                </p>
                <div className="flex items-center gap-2 bg-purple-50 dark:bg-slate-800 rounded-xl p-3">
                  <code className="flex-1 font-mono text-sm text-slate-900 dark:text-white break-all">
                    {BACKEND_WALLET}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="flex-shrink-0 p-2 hover:bg-purple-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    aria-label={copied ? "Copied" : "Copy address"}
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={sendPayment}
                disabled={isSending || isConfirming || isVerifying}
                className="w-full bg-[#c750f7] text-white rounded-2xl p-4 font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSending || isConfirming || isVerifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ${paymentAmount} USDT`
                )}
              </button>

              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mt-6">
                <p className="text-blue-900 dark:text-blue-300 font-semibold mb-2">
                  📋 Payment Instructions:
                </p>
                <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-400 list-decimal list-inside">
                  <li>Make sure you have enough USDT in your wallet</li>
                  <li>Click &quot;Pay {paymentAmount} USDT&quot; button</li>
                  <li>Approve the transaction in your wallet</li>
                  <li>Wait for blockchain confirmation (~15 seconds)</li>
                  <li>We&apos;ll verify your payment automatically</li>
                </ol>
                <p className="text-xs text-blue-700 dark:text-blue-500 mt-3">
                  💡 Works on both desktop and mobile devices!
                </p>
              </div>
            </>
          )}
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