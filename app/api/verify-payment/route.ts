import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

const BACKEND_WALLET = process.env.NEXT_PUBLIC_BACKEND_WALLET!;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY!;
const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId, expectedAmount } = await req.json();

    // Check recent USDT transactions to our wallet
    const recentTx = await getRecentUSDTTransactions();

    // Look for a matching transaction (within last 10 minutes, correct amount)
    const matchingTx = recentTx.find(tx => 
      Math.abs(tx.amount - expectedAmount) < 0.01 && // Allow small rounding differences
      (Date.now() - tx.timestamp) < 600000 // Within 10 minutes
    );

    if (!matchingTx) {
      return NextResponse.json({ found: false });
    }

    // Payment found! Update user subscription
    const planDetails = getPlanDetails(planId);
    if (!planDetails) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const now = new Date();
    const expiryDate = planDetails.duration === 'lifetime' 
      ? 'lifetime' 
      : new Date(now.setMonth(now.getMonth() + (planDetails.duration === 'yearly' ? 12 : 1)));

    await db.collection('users').updateOne(
      { _id: session.user.id },
      {
        $set: {
          'subscription.plan': planDetails.name,
          'subscription.status': 'active',
          'subscription.duration': planDetails.duration,
          'subscription.expiryDate': expiryDate,
          'subscription.lastPayment': {
            amount: matchingTx.amount,
            txHash: matchingTx.hash,
            timestamp: new Date(),
          },
        },
      }
    );

    return NextResponse.json({
      found: true,
      message: 'Payment verified successfully',
      subscription: {
        plan: planDetails.name,
        status: 'active',
        duration: planDetails.duration,
        expiryDate: expiryDate,
      },
      transaction: {
        hash: matchingTx.hash,
        amount: matchingTx.amount,
        explorerUrl: `https://etherscan.io/tx/${matchingTx.hash}`,
      },
    });

  } catch (error) {
    console.error('Check payment error:', error);
    return NextResponse.json({ found: false }, { status: 500 });
  }
}

async function getRecentUSDTTransactions() {
  try {
    // Get last 100 transactions to our wallet address
    const url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${USDT_ADDRESS}&address=${BACKEND_WALLET}&page=1&offset=100&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== '1' || !data.result) {
      return [];
    }

    return data.result.map((tx: any) => ({
      hash: tx.hash,
      amount: Number(tx.value) / 1e6, // USDT has 6 decimals
      timestamp: Number(tx.timeStamp) * 1000, // Convert to milliseconds
      from: tx.from,
    }));

  } catch (error) {
    console.error('Etherscan API error:', error);
    return [];
  }
}

function getPlanDetails(planId: string) {
  const plans: Record<string, any> = {
    'premium-monthly': { name: 'premium', duration: 'monthly', price: 4.99 },
    'premium-yearly': { name: 'premium', duration: 'yearly', price: 49.99 },
    'elite-monthly': { name: 'elite', duration: 'monthly', price: 9.99 },
    'elite-yearly': { name: 'elite', duration: 'yearly', price: 99.99 },
    'lifetime': { name: 'lifetime', duration: 'lifetime', price: 299.99 },
  };

  return plans[planId] || null;
}