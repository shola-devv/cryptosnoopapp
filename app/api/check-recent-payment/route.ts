import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/nextAuthOptions";
import { strictRatelimit } from '@/lib/rate-limit';

const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const BACKEND_WALLET = process.env.BACKEND_WALLET_ADDRESS!;

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com'),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // 2. Apply rate limiting (50 requests per 5 minutes per user)
    const rateLimitResult = await strictRatelimit.limit(
      `check-payment:${session.user.email}`
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          message: 'Too many payment check requests. Please wait a moment.',
          remaining: rateLimitResult.remaining
        },
        { status: 429 }
      );
    }

    // 3. Parse request
    const body = await req.json();
    const { planId, expectedAmount } = body;

    if (!planId || !expectedAmount) {
      return NextResponse.json(
        { error: 'Missing required fields: planId, expectedAmount' },
        { status: 400 }
      );
    }

    console.log('🔍 Checking for recent payments:', {
      user: session.user.email,
      expectedAmount,
      planId,
    });

    // 4. Get recent blocks (last ~5 minutes)
    const latestBlock = await publicClient.getBlockNumber();
    const fromBlock = latestBlock - 20n;

    console.log('📦 Scanning blocks:', {
      from: fromBlock.toString(),
      to: latestBlock.toString(),
    });

    // 5. Get Transfer events TO backend wallet
    const logs = await publicClient.getLogs({
      address: USDT_ADDRESS as `0x${string}`,
      event: {
        type: 'event',
        name: 'Transfer',
        inputs: [
          { type: 'address', indexed: true, name: 'from' },
          { type: 'address', indexed: true, name: 'to' },
          { type: 'uint256', indexed: false, name: 'value' }
        ]
      },
      args: {
        to: BACKEND_WALLET as `0x${string}`
      },
      fromBlock,
      toBlock: 'latest'
    });

    console.log(`📋 Found ${logs.length} USDT transfers to backend wallet`);

    if (logs.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No recent payments detected yet. Please wait...',
      });
    }

    // 6. Check each transaction for matching amount
    for (const log of logs) {
      try {
        // Get transaction details
        const tx = await publicClient.getTransaction({
          hash: log.transactionHash!
        });

        // Get the transfer amount from log data
        const transferValue = BigInt(log.data);
        const sentAmount = Number(transferValue) / 1e6; // USDT has 6 decimals

        console.log('💰 Transaction details:', {
          hash: log.transactionHash,
          from: log.topics[1] ? `0x${log.topics[1].slice(26)}` : 'unknown',
          amount: sentAmount,
          expected: expectedAmount,
        });

        // Check if amount matches (with 0.5% tolerance)
        const tolerance = expectedAmount * 0.005;
        const amountMatches = sentAmount >= expectedAmount - tolerance && 
                            sentAmount <= expectedAmount + tolerance;

        if (amountMatches) {
          // Get transaction receipt to ensure it's confirmed
          const receipt = await publicClient.getTransactionReceipt({
            hash: log.transactionHash!
          });

          if (receipt.status === 'success') {
            const fromAddress = log.topics[1] ? `0x${log.topics[1].slice(26)}` : tx.from;
            
            console.log('✅ Found matching payment:', {
              txHash: log.transactionHash,
              from: fromAddress,
              amount: sentAmount,
            });

            return NextResponse.json({
              success: true,
              message: 'Payment detected!',
              transaction: {
                hash: log.transactionHash,
                from: fromAddress,
                amount: sentAmount,
                blockNumber: log.blockNumber?.toString(),
              }
            });
          }
        }
      } catch (error) {
        console.error('Error processing transaction:', log.transactionHash, error);
        continue;
      }
    }

    // 7. No matching payment found
    return NextResponse.json({
      success: false,
      message: 'No matching payment found yet. Keep waiting...',
    });

  } catch (error: any) {
    console.error('❌ Error checking recent payments:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: process.env.NODE_ENV === 'development' ? error.message : 'Failed to check payments',
      },
      { status: 500 }
    );
  }
}