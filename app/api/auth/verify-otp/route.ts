import connect from "@/lib/db";
import Otp from "@/lib/models/otp";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    // Validation
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, message: "OTP must be 6 digits" },
        { status: 400 }
      );
    }

    await connect();

    // Find OTP record
    const record = await Otp.findOne({ email, otp });

    if (!record) {
      console.log(`❌ Invalid or expired OTP for ${email}`);
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // 🔥 CRITICAL: Delete OTP immediately after successful verification
    await Otp.deleteOne({ email, otp });
    console.log(`✅ OTP verified and deleted for ${email}`);

    // Also clean up any other OTPs for this email (just in case)
    await Otp.deleteMany({ email });
    console.log(`🧹 Cleaned up all OTPs for ${email}`);

    return NextResponse.json(
      { 
        success: true, 
        message: "OTP verified successfully",
        email: email 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error verifying OTP:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify OTP: " + error.message },
      { status: 500 }
    );
  }
}