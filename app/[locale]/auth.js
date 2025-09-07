// app/auth.js
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { supabase } from "../_libs/supbase";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      id: "otp-email",
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        token: { label: "OTP Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          const { email, token } = credentials;

          if (!email || !token) {
            console.log("Missing credentials");
            return null;
          }

          console.log("Verifying OTP for:", email);

          // Verify OTP with Supabase
          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: "email",
          });

          if (error) {
            console.error("Supabase verification error:", error.message);
            return null;
          }

          if (!data.user) {
            console.log("No user data from Supabase");
            return null;
          }

          console.log("✅ OTP verified successfully for user:", data.user.id);

          // Return user object that will be stored in JWT/session
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.email.split("@")[0], // Use email prefix as name
            image: data.user.user_metadata?.avatar_url || null,
            // Add any additional user data you need
            supabaseUser: data.user,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // When user signs in, add user data to token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.supabaseUser = user.supabaseUser;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.supabaseUser = token.supabaseUser;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Optional: custom sign-in page
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
});
