import connect  from "@/lib/db"
import User from "@/lib/models/user"
import { NextResponse } from "next/server"
import {Types} from "mongoose"
import { useSession } from 'next-auth/react';



const Objectid = require("mongoose").Types.objectid

const password_ = process.env.PASSWORD;

export const GET = async (request: Request)=>{
   const { data: session, status } = useSession();

  try{

  const body = await request.json();
    const { userId, password } = body;
    const userId_ = "64b8f3f5f1d2c9e6f8a4e2b1" //admin user id for testing

    if (userId === userId_ || password === password ) {
     
     await connect();
  const users = await User.find();
  return new NextResponse(JSON.stringify(users), {status:200});

    }

 
  } catch (error:any){
    return new NextResponse("protected api dumbass" + error.message, {status: 500})
  }


}


export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
const newUser = new User(body);
    await newUser.save();
    return new NextResponse(JSON.stringify({ message: "user is created", user: newUser}), { status: 201 });

  } catch (error:any) {
 return new NextResponse("error in creating user" + error.message, { status: 500 });
  }
}



export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newUsername, newImage } = body;

    await connect();

    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: "ID or username not found" }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid user id" }),
        { status: 400 }
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      {
        username: newUsername,
        profile: newImage, // number between 0–4
      },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "User updated successfully",
        user: updatedUser,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error updating user: " + error.message }),
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "Id not found" }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid user id" }),
        { status: 400 }
      );
    }

    await connect();

    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    if (!deletedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User deleted successfully", user: deletedUser }),
      { status: 200 }
    );

  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error in deleting user: " + error.message }),
      { status: 500 }
    );
  }
};