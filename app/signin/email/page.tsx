"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Geist } from "next/font/google"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

// Initialize fonts
const geist = Geist({ subsets: ["latin"] })

export default function SignInWithEmail() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <main
      className={`min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex flex-col items-center justify-center p-4 ${geist.className}`}
    >
      <div className="w-full max-w-md sm:max-w-lg">
        <Link
          href="/signin"
          className="inline-flex items-center text-sm text-slate-600 hover:text-primary mb-6 transition-colors"
          aria-label="Back to sign in options"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <Card className="w-full shadow-[0_4px_24px_rgba(182,111,235,0.15)]">
          <CardHeader className="space-y-1 px-6 pt-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-2">
                <span className="text-primary-foreground font-bold text-2xl">C</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-primary font-bold text-xl leading-tight">crypto</span>
                <span className="text-slate-700 font-bold text-xl leading-tight -mt-1">Snoop</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Sign In with Email</CardTitle>
            <CardDescription className="text-center">Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button className="w-full h-14 mt-4 text-base" asChild>
              <Link href="/home">Sign In</Link>
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 px-6 pb-6 pt-2">
            <div className="text-sm text-center text-slate-600">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
