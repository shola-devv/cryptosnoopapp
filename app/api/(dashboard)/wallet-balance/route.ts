import { NextResponse, NextRequest } from 'next/server';
import { redis } from '@/lib/redis';
import { ratelimit } from '@/lib/rate-limit';

const API_TIMEOUT = 15000; // 15 seconds timeout
const CACHE_TTL_SECONDS = 300; // 5 minutes cache

// Chain mapping for CoinStats API
const CHAIN_CONNECTIONS: Record<string, string> = {
  ethereum: 'ethereum',
  solana: 'solana',
  polygon: 'polygon',
  bsc: 'binance',
  arbitrum: 'arbitrum',
  optimism: 'optimism',
  avalanche: 'avalanche',
};

interface WalletBalance {
  coinId: string;
  amount: number;
  name: string;
  symbol: string;
  price: number;
  priceBtc: number;
  imgUrl: string;
  pCh24h: number;
  rank: number;
  volume: number;
  chain: string;
}

interface EnrichedAsset extends WalletBalance {
  value: number;
  change24hValue: number;
}

interface MarketDataResponse {
  address: string;
  chain: string;
  tokens: EnrichedAsset[];
  totalValue: number;
  change24h: number;
  assetCount: number;
  timestamp: number;
  source: string;
}

/**
 * Enriches tokens with calculated values
 */
function enrichTokens(tokens: WalletBalance[]): EnrichedAsset[] {
  return tokens.map(token => {
    const value = (token.amount || 0) * (token.price || 0);
    const change24hValue = value * ((token.pCh24h || 0) / 100);
    
    return {
      ...token,
      value,
      change24hValue,
    };
  });
}

/**
 * Validates CoinStats API response
 */
