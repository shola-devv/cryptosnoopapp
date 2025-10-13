import connect from "@/lib/db";
import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Blog from "@/lib/models/blogs";

// ✅ GET blogs for a user and category
export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const searchKeywords = searchParams.get("keywords") as string;
    const startDate = searchParams.get("startDate");
    const startDate = searchParams.get("endDate");



    // ✅ Validate IDs
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 400 }
      );
    }

    // ✅ Connect to DB
    await connect();

    // ✅ Check user
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    // ✅ Check category
    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }

    // ✅ Filter and fetch blogs
    const filter = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    if (searchKeywords) {
      filter.$or =[
           
         {
              title: {$regex : searchKeywords, $options: "i"},
        },
         {
              description: {$regex : searchKeywords, $options: "i"},
         }

      ];
    }

    if (startDate && endDate ){
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte : new Date(endDate),
      }
    } else if(startDate){
      filter.createdAt = {
        $gte: new Date(startDate)
      };
    } else if (endDate){
      filter.createdAt = {
        $lte: new Date(endDate),
      };
    }


    const blogs = await Blog.find(filter);

    return new NextResponse(JSON.stringify({ blogs }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error in fetching blogs", error: error.message }),
      { status: 500 }
    );
  }
};

// ✅ POST - create a new blog
export const POST = async (request: Request) => {

  try {
      const { searchParams } = new URL(request.url);
     const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    const body = await request.json();
    const { title, description } = body;

    // ✅ Validate IDs
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 400 }
      );
    }

    await connect();

    // ✅ Check user
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    // ✅ Check category
    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }

    // ✅ Create blog
    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    await newBlog.save();

    return new NextResponse(
      JSON.stringify({ message: "Blog created successfully", blog: newBlog }),
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error creating blog", error: error.message }),
      { status: 500 }
    );
  }
};
