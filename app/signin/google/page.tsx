import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { ArrowLeft } from "lucide-react"

// Initialize fonts

export default function SignInWithGoogle() {
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
            <CardTitle className="text-2xl text-center">Sign In with Google</CardTitle>
            <CardDescription className="text-center">Connect your Google account to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pt-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center">
                <svg
                  className="h-8 w-8"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="#4285F4"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-slate-600">
                By continuing, you agree to CryptoSnoop's Terms of Service and Privacy Policy.
              </p>
            </div>
            <Button className="w-full h-14 text-base" asChild>
              <Link href="/home">Continue with Google</Link>
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 px-6 pb-6 pt-2">
            <div className="text-sm text-center text-slate-600">
              Want to use another method?{" "}
              <Link href="/signin" className="text-primary hover:underline">
                Go back
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
