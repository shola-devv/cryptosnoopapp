import connect from "@/lib/db";
import User from "@/lib/models/user";
import Asset from "@/lib/models/asset";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { ratelimit } from "@/lib/rate-limit";
import { getToken } from "next-auth/jwt";

// -------------------------------------
// Security Headers config
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

// Reusable response wrapper
function json(body: any, status = 200) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: securityHeaders,
  });
}

// -------------------------------------
// Shared Validation Helper
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
    console.warn("Rate limit check failed (continuing)", e);
  }

  // ---- Session Check ----
  try {
    const token =
      (await getToken({ req: req as any })) ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) return json({ message: "Unauthorized" }, 401);
  } catch (err) {
    console.warn("Session token check error:", err);
  }

  return null;
}

// -------------------------------------
// Shared lookup function
// -------------------------------------
async function getUserAndAsset(userId: string, assetName: string) {
  if (!userId || !Types.ObjectId.isValid(userId))
    return { error: json({ message: "Invalid or missing userId" }, 400) };

  if (!assetName)
    return { error: json({ message: "Missing asset name" }, 400) };

  await connect();

  const user = await User.findById(userId);
  if (!user) return { error: json({ message: "User not found" }, 404) };

  const asset = await Asset.findOne({
    name: { $regex: new RegExp(`^${assetName.trim()}$`, "i") },
    user: userId,
  });

  return { user, asset };
}

// -------------------------------------
// GET ASSET BY NAME
// -------------------------------------
export const GET = async (
  request: Request,
  context: { params: Promise<{ name: string }> }
) => {
  const blocked = await validateRequest(request);
  if (blocked) return blocked;

  try {
    const { name } = await context.params;
    const assetName = decodeURIComponent(name);

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId")!;

    const { error, asset } = await getUserAndAsset(userId, assetName);
    if (error) return error;

    if (!asset) return json({ message: "Asset not found" }, 404);

    return json({ asset });
  } catch (error: any) {
    return json(
      { message: "Error fetching asset", error: error.message },
      500
    );
  }
};

// -------------------------------------
// PATCH (UPDATE ASSET)
// -------------------------------------
export const PATCH = async (
  request: Request,
  context: { params: Promise<{ name: string }> }
) => {
  const blocked = await validateRequest(request);
  if (blocked) return blocked;

  try {
    const { name } = await context.params;
    const assetName = decodeURIComponent(name);

    const body = await request.json();
    const { name: newName, quantity } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId")!;

    const { error, asset } = await getUserAndAsset(userId, assetName);
    if (error) return error;

    if (!asset)
      return json(
        { message: "Asset not found or not owned by user" },
        404
      );

    // Check if renaming to a name that already exists
    if (newName && newName.toLowerCase() !== assetName.toLowerCase()) {
      const existing = await Asset.findOne({
        name: { $regex: new RegExp(`^${newName.trim()}$`, "i") },
        user: userId,
      });
      if (existing)
        return json(
          { message: "Asset with this name already exists" },
          409
        );
    }

    const updated = await Asset.findByIdAndUpdate(
      asset._id,
      {
        name: newName || asset.name,
        quantity,
      },
      { new: true }
    );

    return json({
      message: "Asset updated successfully",
      asset: updated,
    });
  } catch (error: any) {
    return json(
      { message: "Error updating asset", error: error.message },
      500
    );
  }
};

// -------------------------------------
// DELETE ASSET
// -------------------------------------
export const DELETE = async (
  request: Request,
  context: { params: Promise<{ name: string }> }
) => {
  const blocked = await validateRequest(request);
  if (blocked) return blocked;

  try {
    const { name } = await context.params;
    const assetName = decodeURIComponent(name);

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId")!;

    const { error, asset } = await getUserAndAsset(userId, assetName);
    if (error) return error;

    if (!asset)
      return json(
        { message: "Asset not found or not owned by user" },
        404
      );

    await Asset.findByIdAndDelete(asset._id);

    return json({ message: "Asset deleted successfully" });
  } catch (error: any) {
    return json(
      { message: "Error deleting asset", error: error.message },
      500
    );
  }
};
