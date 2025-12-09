import connect from "@/lib/db";
import User from "@/lib/models/user";
import Account from "@/lib/models/account";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

// GET ALL accounts for a user
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

    // Get all accounts for this user
    const accounts = await Account.find({ user: userId });

    return new NextResponse(
      JSON.stringify({ accounts }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching accounts", error: error.message }),
      { status: 500 }
    )
  }
};

// CREATE a new account
export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { address, data } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!address) {
      return new NextResponse(
        JSON.stringify({ message: "Address is required" }),
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

    const newAccount = new Account({
      address,
      data: data || [],
      user: userId,
    });

    await newAccount.save();

    return new NextResponse(
      JSON.stringify({ message: "Account created successfully", account: newAccount }),
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error creating account", error: error.message }),
      { status: 500 }
    );
  }
};


//app/api/accounts/route.ts