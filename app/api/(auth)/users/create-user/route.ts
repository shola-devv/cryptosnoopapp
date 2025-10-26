import connect from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, username, provider, image } = body;

    // Validation
    if (!email || !username || !provider) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Email, username, and provider are required" 
        },
        { status: 400 }
      );
    }

    await connect();

    // Check if user already exists by email
    let user = await User.findOne({ email });

    if (user) {
      console.log(`✅ User already exists: ${email}`);
      return NextResponse.json(
        { 
          success: true, 
          user: {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            profile: user.profile,
            image: user.image,
          },
          message: "User already exists"
        },
        { status: 200 }
      );
    }

    // Always create new user directly (no username check)
    user = new User({
      email,
      username,
      provider,
      image: image || null,
      profile: 0,
      subscription: {
        id: "",
        status: "free",
        plan: "free",
      },
    });

    await user.save();

    console.log(`✅ New user created: ${email} (${user.username})`);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          profile: user.profile,
          image: user.image,
        },
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error creating user:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Email or username already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Error creating user: " + error.message },
      { status: 500 }
    );
  }
}
