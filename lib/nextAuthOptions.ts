import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connect from "@/lib/db";
import Otp from "@/lib/models/otp";
import bcrypt from "bcryptjs";

// Helper function to generate username - returns 'user' for everyone
function generateUsername(email: string): string {
  return 'User';
}

// Helper function to send OTP via API
async function sendOTP(email: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send OTP');
    }

    console.log(`✅ [NextAuth] OTP sent via API to ${email}`);
  } catch (error: any) {
    console.error("❌ [NextAuth] Error sending OTP:", error);
    throw error;
  }
}

// Helper function to verify OTP directly (not via fetch)
async function verifyOTP(email: string, otp: string): Promise<boolean> {
  try {
    const emailString = email.trim().toLowerCase();
    const otpString = otp.trim();

    console.log("🔍 [NextAuth] Verifying OTP for:", emailString);

    await connect();

    // Find OTP record
    const record = await Otp.findOne({ email: emailString });

    if (!record) {
      console.log(`❌ [NextAuth] No OTP record found for email`);
      return false;
    }

    // Compare the provided OTP with the hashed OTP in the database
    const isMatch = await bcrypt.compare(otpString, record.otp);

    if (!isMatch) {
      console.log(`❌ [NextAuth] OTP does not match`);
      return false;
    }

    // Delete OTP after successful verification
    await Otp.deleteOne({ _id: record._id });
    console.log(`✅ [NextAuth] OTP verified and deleted`);

    return true;
  } catch (error) {
    console.error("❌ [NextAuth] Error verifying OTP:", error);
    return false;
  }
}

// Helper function to create user in database (direct DB access, not HTTP)
async function createUserInDB(email: string, username: string, provider: string, image?: string) {
  try {
    // Import User model dynamically to avoid circular dependencies
    const User = (await import("@/lib/models/user")).default;
    
    console.log("📥 [createUserInDB] Request:", { email, username, provider });

    await connect();

    // Check if user already exists by email
    let user = await User.findOne({ email });

    if (user) {
      console.log(`✅ [createUserInDB] User already exists: ${email}`);
      return {
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          profile: user.profile,
          image: user.image,
        },
        message: "User already exists"
      };
    }

    // Create new user with provided username (no uniqueness check needed now)
    user = new User({
      email,
      username: username,
      provider,
      image: image || null,
      profile: 2,
      password: "oauth_user", // Placeholder for OAuth users
      subscription: {
        id: "",
        status: "free",
        plan: "free",
      },
    });

    await user.save();

    console.log(`✅ [createUserInDB] New user created: ${email} (${username})`);

    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        profile: user.profile,
        image: user.image,
      },
      message: "User created successfully",
    };
  } catch (error: any) {
    console.error('❌ [createUserInDB] Error:', error);
    
    // Handle MongoDB duplicate key errors (only email should be unique now)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      console.log(`❌ [createUserInDB] Duplicate key error on field: ${field}`);
      throw new Error(`${field} already exists`);
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      console.log(`❌ [createUserInDB] Validation error:`, messages);
      throw new Error(messages.join(', '));
    }

    throw error;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Email OTP Provider - No username field required
    CredentialsProvider({
      id: "email-otp",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        try {
          console.log("🔐 [NextAuth] Authorize called with:", { 
            email: credentials?.email, 
            hasOtp: !!credentials?.otp 
          });

          if (!credentials?.email) {
            throw new Error("Email is required");
          }

          // Step 1: If no OTP provided, send OTP
          if (!credentials?.otp) {
            console.log("📤 [NextAuth] No OTP provided, sending OTP...");
            await sendOTP(credentials.email);
            throw new Error("OTP_SENT");
          }

          // Step 2: Verify OTP
          console.log("🔍 [NextAuth] OTP provided, verifying...");
          const isValid = await verifyOTP(credentials.email, credentials.otp);

          if (!isValid) {
            console.log("❌ [NextAuth] OTP verification failed");
            throw new Error("Invalid OTP");
          }

          console.log("✅ [NextAuth] OTP verified, creating user...");

          // Step 3: Auto-generate username from email
          const username = generateUsername(credentials.email);
          
          const userResult = await createUserInDB(
            credentials.email,
            username,
            'email'
          );

          if (userResult.success && userResult.user) {
            console.log("✅ [NextAuth] User created/found:", userResult.user.email);
            return {
              id: userResult.user.id,
              email: userResult.user.email,
              name: userResult.user.username,
              image: userResult.user.image || null,
            };
          } else {
            throw new Error("Failed to create user");
          }
        } catch (error: any) {
          console.error("❌ [NextAuth] Authorize error:", error.message);
          throw error;
        }
      },
    }),
  ],

  pages: {
    signIn: "/",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user, account }) {
      // Handle Google sign-in - create user in MongoDB
      if (account?.provider === "google" && user.email) {
        try {
          const username = generateUsername(user.email);
          const userResult = await createUserInDB(
            user.email,
            username,
            'google',
            user.image || undefined
          );
          
          // Store MongoDB ID in the user object so jwt callback can access it
          if (userResult.success && userResult.user) {
            user.id = userResult.user.id; // MongoDB _id
          }
        } catch (error) {
          console.error('Error creating Google user:', error);
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // On sign in (when user object exists)
      if (user) {
        token.id = user.id; // This is now the MongoDB ID
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.profile = (user as any).profile;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
         (session.user as any).profile = ((token as any).profile as number | null | undefined);
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
