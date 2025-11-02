import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "@auth/core/providers/credentials";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://your-api-domain.com";

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
                otp: { label: "OTP", type: "text" },
            },
            async authorize(credentials) {
                const { email, otp } = credentials;

                if (!email || !otp) {
                    throw new Error("Email and OTP are required");
                }

                try {
                    const response = await fetch(
                        `${API_BASE_URL}/api/b2c/login-otp`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email, otp }),
                        }
                    );

                    const data = await response.json();

                    if (!response.ok || !data.status) {
                        throw new Error(data.message || "Invalid OTP");
                    }

                    const userData = data.user || {};

                    return {
                        id: userData.user_id || email,
                        email: userData.email || email,
                        name: userData.firstname || "",
                        firstname: userData.firstname || "",
                        lastname: userData.lastname || "",
                        avatar: userData.profile_photo || "",
                        api_token: userData.api_token || "",
                        usertype: userData.usertype || "",
                        domain: userData.domain || "",
                        loggedin_with: userData.loggedin_with || "",
                        google_id: userData.google_id || "",
                        gender: userData.gender || "",
                        dob: userData.dob || "",
                        country: userData.country || "",
                        city: userData.city || "",
                        contact_no: userData.contact_no || "",
                        register_date: userData.register_date || "",
                        last_visit_date: userData.last_visit_date || "",
                        data,
                    };
                } catch (error) {
                    throw new Error(error.message || "Authentication failed");
                }
            },
        }),
    ],

    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },

    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.avatar = user.avatar;
                token.api_token = user.api_token;
                token.usertype = user.usertype;
                token.domain = user.domain;
                token.loggedin_with = user.loggedin_with;
                token.google_id = user.google_id;
                token.gender = user.gender;
                token.dob = user.dob;
                token.country = user.country;
                token.city = user.city;
                token.contact_no = user.contact_no;
                token.register_date = user.register_date;
                token.last_visit_date = user.last_visit_date;

                if (account?.provider === "google") {
                    token.provider = "google";
                    token.googleAccessToken = account.access_token;
                } else if (account?.provider === "credentials") {
                    token.provider = "email";
                }

                if (user.data) {
                    token.fullData = user.data;
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id,
                    email: token.email,
                    name: token.name,
                    firstname: token.name,
                    lastname: token.lastname || "",
                    avatar: token.avatar,
                    api_token: token.api_token,
                    usertype: token.usertype,
                    domain: token.domain,
                    loggedin_with: token.loggedin_with,
                    google_id: token.google_id,
                    gender: token.gender,
                    dob: token.dob,
                    country: token.country,
                    city: token.city,
                    contact_no: token.contact_no,
                    register_date: token.register_date,
                    last_visit_date: token.last_visit_date,
                    provider: token.provider,
                };

                session.fullData = token.fullData || {};
            }

            return session;
        },
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 يوم
    },

    secret: process.env.NEXTAUTH_SECRET,
});
