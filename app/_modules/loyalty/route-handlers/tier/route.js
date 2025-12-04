import { NextResponse } from "next/server";

const CACHE = new Map();
const CACHE_TTL = 10 * 60 * 1000;

const REQUEST_TIMEOUT = 30000;

async function fetchUserTier(basicAuth, apiUrl) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${basicAuth}`,
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === "AbortError") {
            throw new Error("Timeout: fetching loyalty tier");
        }
        throw error;
    }
}

export async function GET(req) {
    const requestId = `TIER_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("user_id");

        if (!userId) {
            throw new Error("Missing required parameter: user_id");
        }

        const cacheKey = `TIER_${userId}`;
        const cached = CACHE.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return NextResponse.json(cached.data);
        }

        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;

        if (!username || !password) {
            throw new Error("Missing API credentials configuration");
        }

        const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

        const apiUrl = `${process.env.API_BASE_URL}/api/loyalty/tier?user_id=${encodeURIComponent(userId)}`;

        const response = await fetchUserTier(basicAuth, apiUrl);

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch user tier", status: response.status }, { status: response.status });
        }

        const data = await response.json();
        CACHE.set(cacheKey, { data, timestamp: Date.now() });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message || "Internal server error", requestId }, { status: 500 });
    }
}
