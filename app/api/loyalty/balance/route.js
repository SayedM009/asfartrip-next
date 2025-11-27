import { NextResponse } from "next/server";

// 🕒 Cache لمدة 10 دقائق
const CACHE = new Map();
const CACHE_TTL = 60 * 1000;

// ⏱️ مهلة الطلب
const REQUEST_TIMEOUT = 30000;

// 🧩 دالة لجلب رصيد العميل من الـ API الخارجي
async function fetchUserBalance(basicAuth, apiUrl) {
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
            throw new Error("Timeout: fetching loyalty balance");
        }
        throw error;
    }
}

// 🧠 Route Handler
export async function GET(req) {
    const requestId = `BALANCE_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;

    try {
        // استخراج user_id من الـ query params
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("user_id");

        if (!userId) {
            throw new Error("Missing required parameter: user_id");
        }

        //  تحقق من الكاش أولًا
        const cacheKey = `BALANCE_${userId}`;
        const cached = CACHE.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log(
                ` [${new Date().toISOString()}] [${requestId}] Returning cached balance for user ${userId}`
            );
            return NextResponse.json(cached.data);
        }

        //  إعداد بيانات المصادقة
        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;

        if (!username || !password) {
            throw new Error("Missing API credentials configuration");
        }

        const basicAuth = Buffer.from(`${username}:${password}`).toString(
            "base64"
        );

        //  بناء رابط الـ API الخارجي
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL
            }/api/loyalty/balance?user_id=${encodeURIComponent(userId)}`;

        //  تنفيذ الطلب
        const response = await fetchUserBalance(basicAuth, apiUrl);

        if (!response.ok) {
            const text = await response.text();
            console.error(
                ` [${new Date().toISOString()}] [${requestId}] API error: ${response.status
                } - ${text}`
            );
            return NextResponse.json(
                {
                    error: "Failed to fetch user balance",
                    status: response.status,
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        //  حفظ النتيجة في الكاش
        CACHE.set(cacheKey, { data, timestamp: Date.now() });

        console.log(
            ` [${new Date().toISOString()}] [${requestId}] Loyalty balance fetched successfully for user ${userId}`
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
