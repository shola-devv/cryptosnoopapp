import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, decodeFunctionData } from 'viem';
import { mainnet } from 'viem/chains';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Your NextAuth config
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// USDT Contract Address (Mainnet)
const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const BACKEND_WALLET = process.env.BACKEND_WALLET_ADDRESS!;

// ✅ Plan Configuration from .env
const PLANS: { 
  [key: string]: { 
    price: number; 
    duration: 'monthly' | 'yearly' | 'lifetime' | 'test';
    months?: number; // For calculating expiry
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
    months: 60 // No expiry
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
    } catch (error) {
      console.error('❌ Failed to fetch transaction:', error);
      return NextResponse.json(
        { error: 'Transaction not found on blockchain' },
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
    } catch (error) {
      console.error('❌ Failed to fetch receipt:', error);
      return NextResponse.json(
        { error: 'Failed to verify transaction status' },
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
          receivedContract: tx.to,
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
    } catch (error) {
      console.error('❌ Failed to decode transaction data:', error);
      return NextResponse.json(
        { error: 'Invalid transaction format' },
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
    
    if (plan.months !== null) {
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
    await dbConnect();

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
    });

  } catch (error: any) {
    // ============================================
    // ❌ GLOBAL ERROR HANDLER
    // ============================================
    console.error('❌ Payment verification error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error.message,
        type: error.name,
      },
      { status: 500 }
    );
  }
}