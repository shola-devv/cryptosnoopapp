import connect from "@/lib/db";
import User from "@/lib/models/user";
import Account from "@/lib/models/account";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async (request: Request, context: { params: any }) => {
  const params = await context.params;
const accountId = params.account;
  

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!accountId || !Types.ObjectId.isValid(accountId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing accountId" }),
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

    const account = await Account.findOne({
      _id: accountId,
      user: userId,
    });

    if (!account) {
      return new NextResponse(
        JSON.stringify({ message: "Account not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ account }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching account", error: error.message }),
      { status: 500 }
    )
  }
};

export const PATCH = async (request: Request, context: { params: any }) => {
  const params = await context.params;
const accountId = params.account;
  
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

    if (!accountId || !Types.ObjectId.isValid(accountId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing accountId" }),
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

    const account = await Account.findOne({ _id: accountId, user: userId });
    if (!account) {
      return new NextResponse(
        JSON.stringify({ message: "Account not found or not owned by user" }),
        { status: 404 }
      );
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      accountId,
      { address, data },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({ message: "Account updated successfully", account: updatedAccount }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message: "Error updating account",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const params = await context.params;
const accountId = params.account;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!accountId || !Types.ObjectId.isValid(accountId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing accountId" }),
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

    const account = await Account.findOne({ _id: accountId, user: userId });
    if (!account) {
      return new NextResponse(
        JSON.stringify({ message: "Account not found or not owned by user" }),
        { status: 404 }
      );
    }

    await Account.findByIdAndDelete(accountId);

    return new NextResponse(
      JSON.stringify({ message: "Account deleted successfully" }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error deleting account", error: error.message }),
      { status: 500 }
    );
  }
};