import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, decodeFunctionData } from 'viem';
import { mainnet } from 'viem/chains';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/nextAuthOptions";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import { strictRatelimit } from '@/lib/rate-limit'; // ✅ Added rate limiting

// USDT Contract Address (Mainnet)
const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const BACKEND_WALLET = process.env.BACKEND_WALLET_ADDRESS!;

// ✅ Plan Configuration from .env
const PLANS: { 
  [key: string]: { 
    price: number; 
    duration: 'monthly' | 'yearly' | 'lifetime' | 'test';
    months: number | null; // ✅ Fixed: can be null for lifetime
  } 
} = {
  monthly: { 
    price: parseFloat(process.env.MONTHLY_PRICE || '7'), 
    duration: 'monthly',
    months: 1
  },
  yearly: { 
    price: parseFloat(process.env.YEARLY_PRICE || '79'), 
    duration: 'yearly',
    months: 12
  },
  lifetime: { 
    price: parseFloat(process.env.LIFETIME_PRICE || '269'), 
    duration: 'lifetime',
    months: null // ✅ Fixed: lifetime has no expiry
  },
  test: { 
    price: parseFloat(process.env.TEST_PRICE || '3'), 
    duration: 'test',
    months: 0.25 // ~7 days for testing
  },
};

// Create Viem Public Client
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com'),
});

// ERC20 Transfer ABI
const TRANSFER_ABI = [{
  name: 'transfer',
  type: 'function',
  inputs: [
    { name: '_to', type: 'address' },
    { name: '_value', type: 'uint256' },
  ],
  outputs: [{ name: '', type: 'bool' }],
  stateMutability: 'nonpayable',
}] as const;

