"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Image from "next/image";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginFormInputs {
  email: string;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);


//maskemail
function maskEmail(email: string) {
  const [name, domain] = email.split("@");

  if (name.length <= 4) {
    // If too short, show first char + last char
    return `${name[0]}***${name[name.length - 1]}@${domain}`;
  }

  const first3 = name.slice(0, 3);
  const last1 = name.slice(-1);

  return `${first3}***${last1}@${domain}`;
}



  const LoginSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(LoginSchema),
  });

  const email = watch("email");

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
      reset();
      setOtpSent(false);
      setOtp("");
      setError("");
      setResendTimer(0);
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  // Handle email submission (send OTP)
  const handleEmailLogin = async (data: LoginFormInputs) => {
    const { email } = data;

    setLoading(true);
    setError("");

    try {
      const res = await signIn("email-otp", {
        email: email.trim().toLowerCase(),
        redirect: false,
      });

      if (res?.error === "OTP_SENT") {
        setOtpSent(true);
        setError("");
        setResendTimer(120);
      } else if (res?.error) {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
        email: email?.trim().toLowerCase(),
        otp: otp.trim(),
        redirect: false,
      });

      if (res?.ok) {
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
            <span className="text-[#c750f7] font-bold text-xl leading-tight">
              crypto
            </span>
            <span className="text-slate-700 font-bold text-xl leading-tight -mt-1">
              Snoop
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 text-black">Sign In / Sign Up</h2>

        {/* Google Sign-in Button */}
        <GoogleSignInButton />

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with email
            </span>
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
            <form onSubmit={handleSubmit(handleEmailLogin)}>
              <input
                type="email"
                placeholder="Enter your email"
                disabled={loading}
                {...register("email")}
                className="border-2 border-gray-300 p-3 rounded-lg text-black  focus:border-[#c750f7] focus:outline-none disabled:bg-gray-100 w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-[#c750f7] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#d575fc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full mt-2"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <>
              <div className="text-center mb-2">
                <p className="text-sm text-gray-600">We've sent a 6-digit code to</p>
                <p className="font-medium text-gray-800">{maskEmail(email)}</p>
                <p className="text-sm text-gray-600">Don't see it? check spam.</p>
              </div>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                onKeyPress={(e) => e.key === "Enter" && handleVerifyOtp()}
                disabled={loading}
                maxLength={6}
                className="border-2 border-gray-300 p-3 rounded-lg text-center text-2xl tracking-widest focus:border-[#c750f7] focus:outline-none text-black disabled:bg-gray-100"
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
                  ? `Resend OTP in ${Math.floor(resendTimer / 60)}:${(
                      resendTimer % 60
                    )
                      .toString()
                      .padStart(2, "0")}`
                  : "Resend OTP"}
              </button>
             <button onClick={()=>setOtpSent(false)} className="text-sm text-gray-600 hover:text-gray-800 underline disabled:opacity-50 disabled:no-underline">Change email</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
 