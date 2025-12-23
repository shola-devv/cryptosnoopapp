import connect from "@/lib/db";
import User from "@/lib/models/user";
import Address from "@/lib/models/address";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { ratelimit } from "@/lib/rate-limit";
import { getToken } from "next-auth/jwt";

// -------------------------------------
// Security headers
// -------------------------------------
const securityHeaders = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Content-Type": "application/json",
};

// Helper → consistent JSON response
function json(body: any, status = 200) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: securityHeaders,
  });
}

// Shared validation → rate limit + session
async function validateRequest(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "127.0.0.1";

  // Rate limit
  try {
    const { success } = await ratelimit.limit(ip);
    if (!success) return json({ message: "Rate limit exceeded" }, 429);
  } catch (err) {
    console.warn("Rate limit check failed, continuing", err);
  }

  // Session check
  try {
    const token =
      (await getToken({ req: req as any })) ||
      req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return json({ message: "Unauthorized" }, 401);
  } catch (err) {
    console.warn("Session check failed", err);
  }

  return null;
}

// Shared user + address lookup
async function getUserAndAddress(userId: string, addressId: string) {
  if (!userId || !Types.ObjectId.isValid(userId))
    return { error: json({ message: "Invalid or missing userId" }, 400) };
  if (!addressId || !Types.ObjectId.isValid(addressId))
    return { error: json({ message: "Invalid or missing addressId" }, 400) };

  await connect();

  const user = await User.findById(userId);
  if (!user) return { error: json({ message: "User not found" }, 404) };

  const address = await Address.findOne({ _id: addressId, user: userId });
  return { user, address };
}

// -------------------------------------
// GET Address by ID
// -------------------------------------
export const GET = async (
  request: Request,
  context: { params: any }
) => {
  const blocked = await validateRequest(request);
  if (blocked) return blocked;

  try {
    const addressId = context.params.address;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId")!;

    const { error, address } = await getUserAndAddress(userId, addressId);
    if (error) return error;

    if (!address) return json({ message: "Address not found" }, 404);

    return json({ address });
  } catch (err: any) {
    return json({ message: "Error fetching address", error: err.message }, 500);
  }
};

// -------------------------------------
// PATCH (update address)
// -------------------------------------
export const PATCH = async (
  request: Request,
  context: { params: any }
) => {
  const blocked = await validateRequest(request);
  if (blocked) return blocked;

  try {
    const addressId = context.params.address;
    const body = await request.json();
    const { address, label, category } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId")!;

    const { error, address: addressDoc } = await getUserAndAddress(userId, addressId);
    if (error) return error;

    if (!addressDoc)
      return json({ message: "Address not found or not owned by user" }, 404);

    const updated = await Address.findByIdAndUpdate(
      addressId,
      { address, label, category },
      { new: true }
    );

    return json({ message: "Address updated successfully", address: updated });
  } catch (err: any) {
    return json({ message: "Error updating address", error: err.message }, 500);
  }
};

// -------------------------------------
// DELETE Address
// -------------------------------------
export const DELETE = async (
  request: Request,
  context: { params: any }
) => {
  const blocked = await validateRequest(request);
  if (blocked) return blocked;

  try {
    const addressId = context.params.address;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId")!;

    const { error, address } = await getUserAndAddress(userId, addressId);
    if (error) return error;

    if (!address)
      return json({ message: "Address not found or not owned by user" }, 404);

    await Address.findByIdAndDelete(addressId);

    return json({ message: "Address deleted successfully" });
  } catch (err: any) {
    return json({ message: "Error deleting address", error: err.message }, 500);
  }
};
