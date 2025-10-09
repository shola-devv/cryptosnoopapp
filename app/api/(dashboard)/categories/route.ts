import connect from "@/lib/db";
import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // ✅ Validate userId
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    // ✅ Connect to DB
    await connect();

    // ✅ Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 404 }
      );
    }

    // ✅ Fetch categories linked to the user
    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    });

    return new NextResponse(JSON.stringify(categories), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message: "Error fetching categories",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};

// ✅ POST route to create a new category
export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const { title } = await request.json();

    // ✅ Validate inputs
    if (!title) {
      return new NextResponse(
        JSON.stringify({ message: "Title is required" }),
        { status: 400 }
      );
    }

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    // ✅ Connect to DB
    await connect();

    // ✅ Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    // ✅ Create and save category
    const newCategory = new Category({
      title,
      user: new Types.ObjectId(userId),
    });

    await newCategory.save();

    return new NextResponse(
      JSON.stringify({
        message: "Category created successfully",
        category: newCategory,
      }),
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message: "Error creating category",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
