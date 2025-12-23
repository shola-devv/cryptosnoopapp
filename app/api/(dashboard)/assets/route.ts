import connect from "@/lib/db";
import User from "@/lib/models/user";
import Asset from "@/lib/models/asset";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { ratelimit } from "@/lib/rate-limit";
import { getToken } from "next-auth/jwt";

// -------------------------------------
// Security Headers
// -------------------------------------
const securityHeaders = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=()",
  "Content-Type": "application/json",
};

// -------------------------------------
// Helper → return response with headers
// -------------------------------------
function json(body: any, status = 200) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: securityHeaders,
  });
}

// -------------------------------------
// Helper → Validate & Auth
// -------------------------------------
async function validateRequest(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "127.0.0.1";

  // ---- Rate Limit ----
  try {
    const { success } = await ratelimit.limit(ip);
    if (!success) return json({ message: "Rate limit exceeded" }, 429);
  } catch (e) {
    console.warn("Rate limit failed (continuing)", e);
  }

  // ---- Check Session ----
  try {
    const token =
      (await getToken({ req: req as any })) ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) return json({ message: "Unauthorized" }, 401);
  } catch (err) {
    console.warn("Session check failed", err);
  }

  return null; // means allowed
}

// -------------------------------------
// GET ALL USER ASSETS
// -------------------------------------
export const GET = async (request: Request) => {
  const blocked = await validateRequest(request);
  if (blocked) return blocked;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return json({ message: "Invalid or missing userId" }, 400);
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) return json({ message: "User not found" }, 404);

    const assets = await Asset.find({ user: userId });

    return json({ assets });
  } catch (err: any) {
    return json(
      { message: "Error fetching assets", error: err.message },
      500
    );
  }
};

// -------------------------------------
// CREATE NEW ASSET
// -------------------------------------
export const POST = async (request: Request) => {
  const blocked = await validateRequest(request);
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const { name, quantity } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return json({ message: "Invalid or missing userId" }, 400);
    }

    if (!name || quantity === undefined) {
      return json({ message: "Name and quantity are required" }, 400);
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) return json({ message: "User not found" }, 404);

    // Prevent duplicate asset names
    const exists = await Asset.findOne({ name, user: userId });
    if (exists)
      return json({ message: "Asset with this name already exists" }, 409);

    const newAsset = await Asset.create({ name, quantity, user: userId });

    return json(
      {
        message: "Asset created successfully",
        asset: newAsset,
      },
      201
    );
  } catch (err: any) {
    return json(
      { message: "Error creating asset", error: err.message },
      500
    );
  }
};
