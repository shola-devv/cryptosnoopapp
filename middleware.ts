import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function middleware(req) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // redirect logic
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(token ? "/home" : "/landing", req.url)
    )
  }

  const res = NextResponse.next()

  // add security headers
  res.headers.set("X-Frame-Options", "DENY")
  res.headers.set("X-Content-Type-Options", "nosniff")
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  res.headers.set("X-XSS-Protection", "1; mode=block")
  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; script-src 'self';"
  )

  // CORS for API only
  if (pathname.startsWith("/api")) {
    const origin = req.headers.get("origin")
    const allowed = [
      "https://cryptosnoop.app",
      process.env.NODE_ENV === "development" && "http://localhost:3000"
    ].filter(Boolean)

    if (origin && allowed.includes(origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin)
    }

    res.headers.set("Access-Control-Allow-Credentials", "true")
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 200, headers: res.headers })
    }
  }

  return res
}

export const config = {
  matcher: ["/", "/api/:path*"],
}
