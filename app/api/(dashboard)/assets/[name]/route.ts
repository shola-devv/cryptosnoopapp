import connect from "@/lib/db";
import User from "@/lib/models/user";
import Asset from "@/lib/models/asset";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async (request: Request, context: { params: Promise<{ name: string }> }) => {
  try {
    const params = await context.params;
    const assetName = decodeURIComponent(params.name);

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!assetName) {
      return new NextResponse(
        JSON.stringify({ message: "Missing asset name" }),
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

    const asset = await Asset.findOne({ 
      name: { $regex: new RegExp(`^${assetName.trim()}$`, 'i') },
      user: userId 
    });
    
    if (!asset) {
      return new NextResponse(
        JSON.stringify({ message: "Asset not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ asset }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching asset", error: error.message }),
      { status: 500 }
    );
  }
}

export const PATCH = async (request: Request, context: { params: Promise<{ name: string }> }) => {
  try {
    const params = await context.params;
    const assetName = decodeURIComponent(params.name);

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

    if (!assetName) {
      return new NextResponse(
        JSON.stringify({ message: "Missing asset name" }),
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

    const asset = await Asset.findOne({ 
      name: { $regex: new RegExp(`^${assetName.trim()}$`, 'i') },
      user: userId 
    });
    
    if (!asset) {
      return new NextResponse(
        JSON.stringify({ message: "Asset not found or not owned by user" }),
        { status: 404 }
      );
    }

    // If changing name, check if new name already exists
    if (name && name.toLowerCase() !== assetName.toLowerCase()) {
      const existingAsset = await Asset.findOne({ 
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
        user: userId 
      });
      if (existingAsset) {
        return new NextResponse(
          JSON.stringify({ message: "Asset with this name already exists" }),
          { status: 409 }
        );
      }
    }

    const updatedAsset = await Asset.findByIdAndUpdate(
      asset._id,
      { name: name || asset.name, quantity },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({ message: "Asset updated successfully", asset: updatedAsset }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message: "Error updating asset",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request, context: { params: Promise<{ name: string }> }) => {
  try {
    const params = await context.params;
    const assetName = decodeURIComponent(params.name);

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!assetName) {
      return new NextResponse(
        JSON.stringify({ message: "Missing asset name" }),
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

    const asset = await Asset.findOne({ 
      name: { $regex: new RegExp(`^${assetName.trim()}$`, 'i') },
      user: userId 
    });
    
    if (!asset) {
      return new NextResponse(
        JSON.stringify({ message: "Asset not found or not owned by user" }),
        { status: 404 }
      );
    }

    await Asset.findByIdAndDelete(asset._id);

    return new NextResponse(
      JSON.stringify({ message: "Asset deleted successfully" }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error deleting asset", error: error.message }),
      { status: 500 }
    );
  }
};