import connect from "@/lib/db";
import User from "@/lib/models/user";
import Address from "@/lib/models/address";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async (request: Request, context: { params: any }) => {
  const addressId = context.params.address;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!addressId || !Types.ObjectId.isValid(addressId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing addressId" }),
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

    const address = await Address.findOne({
      _id: addressId,
      user: userId,
    });

    if (!address) {
      return new NextResponse(
        JSON.stringify({ message: "Address not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ address }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching address", error: error.message }),
      { status: 500 }
    );
  }
};

export const PATCH = async (request: Request, context: { params: any }) => {
  const addressId = context.params.address;

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

    if (!addressId || !Types.ObjectId.isValid(addressId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing addressId" }),
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

    const addressDoc = await Address.findOne({ _id: addressId, user: userId });
    if (!addressDoc) {
      return new NextResponse(
        JSON.stringify({ message: "Address not found or not owned by user" }),
        { status: 404 }
      );
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { address, label, category },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({ message: "Address updated successfully", address: updatedAddress }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message: "Error updating address",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const addressId = context.params.address;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!addressId || !Types.ObjectId.isValid(addressId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing addressId" }),
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

    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) {
      return new NextResponse(
        JSON.stringify({ message: "Address not found or not owned by user" }),
        { status: 404 }
      );
    }

    await Address.findByIdAndDelete(addressId);

    return new NextResponse(
      JSON.stringify({ message: "Address deleted successfully" }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error deleting address", error: error.message }),
      { status: 500 }
    );
  }
};