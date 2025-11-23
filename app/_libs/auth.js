import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "@auth/core/providers/credentials";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.travelsprovider.com";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        // 🟢 تسجيل الدخول باستخدام Google
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        // 🟠 تسجيل الدخول عبر البريد والـ OTP
        CredentialsProvider({
            name: "Email",
            credentials: {
                email: { label: "Email", type: "text" },
                otp: { label: "OTP", type: "text" },
            },
            async authorize(credentials) {
                const { email, otp } = credentials;
                if (!email || !otp)
                    throw new Error("Email and OTP are required");

                const response = await fetch(
                    `${API_BASE_URL}/api/b2c/login-otp`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, otp }),
                    }
                );

                const data = await response.json();
                if (!response.ok || !data.status)
                    throw new Error(data.message || "Invalid OTP");

                const user = data.user || {};
                return {
                    id: user.user_id || email,
                    email: user.email || email,
                    name: user.firstname + ` ${user.lastname}` || "",
                    avatar: user.profile_photo || "",
                    api_token: user.api_token || "",
                    usertype: user.usertype || "",
                    domain: user.domain || "",
                    loggedin_with: user.loggedin_with || "",
                    data,
                };
            },
        }),
    ],

    callbacks: {
        async signIn({ account }) {
            if (account?.provider === "google" && account?.id_token) {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/b2c/google`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: account.id_token }),
                    });

                    const data = await res.json();
                    console.log("🟢 Google server response:", data);

                    if (res.ok && data?.status) {
                        account.serverData = data;
                        return true;
                    } else {
                        console.error("❌ Google API login failed:", data);
                        return false;
                    }
                } catch (err) {
                    console.error("🔥 Error calling API:", err.message);
                    return false;
                }
            }
            return true;
        },

        async jwt({ token, user, account }) {
            if (account?.provider === "google" && account?.serverData) {
                const { user: u, token: serverToken } = account.serverData;
                token.id = u.user_id;
                token.email = u.email;
                token.name = `${u.firstname} ${u.lastname}`.trim();
                token.avatar = u.profile_photo || "";
                token.api_token = u.api_token;
                token.server_token = serverToken;
                token.usertype = u.usertype;
                token.domain = u.domain;
                token.provider = "google";
                token.fullData = account.serverData;
            }

            // تسجيل الدخول عبر OTP
            if (account?.provider === "credentials" && user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.avatar = user.avatar;
                token.api_token = user.api_token;
                token.usertype = user.usertype;
                token.domain = user.domain;
                token.provider = "email";
                token.fullData = user.data;
            }

            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id,
                    email: token.email,
                    name: token.name,
                    avatar: token.avatar,
                    api_token: token.api_token,
                    usertype: token.usertype,
                    domain: token.domain,
                    provider: token.provider,
                };
                session.tokens = {
                    api_token: token.api_token,
                    server_token: token.server_token,
                };
                session.fullData = token.fullData || {};
            }
            return session;
        },
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },

    secret: process.env.NEXTAUTH_SECRET,
});
