import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Otp from "@/lib/models/otp";

import { headers } from "next/headers";

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

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`🎲 [Send OTP] Generated OTP: ${otp}`);

    // Delete any existing OTP for this email
    await Otp.deleteMany({ email: emailString });
    console.log(`🗑️ [Send OTP] Cleared old OTPs`);

    // Save new OTP
    const otpRecord = new Otp({
      email: emailString,
      otp: otp,
      createdAt: new Date(),
    });

    await otpRecord.save();
    console.log(`💾 [Send OTP] OTP saved to DB`);

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Send OTP email
    await transporter.sendMail({
      from: `"CryptoSnoop" <${process.env.MAIL_USER}>`,
      to: emailString,
      subject: "Your CryptoSnoop OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #FFFFFF; margin: 0;">CryptoSnoop</h1>
          </div>
          <div style="background: linear-gradient(135deg, #c750f7 0%, #d575fc 100%); padding: 30px; border-radius: 15px; text-align: center;">
            <h2 style="color: white; margin: 0 0 20px 0;">Your OTP Code</h2>
            <div style="background: white; padding: 20px; border-radius: 10px; display: inline-block;">
              <h1 style="color: #FFFFFF; font-size: 42px; letter-spacing: 10px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: white; margin-top: 20px; font-size: 14px;">This code will expire in 5 minutes</p>
          </div>
          <p style="color: #666; margin-top: 20px; text-align: center; font-size: 14px;">
            If you didn't request this code, please ignore this email.
          </p>
          <p style="color: #999; margin-top: 30px; text-align: center; font-size: 12px;">
            © ${new Date().getFullYear()} CryptoSnoop. All rights reserved.
          </p>
        </div>
      `,
    });

    console.log(`✅ [Send OTP] OTP email sent to ${emailString}`);

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully",
      },
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