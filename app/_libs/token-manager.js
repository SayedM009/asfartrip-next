import { cookies } from "next/headers";

const TOKEN_EXPIRY = 10 * 60;

const TOKEN_REFRESH_BUFFER = 60;

let isRefreshing = false;
let refreshPromise = null;

export async function loginWithExistsCredintials() {
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
            body: new URLSearchParams({ grant_type: "client_credentials" }),
            cache: "no-store",
        }
    );

    if (!res.ok) {
        console.error("Login failed:", res.status, res.statusText);
        throw new Error("Failed to login");
    }

    const data = await res.json();
    return data.token || data.api_token || data.access_token;
}

/**
 * Sets API token in cookie with timestamp
 */
export async function setApiToken(token) {
    const cookieStore = await cookies();
    const now = Math.floor(Date.now() / 1000); // Current time in seconds

    // Store token with creation timestamp
    cookieStore.set("api_token", token, {
        path: "/",
        httpOnly: true,
        maxAge: TOKEN_EXPIRY,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    // Store timestamp separately for validation
    cookieStore.set("api_token_timestamp", now.toString(), {
        path: "/",
        httpOnly: true,
        maxAge: TOKEN_EXPIRY,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    console.log(
        ` [${new Date().toISOString()}] Token set successfully (expires in ${TOKEN_EXPIRY}s)`
    );
    return true;
}

/**
 * Gets raw token from cookie (no validation)
 */
export async function getApiToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("api_token")?.value;
    return token;
}

/**
 * Clears both token and timestamp
 */
export async function clearAPIToken() {
    const cookieStore = await cookies();
    cookieStore.delete("api_token");
    cookieStore.delete("api_token_timestamp");
    console.log(` [${new Date().toISOString()}] Token cleared`);
}

/**
 * Checks if token is expired or about to expire
 */
async function isTokenExpired() {
    const cookieStore = await cookies();
    const timestamp = cookieStore.get("api_token_timestamp")?.value;

    // If no timestamp, consider it expired
    if (!timestamp) {
        return true;
    }

    const now = Math.floor(Date.now() / 1000);
    const tokenAge = now - parseInt(timestamp);

    // Token is expired if it's older than (EXPIRY - BUFFER)
    const isExpired = tokenAge >= TOKEN_EXPIRY - TOKEN_REFRESH_BUFFER;

    if (isExpired) {
        console.log(
            `⏰ [${new Date().toISOString()}] Token expired (age: ${tokenAge}s / max: ${TOKEN_EXPIRY - TOKEN_REFRESH_BUFFER
            }s)`
        );
    }

    return isExpired;
}

/**
 * Refreshes the token with lock mechanism to prevent race conditions
 */
async function refreshToken() {
    // If already refreshing, wait for that promise
    if (isRefreshing && refreshPromise) {
        console.log(
            `⏳ [${new Date().toISOString()}] Waiting for existing refresh operation...`
        );
        return await refreshPromise;
    }

    // Set lock
    isRefreshing = true;

    refreshPromise = (async () => {
        try {
            console.log(
                `🔄 [${new Date().toISOString()}] Starting token refresh...`
            );

            // Clear old token
            await clearAPIToken();

            // Get new token via login
            const newToken = await loginWithExistsCredintials();

            if (!newToken) {
                throw new Error("Failed to obtain authentication token");
            }

            // Store new token with timestamp
            await setApiToken(newToken);

            console.log(
                ` [${new Date().toISOString()}] Token refreshed successfully`
            );

            return newToken;
        } catch (error) {
            console.error(
                ` [${new Date().toISOString()}] Token refresh failed:`,
                error.message
            );
            throw error;
        } finally {
            // Release lock
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return await refreshPromise;
}

/**
 * Gets a valid token (refreshes if needed)
 * This is the main function to use in API routes
 */
export async function getValidToken() {
    try {
        // Check if token exists
        let token = await getApiToken();

        // If no token, get a new one
        if (!token) {
            console.log(
                `🔐 [${new Date().toISOString()}] No token found, getting new one...`
            );
            token = await refreshToken();
            return token;
        }

        // Check if token is expired
        const expired = await isTokenExpired();

        if (expired) {
            console.log(
                ` [${new Date().toISOString()}] Token expired, refreshing...`
            );
            token = await refreshToken();
            return token;
        }

        console.log(
            ` [${new Date().toISOString()}] Using existing valid token`
        );
        return token;
    } catch (error) {
        console.error(
            ` [${new Date().toISOString()}] getValidToken error:`,
            error.message
        );
        throw new Error("Failed to get valid authentication token");
    }
}
