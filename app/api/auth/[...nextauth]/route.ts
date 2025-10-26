import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Helper function to generate username from email
function generateUsername(email: string): string {
  const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  const randomSuffix = Math.floor(Math.random() * 1000);
  return `${baseUsername}${randomSuffix}`;
}

// Helper function to create user in database
async function createUserInDB(email: string, username: string, provider: string, image?: string) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        username,
        provider,
        image: image || null,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating user in DB:', error);
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

    // Email OTP Provider
    CredentialsProvider({
      id: "email-otp",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text" },
        username: { label: "Username", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        try {
          // Step 1: If no OTP provided, trigger OTP sending
          if (!credentials?.otp) {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/send-otp`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: credentials?.email,
              }),
            });

            if (response.ok) {
              // OTP sent successfully, throw special error
              throw new Error("OTP_SENT");
            } else {
              const errorData = await response.json();
              throw new Error(errorData.message || "Failed to send OTP");
            }
          }

          // Step 2: Verify OTP (this will auto-delete OTP after verification)
          const verifyResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/verify-otp`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials?.email,
              otp: credentials?.otp,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            // OTP verified (and deleted from DB by verify-otp route)
            // Now create or get user from your MongoDB
            const username = credentials?.username || generateUsername(credentials?.email!);
            const userResult = await createUserInDB(
              credentials?.email!,
              username,
              'email'
            );

            if (userResult.success) {
              return {
                id: userResult.user.id,
                email: userResult.user.email,
                name: userResult.user.username,
                image: userResult.user.image,
              };
            } else {
              throw new Error("Failed to create user");
            }
          } else {
            throw new Error(verifyData.message || "Invalid OTP");
          }
        } catch (error: any) {
          throw error;
        }
      },
    }),
  ],

  pages: {
    signIn: "/", // Redirect to landing page (modal will handle sign-in)
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
          await createUserInDB(
            user.email,
            username,
            'google',
            user.image || undefined
          );
        } catch (error) {
          console.error('Error creating Google user:', error);
          // Don't block sign-in if user already exists
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };