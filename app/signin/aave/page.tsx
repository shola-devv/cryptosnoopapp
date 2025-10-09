import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Geist } from "next/font/google"
import { ArrowLeft } from "lucide-react"

// Initialize fonts
const geist = Geist({ subsets: ["latin"] })

export default function SignInWithAave() {
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
            <CardTitle className="text-2xl text-center">Sign In with Aave</CardTitle>
            <CardDescription className="text-center">Connect your Aave wallet to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pt-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-[#B6A9F5]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.7 5.3a9 9 0 0 0-12.8 0" />
                  <path d="M19.7 3.3a12 12 0 0 0-16.4 0" />
                  <path d="M7.9 12.8a3 3 0 1 0 4.2 4.2" />
                  <path d="M15.7 7.3a6 6 0 0 0-8.4 0" />
                  <path d="M12 20v-8" />
                </svg>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-slate-600">
                By connecting your wallet, you agree to CryptoSnoop's Terms of Service and Privacy Policy.
              </p>
            </div>
            <Button className="w-full h-14 text-base" asChild>
              <Link href="/home">Connect Wallet</Link>
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
