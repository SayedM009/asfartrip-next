"use server";

import { signIn } from "./auth";
import { cookies } from "next/headers";

const TOKEN_KEY = "api_token";
const TOKEN_TIMESTAMP_KEY = "api_token_timestamp";
const TOKEN_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function getToken() {
    const cookieStore = await cookies();

    const token = cookieStore.get(TOKEN_KEY);
    const timestamp = cookieStore.get(TOKEN_TIMESTAMP_KEY);

    if (!token || !timestamp) return null;

    const age = Date.now() - parseInt(timestamp, 10);
    if (age > TOKEN_EXPIRY_MS) {
        clearToken();
        return null;
    }
}

export async function googleSignIn() {
    await signIn("google");
}

export async function setToken(token) {
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_KEY, token);
    cookieStore.set(TOKEN_TIMESTAMP_KEY, Date.now().toString());
}

export async function clearToken() {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_KEY);
    cookieStore.delete(TOKEN_TIMESTAMP_KEY);
}
