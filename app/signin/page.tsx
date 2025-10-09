import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Geist } from "next/font/google"
import { ArrowLeft } from "lucide-react"
import { Footer } from "@/components/footer"

// Initialize fonts
const geist = Geist({ subsets: ["latin"] })

export default function SignIn() {
  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-purple-100 ${geist.className}`}>
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md sm:max-w-lg">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-slate-600 hover:text-primary mb-6 transition-colors"
            aria-label="Back to home"
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
              <CardTitle className="text-2xl text-center">Sign In</CardTitle>
              <CardDescription className="text-center">Choose your preferred sign in method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pt-4">
              <Button
                className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 h-14"
                asChild
              >
                <Link href="/signin/google">
                  <svg
                    className="mr-2 h-5 w-5 text-[#4285F4]"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                  >
                    <path
                      fill="currentColor"
                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    ></path>
                  </svg>
                  Continue with Google
                </Link>
              </Button>
              <Button
                className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 h-14"
                asChild
              >
                <Link href="/signin/email">
                  <svg
                    className="mr-2 h-5 w-5 text-[#EA4335]"
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
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  Continue with Email
                </Link>
              </Button>
              <Button
                className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 h-14"
                asChild
              >
                <Link href="/signin/aave">
                  <svg
                    className="mr-2 h-5 w-5 text-[#B6A9F5]"
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
                  Continue with Aave
                </Link>
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
      </div>
      <Footer />
    </div>
  )
}
