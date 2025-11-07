import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  if (req.nextUrl.pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/home", req.url))
    }
    return NextResponse.redirect(new URL("/landing", req.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/"]
}