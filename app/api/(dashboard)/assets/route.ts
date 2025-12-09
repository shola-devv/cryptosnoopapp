import connect from "@/lib/db";
import User from "@/lib/models/user";
import Asset from "@/lib/models/asset";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

// GET ALL assets for a user
export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    const assets = await Asset.find({ user: userId });

    return new NextResponse(
      JSON.stringify({ assets }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching assets", error: error.message }),
      { status: 500 }
    );
  }
};

// CREATE a new asset
export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { name, quantity } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!name || quantity === undefined) {
      return new NextResponse(
        JSON.stringify({ message: "Name and quantity are required" }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    // Check if asset with same name already exists for this user
    const existingAsset = await Asset.findOne({ name, user: userId });
    if (existingAsset) {
      return new NextResponse(
        JSON.stringify({ message: "Asset with this name already exists" }),
        { status: 409 }
      );
    }

    const newAsset = new Asset({
      name,
      quantity,
      user: userId,
    });

    await newAsset.save();

    return new NextResponse(
      JSON.stringify({ message: "Asset created successfully", asset: newAsset }),
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error creating asset", error: error.message }),
      { status: 500 }
    );
  }
}