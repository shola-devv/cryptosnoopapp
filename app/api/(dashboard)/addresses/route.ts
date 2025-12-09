import connect from "@/lib/db";
import User from "@/lib/models/user";
import Address from "@/lib/models/address";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

// GET ALL addresses for a user
export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      )
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    // Get all addresses for this user
    const addresses = await Address.find({ user: userId });

    return new NextResponse(
      JSON.stringify({ addresses }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching addresses", error: error.message }),
      { status: 500 }
    );
  }
};

// CREATE a new address
export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { address, label, category } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!address || !label || !category) {
      return new NextResponse(
        JSON.stringify({ message: "Address, label, and category are required" }),
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

    const newAddress = new Address({
      address,
      label,
      category,
      user: userId,
    });

    await newAddress.save();

    return new NextResponse(
      JSON.stringify({ message: "Address created successfully", address: newAddress }),
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error creating address", error: error.message }),
      { status: 500 }
    );
  }
};