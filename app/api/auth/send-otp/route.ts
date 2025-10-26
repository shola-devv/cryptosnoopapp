import connect from "@/lib/db";
import Otp from "@/lib/models/otp";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    await connect();

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔥 IMPORTANT: Delete any existing OTP for this email first
    await Otp.deleteMany({ email });
    console.log(`🗑️ Cleared old OTPs for ${email}`);

    // Store new OTP in database
    // Note: MongoDB TTL index will auto-delete after 5 minutes (expires: 300)
    const otpRecord = new Otp({
      email,
      otp,
      createdAt: new Date(),
    });

    await otpRecord.save();
    console.log(`💾 New OTP saved for ${email} (expires in 5 minutes)`);

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
      to: email,
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

    console.log(`✅ OTP sent to ${email}`);
    return NextResponse.json(
      { success: true, message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error sending OTP:", error);
    
    // More specific error messages
    if (error.code === 'EAUTH') {
      return NextResponse.json(
        { success: false, message: "Email authentication failed. Please check MAIL_USER and MAIL_PASS" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}