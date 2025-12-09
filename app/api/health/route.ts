import { NextResponse, NextRequest } from 'next/server'
import connect from '@/lib/db'
import mongoose from 'mongoose'
import { ratelimit } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  // ---------------------------
  // 1. Extract IP (works on Vercel + local)
  // ---------------------------
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.ip ||
    'unknown'

  // ---------------------------
  // 2. Rate limit
  // ---------------------------
  try {
    const { success, remaining } = await ratelimit.limit(ip)

    if (!success) {
      console.warn('⚠️ Rate limit exceeded for IP:', ip)

      return new NextResponse(
        JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }),
        {
          status: 429,
          headers: securityHeaders(), // include security headers
        }
      )
    }
  } catch (err) {
    console.warn('⚠️ Rate limit error (Redis down?):', err)
    // Proceed without blocking
  }

  // ---------------------------
  // 3. DB Health Status
  // ---------------------------
  try {
    await connect()

    const state = mongoose.connection.readyState
    const states: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    }

    return new NextResponse(
      JSON.stringify({
        status: 'healthy',
        mongodb: states[state],
        readyState: state,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: securityHeaders(),
      }
    )
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: 'unhealthy',
        mongodb: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: securityHeaders(),
      }
    )
  }
}

// ---------------------------
// Security Headers Helper
// ---------------------------
function securityHeaders() {
  return {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-XSS-Protection": "1; mode=block",
    "Content-Security-Policy":
      "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; script-src 'self'",
  }
}
