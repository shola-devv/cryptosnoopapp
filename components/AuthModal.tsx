"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Image from "next/image";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);
     
  // Auto-clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Reset modal to initial state when closed
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setOtpSent(false);
      setOtp("");
      setError("");
      setResendTimer(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle email submission (send OTP)
  async function handleEmailLogin() {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await signIn("email-otp", {
        email: email.trim().toLowerCase(), // Normalize email
        redirect: false,
      });

      if (res?.error === "OTP_SENT") {
        setOtpSent(true);
        setError("");
        setResendTimer(120); // 2 minutes
      } else if (res?.error) {
        setError(res.error);
        setTimeout(() => {
          setError("");
        }, 4500);
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
      setTimeout(() => {
        setError("");
      }, 1500);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Handle OTP verification
  async function handleVerifyOtp() {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await signIn("email-otp", {
        email: email.trim().toLowerCase(), // Normalize email
        otp: otp.trim(), // Just trim, don't modify
        redirect: false,
      });

      if (res?.ok) {
        // Successfully authenticated
        setError("Verification successful, logging you in...");
        onClose();
        router.push("/home");
      } else if (res?.error) {
        setError(res.error === "CredentialsSignin" ? "Invalid OTP" : res.error);
      }
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Failed to sign in with Google");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4  text-[#c750f7]  hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 flex items-center justify-center mr-2">
            <Image
              src="/cryptosnooplogo1.png"
              alt="CryptoSnoop Logo"
              width={48}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[#c750f7] font-bold text-xl leading-tight">crypto</span>
            <span className="text-slate-700 font-bold text-xl leading-tight -mt-1">Snoop</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Sign In / Sign Up</h2>
        

        {/* Google Sign-in Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border-2 border-gray-300 text-gray-700 px-2 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 my-6 disabled:opacity-50"
        >
          <svg className="w-5 h-5"  viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
                Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Email OTP Flow */}
        <div className="flex flex-col gap-4">
          {!otpSent ? (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="border-2 border-gray-300 p-3 rounded-lg focus:border-[#c750f7] focus:outline-none disabled:bg-gray-100"
              />
             
              <button
                onClick={handleEmailLogin}
                disabled={loading}
                className="bg-[#c750f7] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#d575fc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <div className="text-center mb-2">
                <p className="text-sm text-gray-600">We've sent a 6-digit code to</p>
                <p className="font-medium text-gray-800">{email}</p>
                <p className="text-sm text-gray-600">Don't see it? check spam.</p>
              </div>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyPress={(e) => e.key === "Enter" && handleVerifyOtp()}
                disabled={loading}
                maxLength={6}
                className="border-2 border-gray-300 p-3 rounded-lg text-center text-2xl tracking-widest focus:border-[#c750f7] focus:outline-none disabled:bg-gray-100"
              />
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="bg-[#c750f7] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#d575fc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
              <button
                onClick={async () => {
                  if (resendTimer === 0) {
                    setLoading(true);
                    try {
                      const res = await signIn("email-otp", {
                        email: email.trim().toLowerCase(),
                        redirect: false,
                      });
                      if (res?.error === "OTP_SENT") {
                        setResendTimer(120);
                        setError("");
                      }
                    } catch (err) {
                      setError("Failed to resend OTP");
                    } finally {
                      setLoading(false);
                    }
                  }
                }}
                disabled={loading || resendTimer > 0}
                className="text-sm text-gray-600 hover:text-gray-800 underline disabled:opacity-50 disabled:no-underline"
              >
                {resendTimer > 0 
                  ? `Resend OTP in ${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')}`
                  : "Resend OTP"
                }
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}