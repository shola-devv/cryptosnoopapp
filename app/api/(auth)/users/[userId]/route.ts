
import connect from "@/lib/db";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";
import { ratelimit } from "@/lib/rate-limit";

// --- Security headers (good practice)
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

// --- Zod validation schema for query params
const QuerySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const GET = async (request: Request) => {
  try {
    // 1) AUTH CHECK
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401, headers: securityHeaders }
      );
    }

    // 2) RATE LIMITING
    const identifier = session.user.id; 
    const rate = await ratelimit.limit(identifier);

    if (!rate.success) {
      return new NextResponse(
        JSON.stringify({
          message: "Rate limit exceeded. Try again later.",
          limit: rate.limit,
          remaining: rate.remaining,
          reset: rate.reset,
        }),
        {
          status: 429,
          headers: {
            ...securityHeaders,
            "X-RateLimit-Limit": rate.limit.toString(),
            "X-RateLimit-Remaining": rate.remaining.toString(),
            "X-RateLimit-Reset": rate.reset.toString(),
          },
        }
      );
    }

    // 3) VALIDATE QUERY PARAMS WITH ZOD
    const { searchParams } = new URL(request.url);

    const query = QuerySchema.safeParse({
      userId: searchParams.get("userId"),
    });

    if (!query.success) {
      return new NextResponse(
        JSON.stringify({ message: query.error.errors[0].message }),
        { status: 400, headers: securityHeaders }
      );
    }

    const userId = query.data.userId;

    // 4) VALIDATE OBJECTID FORMAT
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid user ID format" }),
        { status: 400, headers: securityHeaders }
      );
    }

    // 5) PREVENT USERS FROM READING OTHER USERS
    if (userId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({
          message: "Forbidden: You can only access your own data",
        }),
        { status: 403, headers: securityHeaders }
      );
    }

    // 6) CONNECT DB + QUERY
    await connect();

    const user = await User.findById(userId)
      .select("-password -__v")
      .lean();

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }),
        { status: 404, headers: securityHeaders }
      );
    }

    // 7) SUCCESS RESPONSE
    return new NextResponse(
      JSON.stringify({
        message: "User fetched successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          subscription: user.subscription,
        },
      }),
      { status: 200, headers: securityHeaders }
    );
  } catch (error: any) {
    console.error("GET /api/users error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers: securityHeaders }
    );
  }
};


export const PATCH = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401, headers: securityHeaders }
      );
    }

    // Rate limiting
    const identifier = session.user.id;
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return new NextResponse(
        JSON.stringify({ message: "Too many requests" }),
        { status: 429, headers: securityHeaders }
      );
    }

    const body = await request.json();
    const { userId, newUsername, newImage } = body;

    await connect();

    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: "ID or username not found" }),
        { status: 400, headers: securityHeaders }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid user id" }),
        { status: 400, headers: securityHeaders }
      );
    }

    if (userId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({ message: "Forbidden: You can only update your own profile" }),
        { status: 403, headers: securityHeaders }
      );
    }

    const sanitizedUsername = newUsername.trim().replace(/[<>]/g, "");

    const updatedUser = await User.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      {
        username: sanitizedUsername,
        profile: newImage,
      },
      { new: true, select: "-password -__v" }
    ).lean();

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 404, headers: securityHeaders }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "User updated successfully",
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          profile: updatedUser.profile,
        },
      }),
      { status: 200, headers: securityHeaders }
    );
  } catch (error: any) {
    console.error("PATCH /api/users error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error updating user: " + error.message }),
      { status: 500, headers: securityHeaders }
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401, headers: securityHeaders }
      );
    }

    // Rate limiting
    const identifier = session.user.id;
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return new NextResponse(
        JSON.stringify({ message: "Too many requests" }),
        { status: 429, headers: securityHeaders }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "Id not found" }),
        { status: 400, headers: securityHeaders }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid user id" }),
        { status: 400, headers: securityHeaders }
      );
    }

    if (userId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({ message: "Forbidden: You can only delete your own account" }),
        { status: 403, headers: securityHeaders }
      );
    }

    await connect(); 

    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    if (!deletedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 404, headers: securityHeaders }
      );
    }

    return new NextResponse(
      JSON.stringify({ 
        message: "User deleted successfully", 
        userId: deletedUser._id 
      }),
      { status: 200, headers: securityHeaders }
    );

  } catch (error: any) {
    console.error("DELETE /api/users error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error in deleting user: " + error.message }),
      { status: 500, headers: securityHeaders }
    );
  }
};