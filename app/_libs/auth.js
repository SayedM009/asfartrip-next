// app/auth.js
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "@auth/core/providers/credentials";
import { supabase } from "./supbase";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        CredentialsProvider({
            name: "Email",
            credentials: {
                email: { label: "Email", type: "text" },
                token: { label: "Token", type: "text", optional: true },
            },
            async authorize(credentials, req) {
                const { email, token } = credentials;

                if (token) {
                    // التحقق من OTP باستخدام Supabase
                    const { data, error } = await supabase.auth.verifyOtp({
                        email,
                        token,
                        type: "email",
                    });
                    if (error) throw new Error(error.message);
                    return data.user; // إرجاع بيانات المستخدم لتخزين الجلسة
                } else {
                    // إرسال OTP باستخدام Supabase
                    const { error } = await supabase.auth.signInWithOtp({
                        email,
                        options: {
                            shouldCreateUser: true,
                        },
                    });
                    if (error) throw new Error(error.message);
                    return { id: email, email }; // إرجاع مؤقت لتأكيد الإرسال
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.email = token.email;
            // إضافة بيانات الجلسة من Supabase
            const { data: supabaseSession } = await supabase.auth.getSession();
            if (supabaseSession.session) {
                session.accessToken = supabaseSession.session.access_token;
            }
            return session;
        },
    },
});
// app/_libs/authService.js
export async function getApiToken() {
    const username = process.env.TP_USERNAME;
    const password = process.env.TP_PASSWORD;
    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`,
        {
            method: "POST",
            headers: {
                Authorization: `Basic ${basicAuth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
            }),
            cache: "no-store",
        }
    );

    if (!res.ok) throw new Error("Failed to login");

    const data = await res.json();
    return data.token; // 👈 حسب اسم الفيلد الراجع (token / api_token)
}
