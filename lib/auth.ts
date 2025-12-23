import NextAuth from "next-auth";
import { authOptions } from "@/lib/nextAuthOptions";

export const { auth, signIn, signOut } = NextAuth(authOptions as any);
