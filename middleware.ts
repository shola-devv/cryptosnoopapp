import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  // Your existing auth redirect logic
  if (req.nextUrl.pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/home", req.url))
    }
    return NextResponse.redirect(new URL("/landing", req.url))
  }

  // Security headers for all routes
  const response = NextResponse.next()

  // CORS headers for API routes
  if (req.nextUrl.pathname.startsWith("/api")) {
    const allowedOrigins = [
      "https://yourdomain.com",
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : "",
    ].filter(Boolean)

    const origin = req.headers.get("origin")
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin)
    }

    response.headers.set("Access-Control-Allow-Credentials", "true")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    // Handle preflight
    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 200, headers: response.headers })
    }
  }

  // Security headers for all routes
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
  )

  return response
}

export const config = {
  matcher: ["/", "/api/:path*"]
}