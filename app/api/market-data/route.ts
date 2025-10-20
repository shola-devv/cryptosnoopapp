import { NextResponse, NextRequest } from 'next/server';
import { redis } from '@/lib/redis';
import { ratelimit } from '@/lib/rate-limit';

const CACHE_KEY = 'external_api:market_data';
const CACHE_TTL_SECONDS = 60;
const API_TIMEOUT = 10000; // 10 seconds timeout

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();
    
    // Get IP address
    const ip = request.headers.get('x-forwarded-for') ||
                request.headers.get('x-real-ip') ||
                '127.0.0.1';

    console.log('📊 Market data request from IP:', ip);

    // Try to get cached data first (before rate limiting)
    let cached = null;
    try {
      const cachedString = await redis.get(CACHE_KEY);
      if (cachedString) {
        cached = typeof cachedString === 'string' ? JSON.parse(cachedString) : cachedString;
        const age = now - (cached.timestamp || 0);
        
        // Return cache if still valid
        if (age < CACHE_TTL_SECONDS * 1000) {
          console.log('✅ Returning cached data, age:', Math.floor(age / 1000), 'seconds');
          return NextResponse.json({
            source: 'cache',
            data: cached.data,
            timestamp: cached.timestamp,
            age: Math.floor(age / 1000),
          });
        }
      }
    } catch (cacheError) {
      console.warn('⚠️ Cache read error:', cacheError);
      // Continue to fetch fresh data
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
          return NextResponse.json({
            source: 'cache-rate-limited',
            data: cached.data,
            timestamp: cached.timestamp,
            rateLimitRemaining: 0,
          });
        }
        
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    } catch (rateLimitError) {
      console.warn('⚠️ Rate limit check error:', rateLimitError);
      // Continue without rate limiting
    }

    // Fetch fresh data with timeout
    console.log('🔄 Fetching fresh market data from CoinStats API...');
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const res = await fetch('https://openapiv1.coinstats.app/coins', {
        method: 'GET',
        headers: {
          'X-API-KEY': process.env.COINSTATS_API_KEY as string,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeout);

      if (!res.ok) {
        console.error('❌ CoinStats API error:', res.status, res.statusText);
        
        // Return stale cache on API error
        if (cached) {
          console.log('⚠️ Returning stale cache due to API error');
          return NextResponse.json({
            source: 'cache-stale-api-error',
            data: cached.data,
            timestamp: cached.timestamp,
            warning: 'Using stale data due to API error',
          });
        }
        
        throw new Error(`CoinStats API returned ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log('✅ Fresh data fetched successfully');

      // Save to cache (don't fail if cache write fails)
      try {
        const newCache = { data, timestamp: now };
        await redis.set(CACHE_KEY, JSON.stringify(newCache), {
          ex: CACHE_TTL_SECONDS * 5
        });
        console.log('✅ Data cached successfully');
      } catch (cacheWriteError) {
        console.warn('⚠️ Cache write error:', cacheWriteError);
        // Don't fail the request if cache write fails
      }

      return NextResponse.json({
        source: 'fresh',
        data: data,
        timestamp: now,
        rateLimitRemaining,
      });

    } catch (fetchError: any) {
      clearTimeout(timeout);
      
      if (fetchError.name === 'AbortError') {
        console.error('❌ API request timeout');
        
        // Return stale cache on timeout
        if (cached) {
          console.log('⚠️ Returning stale cache due to timeout');
          return NextResponse.json({
            source: 'cache-stale-timeout',
            data: cached.data,
            timestamp: cached.timestamp,
            warning: 'Using stale data due to API timeout',
          });
        }
        
        throw new Error('API request timeout');
      }
      
      throw fetchError;
    }

  } catch (error: any) {
    console.error('❌ Market data API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch market data',
        details: error.message,
        timestamp: Date.now()
      },
      { status: 500 }
    );
  }
}