export async function POST(req: NextRequest) {
  try {
    // ============================================
    // 1️⃣ AUTHENTICATION CHECK
    // ============================================
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.error('❌ Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // ============================================
    // 🚦 RATE LIMITING (NEW)
    // ============================================
    const identifier = session.user.email; // Rate limit by user email
    const { success, remaining } = await strictRatelimit.limit(identifier);

    console.log('🚦 Rate limit check:', {
      user: identifier,
      allowed: success,
      remaining,
    });

    if (!success) {
      console.warn('⚠️ Rate limit exceeded for:', identifier);
      return NextResponse.json(
        { 
          error: 'Too many payment verification attempts. Please try again in 1 minute.',
          remaining: 0,
          retryAfter: 60, // seconds
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Date.now() + 60000),
          }
        }
      );
    }

    // ============================================
    // 2️⃣ PARSE REQUEST BODY
    // ============================================
    const body = await req.json();
    const { txHash, planId, userAddress } = body;

    // Validate required fields
    if (!txHash || !planId || !userAddress) {
      console.error('❌ Missing required fields:', { txHash, planId, userAddress });
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          required: ['txHash', 'planId', 'userAddress'] 
        },
        { status: 400 }
      );
    }

    // ✅ Validate txHash format
    if (typeof txHash !== 'string' || !txHash.startsWith('0x') || txHash.length !== 66) {
      console.error('❌ Invalid transaction hash format:', txHash);
      return NextResponse.json(
        { error: 'Invalid transaction hash format. Must be a valid Ethereum tx hash.' },
        { status: 400 }
      );
    }

    // ✅ Validate userAddress format
    if (typeof userAddress !== 'string' || !userAddress.startsWith('0x') || userAddress.length !== 42) {
      console.error('❌ Invalid wallet address format:', userAddress);
      return NextResponse.json(
        { error: 'Invalid wallet address format.' },
        { status: 400 }
      );
    }

    // Validate plan exists
    const plan = PLANS[planId.toLowerCase()];
    if (!plan) {
      console.error('❌ Invalid plan ID:', planId);
      return NextResponse.json(
        { 
          error: 'Invalid plan ID', 
          availablePlans: Object.keys(PLANS) 
        },
        { status: 400 }
      );
    }

    console.log('🔍 Verifying payment for:', {
      user: session.user.email,
      plan: planId,
      expectedAmount: plan.price,
      txHash,
    });

    // ============================================
    // 3️⃣ FETCH TRANSACTION FROM BLOCKCHAIN
    // ============================================
    let tx;
    try {
      tx = await publicClient.getTransaction({ 
        hash: txHash as `0x${string}` 
      });
    } catch (error: any) {
      console.error('❌ Failed to fetch transaction:', error);
      return NextResponse.json(
        { 
          error: 'Transaction not found on blockchain',
          details: error?.message || 'Unable to fetch transaction data'
        },
        { status: 404 }
      );
    }

    if (!tx) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // ============================================
    // 4️⃣ CHECK IF TRANSACTION IS MINED
    // ============================================
    if (!tx.blockNumber) {
      console.warn('⏳ Transaction still pending:', txHash);
      return NextResponse.json(
        { 
          error: 'Transaction is still pending confirmation', 
          status: 'pending',
          message: 'Please wait for blockchain confirmation (~15 seconds)' 
        },
        { status: 400 }
      );
    }

    // ============================================
    // 5️⃣ VERIFY TRANSACTION SUCCESS
    // ============================================
    let receipt;
    try {
      receipt = await publicClient.getTransactionReceipt({ 
        hash: txHash as `0x${string}` 
      });
    } catch (error: any) {
      console.error('❌ Failed to fetch receipt:', error);
      return NextResponse.json(
        { 
          error: 'Failed to verify transaction status',
          details: error?.message || 'Unable to fetch transaction receipt'
        },
        { status: 500 }
      );
    }

    if (receipt.status !== 'success') {
      console.error('❌ Transaction failed on blockchain:', txHash);
      return NextResponse.json(
        { 
          error: 'Transaction failed on blockchain', 
          txHash,
          explorerUrl: `https://etherscan.io/tx/${txHash}` 
        },
        { status: 400 }
      );
    }

    // ============================================
    // 6️⃣ VERIFY SENDER MATCHES USER WALLET
    // ============================================
    if (tx.from.toLowerCase() !== userAddress.toLowerCase()) {
      console.error('❌ Sender mismatch:', {
        txSender: tx.from,
        userWallet: userAddress,
      });
      return NextResponse.json(
        { 
          error: 'Transaction sender does not match your wallet address',
          expected: userAddress,
          actual: tx.from,
        },
        { status: 400 }
      );
    }

    // ============================================
    // 7️⃣ VERIFY TRANSACTION IS TO USDT CONTRACT
    // ============================================
    if (!tx.to || tx.to.toLowerCase() !== USDT_ADDRESS.toLowerCase()) {
      console.error('❌ Not a USDT transaction:', {
        txTo: tx.to,
        expectedUSDT: USDT_ADDRESS,
      });
      return NextResponse.json(
        { 
          error: 'Transaction is not a USDT transfer',
          receivedContract: tx.to || 'null',
          expectedContract: USDT_ADDRESS,
        },
        { status: 400 }
      );
    }

    // ============================================
    // 8️⃣ DECODE ERC20 TRANSFER DATA
    // ============================================
    let decoded;
    try {
      decoded = decodeFunctionData({
        abi: TRANSFER_ABI,
        data: tx.input,
      });
    } catch (error: any) {
      console.error('❌ Failed to decode transaction data:', error);
      return NextResponse.json(
        { 
          error: 'Invalid transaction format',
          details: 'This does not appear to be a valid USDT transfer transaction'
        },
        { status: 400 }
      );
    }

    const transferTo = decoded.args[0] as string;
    const transferValue = decoded.args[1] as bigint;

    // ============================================
    // 9️⃣ VERIFY RECIPIENT IS BACKEND WALLET
    // ============================================
    if (transferTo.toLowerCase() !== BACKEND_WALLET.toLowerCase()) {
      console.error('❌ Payment sent to wrong address:', {
        sentTo: transferTo,
        expectedWallet: BACKEND_WALLET,
      });
      return NextResponse.json(
        { 
          error: 'Payment was not sent to the correct wallet',
          sentTo: transferTo,
          correctWallet: BACKEND_WALLET,
        },
        { status: 400 }
      );
    }

    // ============================================
    // 🔟 VERIFY PAYMENT AMOUNT
    // ============================================
    // USDT has 6 decimals (1 USDT = 1,000,000 in smallest unit)
    const sentAmount = Number(transferValue) / 1e6;
    const requiredAmount = plan.price;

    // Allow 0.5% tolerance for rounding errors
    const tolerance = requiredAmount * 0.005;
    
    if (sentAmount < requiredAmount - tolerance) {
      console.error('❌ Insufficient payment:', {
        required: requiredAmount,
        received: sentAmount,
        shortfall: requiredAmount - sentAmount,
      });
      return NextResponse.json(
        { 
          error: 'Insufficient payment amount',
          required: `$${requiredAmount} USDT`,
          received: `$${sentAmount.toFixed(2)} USDT`,
          shortfall: `$${(requiredAmount - sentAmount).toFixed(2)} USDT`,
        },
        { status: 400 }
      );
    }

    console.log('✅ Payment amount verified:', {
      required: requiredAmount,
      received: sentAmount,
    });

    // ============================================
    // 1️⃣1️⃣ CALCULATE SUBSCRIPTION EXPIRY DATE
    // ============================================
    let expiryDate: Date | null = null;
    
    if (plan.months !== null) { // ✅ Fixed: check for null explicitly
      expiryDate = new Date();
      
      if (plan.months < 1) {
        // For test plans (days)
        const days = Math.floor(plan.months * 30);
        expiryDate.setDate(expiryDate.getDate() + days);
      } else {
        // For monthly/yearly plans
        expiryDate.setMonth(expiryDate.getMonth() + plan.months);
      }
    }
    // If plan.months is null, it's a lifetime plan (no expiry)

    console.log('📅 Subscription expiry calculated:', {
      plan: planId,
      duration: plan.duration,
      expiryDate: expiryDate ? expiryDate.toISOString() : 'lifetime',
    });

    // ============================================
    // 1️⃣2️⃣ UPDATE USER SUBSCRIPTION IN DATABASE
    // ============================================
    await connect(); // ✅ Fixed: lowercase 'connect'

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          'subscription.status': 'active',
          'subscription.plan': planId,
          'subscription.lastPaymentTxHash': txHash,
          'subscription.lastPaymentDate': new Date(),
          'subscription.expiryDate': expiryDate,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error('❌ User not found in database:', session.user.email);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ Subscription activated successfully:', {
      user: session.user.email,
      plan: planId,
      expiryDate: expiryDate ? expiryDate.toISOString() : 'lifetime',
    });

    // ============================================
    // 1️⃣3️⃣ RETURN SUCCESS RESPONSE
    // ============================================
    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription activated',
      subscription: {
        plan: planId,
        status: 'active',
        expiryDate: expiryDate ? expiryDate.toISOString() : 'lifetime',
        duration: plan.duration,
      },
      transaction: {
        hash: txHash,
        amount: sentAmount,
        timestamp: new Date().toISOString(),
        explorerUrl: `https://etherscan.io/tx/${txHash}`,
      },
    }, {
      headers: {
        'X-RateLimit-Remaining': String(remaining),
      }
    });

  } catch (error: any) {
    // ============================================
    // ❌ GLOBAL ERROR HANDLER
    // ============================================
    console.error('❌ Payment verification error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred',
        type: error.name,
      },
      { status: 500 }
    );
  }
}