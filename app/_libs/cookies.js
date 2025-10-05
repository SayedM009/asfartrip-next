import { cookies } from "next/headers";

const TOKEN_EXPIRY = 10 * 60; // 10 دقايق

export async function setApiToken(token) {
    const cookieStore = await cookies();
    cookieStore.set("api_token", token, {
        path: "/",
        httpOnly: true,
        maxAge: TOKEN_EXPIRY,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    console.log("Token set successfully");
    return true;
}

export async function getApiToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("api_token")?.value;
    return token;
}

export async function clearAPIToken() {
    const cookieStore = await cookies();
    return cookieStore.delete("api_token");
}