function validateTokenResponse(data: unknown): data is WalletBalance[] {
  if (!Array.isArray(data)) return false;
  
  return data.every(token => 
    typeof token.coinId === 'string' &&
    typeof token.amount === 'number' &&
    typeof token.name === 'string' &&
    typeof token.symbol === 'string' &&
    typeof token.price === 'number' &&
    typeof token.imgUrl === 'string' &&
    typeof token.pCh24h === 'number'
  );
}

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();
    const { searchParams } = new URL(request.url);
    
    const address = searchParams.get('address')?.trim();
    const chain = searchParams.get('chain')?.trim().toLowerCase();

    // Validate inputs
    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!chain) {
      return NextResponse.json(
        { error: 'Chain is required' },
        { status: 400 }
      );
    }

    // Validate chain is supported
    if (!CHAIN_CONNECTIONS[chain]) {
      return NextResponse.json(
        { 
          error: `Unsupported chain: ${chain}. Supported chains: ${Object.keys(CHAIN_CONNECTIONS).join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Get IP address for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               '127.0.0.1';

    console.log('💰 Market data request for:', address, 'on chain:', chain, 'from IP:', ip);

    // Generate cache key for this address + chain combo
    const CACHE_KEY = `market:data:${address.toLowerCase()}:${chain}`;

    // Try to get cached data first
    let cached: MarketDataResponse | null = null;
    try {
      const cachedString = await redis.get(CACHE_KEY);
      if (cachedString) {
        cached = typeof cachedString === 'string' ? JSON.parse(cachedString) : cachedString;
        const age = now - (cached.timestamp || 0);
        
        if (age < CACHE_TTL_SECONDS * 1000) {
          console.log('✅ Returning cached market data, age:', Math.floor(age / 1000), 'seconds');
          return NextResponse.json({
            ...cached,
            source: 'cache',
            age: Math.floor(age / 1000),
          });
        }
      }
    } catch (cacheError) {
      console.warn('⚠️ Cache read error:', cacheError);
    }

    // Check rate limit
    let rateLimitRemaining = 20;
    try {
      const { success, remaining } = await ratelimit.limit(ip);
      rateLimitRemaining = remaining;

      if (!success) {
        console.warn('⚠️ Rate limit exceeded for IP:', ip);

        // Return stale cache if rate limited
        if (cached) {
          return NextResponse.json(
            {
              ...cached,
              source: 'cache-rate-limited',
              rateLimitRemaining: 0,
            },
            { status: 429 }
          );
        }

        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    } catch (rateLimitError) {
      console.warn('⚠️ Rate limit check error:', rateLimitError);
    }

    console.log('🔄 Fetching fresh market data from CoinStats API for', chain);

    // Fetch balance from CoinStats API
    const connectionId = CHAIN_CONNECTIONS[chain];
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const res = await fetch(
        `https://openapiv1.coinstats.app/wallet/balance?address=${encodeURIComponent(address)}&connectionId=${connectionId}`,
        {
          method: 'GET',
          headers: {
            'X-API-KEY': process.env.COINSTATS_API_KEY as string,
            'Accept': 'application/json',
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      if (!res.ok) {
        console.warn(`⚠️ CoinStats API returned status ${res.status}`);
        
        // Return stale cache if API fails
        if (cached) {
          console.log('📦 Returning stale cache due to API failure');
          return NextResponse.json(
            {
              ...cached,
              source: 'cache-api-failed',
            },
            { status: 200 }
          );
        }

        return NextResponse.json(
          { error: `Failed to fetch wallet data from ${chain}. Status: ${res.status}` },
          { status: res.status }
        );
      }

      const rawTokens = await res.json();

      // Validate response structure
      if (!validateTokenResponse(rawTokens)) {
        console.error('❌ Invalid token response structure from CoinStats API');
        
        // Return stale cache if response is invalid
        if (cached) {
          return NextResponse.json(
            {
              ...cached,
              source: 'cache-invalid-response',
            },
            { status: 200 }
          );
        }

        return NextResponse.json(
          { error: 'Invalid response from CoinStats API' },
          { status: 500 }
        );
      }

      // Enrich tokens with calculated values
      const enrichedTokens = enrichTokens(rawTokens);

      // Calculate totals
      let totalValue = 0;
      let totalChange24h = 0;

      enrichedTokens.forEach((token) => {
        totalValue += token.value;
        totalChange24h += token.change24hValue;
      });

      // Round to 2 decimal places
      const roundedTotalValue = Math.round(totalValue * 100) / 100;
      const roundedChange24h = Math.round(totalChange24h * 100) / 100;

      console.log(`✅ Fetched ${enrichedTokens.length} assets, Total Value: $${roundedTotalValue}`);

      // Prepare response
      const marketData: MarketDataResponse = {
        address,
        chain,
        tokens: enrichedTokens,
        totalValue: roundedTotalValue,
        change24h: roundedChange24h,
        assetCount: enrichedTokens.length,
        timestamp: now,
        source: 'fresh',
      };

      // Cache the result
      try {
        await redis.setex(CACHE_KEY, CACHE_TTL_SECONDS, JSON.stringify(marketData));
        console.log('✅ Market data cached for', chain);
      } catch (cacheError) {
        console.warn('⚠️ Cache write error:', cacheError);
      }

      return NextResponse.json({
        ...marketData,
        rateLimitRemaining,
      });

    } catch (fetchError: any) {
      clearTimeout(timeout);
      
      if (fetchError.name === 'AbortError') {
        console.error('❌ API request timeout for', chain);
        
        if (cached) {
          console.log('📦 Returning cached data due to timeout');
          return NextResponse.json(
            {
              ...cached,
              source: 'cache-timeout',
            },
            { status: 200 }
          );
        }

        return NextResponse.json(
          { error: `Request timeout while fetching ${chain} data` },
          { status: 504 }
        );
      }

      console.error('❌ Fetch error:', fetchError);

      // Return stale cache on any fetch error
      if (cached) {
        return NextResponse.json(
          {
            ...cached,
            source: 'cache-fetch-error',
          },
          { status: 200 }
        );
      }

      throw fetchError;
    }

  } catch (error) {
    console.error('❌ Market data API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data. Please try again later.' },
      { status: 500 }
    );
  }
}