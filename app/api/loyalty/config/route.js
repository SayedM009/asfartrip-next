import { NextResponse } from "next/server";

// Cache لمدة دقيقة واحدة
const CACHE = new Map();
const CACHE_TTL = 6000 * 1000; // 1 دقيقة

// إعداد مهلة الطلب
const REQUEST_TIMEOUT = 30000;

async function fetchLoyaltyConfig(basicAuth, apiUrl) {
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
            throw new Error("Timeout: fetching loyalty config");
        }
        throw error;
    }
}

// نقطة الدخول للـ Route
export async function GET() {
    const requestId = `LOYALTY_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;

    try {
        //  Check cache first
        const cacheKey = "LOYALTY_CONFIG";
        const cached = CACHE.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log(
                `[${new Date().toISOString()}] [${requestId}] Returning cached loyalty config`
            );
            return NextResponse.json(cached.data);
        }

        //  Prepare auth
        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;

        if (!username || !password) {
            throw new Error("Missing API credentials configuration");
        }

        const basicAuth = Buffer.from(`${username}:${password}`).toString(
            "base64"
        );

        //  External API endpoint (استبدل بالرابط الصحيح من الـ loyalty system)
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/loyalty/config`;

        //  Fetch from upstream
        const response = await fetchLoyaltyConfig(basicAuth, apiUrl);

        if (!response.ok) {
            const text = await response.text();
            console.error(
                ` [${new Date().toISOString()}] [${requestId}] API error: ${response.status
                } - ${text}`
            );
            return NextResponse.json(
                {
                    error: "Failed to fetch loyalty configuration",
                    status: response.status,
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        //  Cache it
        CACHE.set(cacheKey, { data, timestamp: Date.now() });

        console.log(
            ` [${new Date().toISOString()}] [${requestId}] Loyalty config fetched successfully`
        );

        return NextResponse.json(data);
    } catch (error) {
        console.error(
            ` [${new Date().toISOString()}] [${requestId}] Critical error:`,
            error.message
        );
        return NextResponse.json(
            { error: error.message || "Internal server error", requestId },
            { status: 500 }
        );
    }
}
