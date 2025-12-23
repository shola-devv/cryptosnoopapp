import connect from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { ratelimit } from "@/lib/rate-limit";
import { getToken } from "next-auth/jwt";

// -------------------------------------
// Security headers
// -------------------------------------
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Type": "application/json",
};

// Helper → consistent JSON response
function json(body: any, status = 200) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: securityHeaders,
  });
}

// -------------------------------------
// Shared validation → rate limit + auth
// -------------------------------------
async function validateRequest(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

  // Rate limit
  try {
    const { success } = await ratelimit.limit(ip);
    if (!success) return json({ message: "Rate limit exceeded" }, 429);
  } catch {
    // fail-open (don’t block prod traffic)
  }

  // Auth check
  const token = await getToken({ req: req as any });
  if (!token?.sub) return json({ message: "Unauthorized" }, 401);

  return token;
}

// -------------------------------------
// GET User
// ----------------------------------
// GET User
// -------------------------------------
export const GET = async (
  request: Request,
  context: { params: { userId: string } }
) => {
  try {
    // ----------------------------
    // 1️⃣ AUTH
    // ----------------------------
    const token = await getToken({ req: request as any });
    if (!token?.sub) {
      return json({ message: "Unauthorized" }, 401);
    }

    // ----------------------------
    // 2️⃣ RATE LIMIT
    // ----------------------------
    try {
      const rate = await ratelimit.limit(token.sub);
      if (!rate.success) {
        return json({ message: "Rate limit exceeded" }, 429);
      }
    } catch (err) {
      console.warn("Rate limiter unavailable, continuing:", err);
    }

    // ----------------------------
    // 3️⃣ ROUTE PARAMS
    // ----------------------------
    const { userId } = context.params;

    if (!userId) {
      return json({ message: "User ID is required" }, 400);
    }

    if (!Types.ObjectId.isValid(userId)) {
      return json({ message: "Invalid user ID format" }, 400);
    }

    // ----------------------------
    // 4️⃣ OWNERSHIP CHECK
    // ----------------------------
    if (userId !== token.sub) {
      return json({ message: "Forbidden" }, 403);
    }

    // ----------------------------
    // 5️⃣ DB CONNECTION
    // ----------------------------
    try {
      await connect();
    } catch (err) {
      console.error("DB connection failed:", err);
      return json({ message: "Database connection failed" }, 500);
    }

    // ----------------------------
    // 6️⃣ FETCH USER
    // ----------------------------
    const user: any = await User.findById(userId)
      .select("-password -__v")
      .lean();

    if (!user) {
      return json({ message: "User not found" }, 404);
    }

    // ----------------------------
    // 7️⃣ SUCCESS
    // ----------------------------
    return json(
      {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          profile: user.profile ?? 2,
          image: user.image ?? null,
          subscription: user.subscription ?? null,
        },
      },
      200
    );
  } catch (err) {
    console.error("USERS API UNHANDLED ERROR:", err);
    return json({ message: "Internal server error" }, 500);
  }
};

// -------------------------------------
// DELETE User
// -------------------------------------
export const DELETE = async (request: Request) => {
  const token = await validateRequest(request);
  if (token instanceof NextResponse) return token;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId))
      return json({ message: "Invalid or missing userId" }, 400);

    if (userId !== token.sub)
      return json({ message: "Forbidden" }, 403);

    await connect();

    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) return json({ message: "User not found" }, 404);

    return json({
      message: "User deleted successfully",
      userId: deleted._id,
    });
  } catch (err: any) {
    return json({ message: "Error deleting user", error: err.message }, 500);
  }
};
