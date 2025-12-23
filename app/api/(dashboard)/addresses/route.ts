import connect from "@/lib/db";
import User from "@/lib/models/user";
import Address from "@/lib/models/address";
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
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Content-Type": "application/json",
};

// -----------------------------
// Helper → JSON response
// -----------------------------
function json(body: any, status = 200) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: securityHeaders,
  });
}

// -----------------------------
// Shared Request Validation
// -----------------------------
async function validateRequest(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "127.0.0.1";

  // Rate limit
  try {
    const { success } = await ratelimit.limit(ip);
    if (!success) return json({ message: "Rate limit exceeded" }, 429);
  } catch (e) {
    console.warn("Rate limit failed (continuing)", e);
  }

  // Session check
  try {
    const token =
      (await getToken({ req: req as any })) ||
      req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return json({ message: "Unauthorized" }, 401);
  } catch (err) {
    console.warn("Session token check failed", err);
  }

  return null;
}

// -----------------------------
// GET ALL ADDRESSES
// -----------------------------
export const GET = async (request: Request) => {
  const blocked = await validateRequest(request);
  if (blocked) return blocked;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId))
      return json({ message: "Invalid or missing userId" }, 400);

    await connect();

    const user = await User.findById(userId);
    if (!user) return json({ message: "User not found" }, 404);

    const addresses = await Address.find({ user: userId });

    return json({ addresses });
  } catch (err: any) {
    return json(
      { message: "Error fetching addresses", error: err.message },
      500
    );
  }
};

// -----------------------------
// CREATE NEW ADDRESS
// -----------------------------
export const POST = async (request: Request) => {
  const blocked = await validateRequest(request);
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const { address, label, category } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId))
      return json({ message: "Invalid or missing userId" }, 400);

    if (!address || !label || !category)
      return json(
        { message: "Address, label, and category are required" },
        400
      );

    await connect();

    const user = await User.findById(userId);
    if (!user) return json({ message: "User not found" }, 404);

    const newAddress = await Address.create({
      address,
      label,
      category,
      user: userId,
    });

    return json(
      { message: "Address created successfully", address: newAddress },
      201
    );
  } catch (err: any) {
    return json(
      { message: "Error creating address", error: err.message },
      500
    );
  }
};
