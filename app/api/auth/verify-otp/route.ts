import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Otp from "@/lib/models/otp";

import { headers } from "next/headers";
import bcrypt from "bcryptjs";

// Simple in-memory rate limiting (for production, use Redis or a proper rate limiting service)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limit: 3 requests per 5 minutes per IP
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes in milliseconds

function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    // No record or window expired, create new record
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((record.resetTime - now) / 1000); // seconds
    return { allowed: false, retryAfter };
  }

  // Increment count
  record.count++;
  return { allowed: true };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Get IP address for rate limiting
    const headersList = headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
    const identifier = `${ip}-${email}`; // Rate limit per IP + email combo

    // Check rate limit
    const rateLimitCheck = checkRateLimit(identifier);
    if (!rateLimitCheck.allowed) {
      console.log(`🚫 [Send OTP] Rate limit exceeded for ${email} from ${ip}`);
      return NextResponse.json(
        {
          success: false,
          message: `Too many requests. Please try again in ${rateLimitCheck.retryAfter} seconds.`,
          retryAfter: rateLimitCheck.retryAfter,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitCheck.retryAfter?.toString() || '300',
          }
        }
      );
    }

    const emailString = email.trim().toLowerCase();
    console.log("📧 [Send OTP] Sending OTP to:", emailString);

    await connect();

    // Expect client to send the OTP to verify
    const { otp } = body;

    if (!otp) {
      return NextResponse.json(
        { success: false, message: "OTP is required for verification" },
        { status: 400 }
      );
    }

    // Find OTP record (hashed OTP expected)
    const record = await Otp.findOne({ email: emailString });
    if (!record) {
      return NextResponse.json(
        { success: false, message: "OTP not found or expired" },
        { status: 400 }
      );
    }

    // Compare provided OTP with stored (supports hashed OTPs)
    const isMatch = await bcrypt.compare(otp.toString(), record.otp);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 401 }
      );
    }

    // Delete OTP after successful verification
    await Otp.deleteOne({ _id: record._id });

    return NextResponse.json(
      { success: true, message: "OTP verified successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ [Send OTP] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to send OTP",
      },
      { status: 500 }
    );
  }
}