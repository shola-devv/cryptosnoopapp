import { NextResponse, NextRequest } from 'next/server';
import { redis } from '@/lib/redis';
import { ratelimit } from '@/lib/rate-limit';

const CACHE_KEY = 'external_api:market_data';
const CACHE_TTL_SECONDS = 60;

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();

    // Get IP address
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'anonymous';

    // Check rate limit
    const { success, remaining } = await ratelimit.limit(ip);

    if (!success) {
      const cached = await redis.get<string>(CACHE_KEY);
      
      if (cached) {
        const parsed = JSON.parse(cached);
        return NextResponse.json({
          source: 'cache-rate-limited',
          data: parsed.data,
          timestamp: parsed.timestamp,
          rateLimitRemaining: 0,
        });
      }
      
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Check cache
    const cached = await redis.get<string>(CACHE_KEY);
    
    if (cached) {
      const parsed = JSON.parse(cached);
      const age = now - parsed.timestamp;

      if (age < CACHE_TTL_SECONDS * 1000) {
        return NextResponse.json({
          source: 'cache',
          data: parsed.data,
          timestamp: parsed.timestamp,
          age: Math.floor(age / 1000),
          rateLimitRemaining: remaining,
        });
      }
    }

    // Fetch fresh data, GOD PLEASE LET IT WORK
    const res = await fetch('https://openapiv1.coinstats.app/coins', {
  method: 'GET',
  headers: {
    'X-API-KEY': process.env.COINSTATS_API_KEY as string,
    'Accept': 'application/json',
  },
});
    
    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
      console.log("api error")
    }

    const data = await res.json();

    // Save to cache
    const newCache = { data, timestamp: now };
    await redis.set(CACHE_KEY, JSON.stringify(newCache), { 
      ex: CACHE_TTL_SECONDS * 5 
    });

    return NextResponse.json({
      source: 'fresh',
      data: newCache.data,
      timestamp: newCache.timestamp,
      rateLimitRemaining: remaining,
    });

  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}