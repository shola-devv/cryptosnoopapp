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
  const token = await getToken({ req });
  if (!token?.sub) return json({ message: "Unauthorized" }, 401);

  return token;
}

// -------------------------------------
// GET User
// ----------------------------------

export const GET = async (request: Request) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401, headers: securityHeaders }
      );
    }

    const identifier = session.user.id;

    try {
      await ratelimit.limit(identifier);
    } catch {
      console.warn("Rate limiter failed, skipping");
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid user ID" }),
        { status: 400, headers: securityHeaders }
      );
    }

    if (userId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({ message: "Forbidden" }),
        { status: 403, headers: securityHeaders }
      );
    }

    await connect();

    const user = await User.findById(userId).select("-password -__v").lean();

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }),
        { status: 404, headers: securityHeaders }
      );
    }

    return NextResponse.json(
      { user },
      { headers: securityHeaders }
    );
  } catch (err) {
    console.error("USERS API CRASH:", err);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers: securityHeaders }
    );
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
