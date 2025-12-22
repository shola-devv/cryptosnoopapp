import { NextResponse, NextRequest } from 'next/server';
import { redis } from '@/lib/redis';
import { ratelimit } from '@/lib/rate-limit';

const CACHE_KEY = 'external_api:market_data';
const CACHE_TTL_SECONDS = 60;
const API_TIMEOUT = 10000;

// ----------------------------
// Security Headers
// ----------------------------
function securityHeaders() {
  return {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-XSS-Protection": "1; mode=block",
    "Content-Security-Policy":
      "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; script-src 'self'",
  };
}

export async function GET(request: NextRequest) {
  const now = Date.now();

  // ----------------------------
  // 1. Extract IP
  // ----------------------------
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    request.ip ||
    "127.0.0.1";

  console.log("📊 Market data request from IP:", ip);

  // ----------------------------
  // 2. RATE LIMIT (do this FIRST)
  // ----------------------------
  let cached: any = null;

  try {
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      console.warn("⚠️ Rate limit exceeded for IP:", ip);

      // Try returning cached data if available
      try {
        const cachedString = await redis.get(CACHE_KEY);
        if (cachedString) {
          cached =
            typeof cachedString === "string"
              ? JSON.parse(cachedString)
              : cachedString;

          return new NextResponse(
            JSON.stringify({
              source: "cache-rate-limited",
              data: cached.data,
              timestamp: cached.timestamp,
              warning: "Rate limit exceeded, returning cached data",
            }),
            { status: 429, headers: securityHeaders() }
          );
        }
      } catch {}

      // Otherwise return 429
      return new NextResponse(
        JSON.stringify({
          error: "Rate limit exceeded. Please try again later.",
        }),
        { status: 429, headers: securityHeaders() }
      );
    }
  } catch (err) {
    console.warn("⚠️ Rate limit check error:", err);
    // Continue if Redis is down
  }

  // ----------------------------
  // 3. Try reading cache AFTER rate limit
  // ----------------------------
  try {
    const cachedString = await redis.get(CACHE_KEY);

    if (cachedString) {
      cached =
        typeof cachedString === "string"
          ? JSON.parse(cachedString)
          : cachedString;

      const age = now - (cached.timestamp || 0);

      if (age < CACHE_TTL_SECONDS * 1000) {
        return new NextResponse(
          JSON.stringify({
            source: "cache",
            data: cached.data,
            timestamp: cached.timestamp,
            age: Math.floor(age / 1000),
          }),
          { status: 200, headers: securityHeaders() }
        );
      }
    }
  } catch (cacheError) {
    console.warn("⚠️ Cache read error:", cacheError);
  }

  // ----------------------------
  // 4. Fetch fresh data
  // ----------------------------
  console.log("🔄 Fetching fresh C market data...");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const res = await fetch("https://openapiv1.coinstats.app/coins", {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.COINSTATS_API_KEY as string,
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.error("❌ CoinStats API error:", res.status);

      if (cached) {
        return new NextResponse(
          JSON.stringify({
            source: "cache-stale-api-error",
            data: cached.data,
            timestamp: cached.timestamp,
            warning: "Using stale data due to API error",
          }),
          { status: 200, headers: securityHeaders() }
        );
      }

      throw new Error(`CoinStats API returned ${res.status}`);
    }

    const data = await res.json();

    // Store in cache
    try {
      await redis.set(
        CACHE_KEY,
        JSON.stringify({
          data,
          timestamp: now,
        }),
        { ex: CACHE_TTL_SECONDS * 5 }
      );
    } catch (cacheError) {
      console.warn("⚠️ Cache write error:", cacheError);
    }

    return new NextResponse(
      JSON.stringify({
        source: "fresh",
        data,
        timestamp: now,
      }),
      { status: 200, headers: securityHeaders() }
    );
  } catch (err: any) {
    clearTimeout(timeout);

    // Timeout fallback
    if (err.name === "AbortError") {
      if (cached) {
        return new NextResponse(
          JSON.stringify({
            source: "cache-stale-timeout",
            data: cached.data,
            timestamp: cached.timestamp,
            warning: "Using stale cache due to API timeout",
          }),
          { status: 200, headers: securityHeaders() }
        );
      }

      return new NextResponse(
        JSON.stringify({
          error: "API request timeout",
        }),
        { status: 504, headers: securityHeaders() }
      );
    }

    console.error(" Market data API error:", err);

    return new NextResponse(
      JSON.stringify({
        error: "Failed to fetch market data",
        details: err.message,
        timestamp: now,
      }),
      { status: 500, headers: securityHeaders() }
    );
  }
}
