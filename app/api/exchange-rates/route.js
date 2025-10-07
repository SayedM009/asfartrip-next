import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { from, to } = await request.json();

        if (!from || !to) {
            return NextResponse.json(
                { error: "Missing from or to currency" },
                { status: 400 }
            );
        }

        // استخدام exchangerate-api.com (مجاني - 1500 request/month)
        const apiKey = process.env.EXCHANGE_RATE_API_KEY;
        const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`;

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();

        if (data.result === "success") {
            return NextResponse.json({
                rate: data.conversion_rate,
                from: from,
                to: to,
                timestamp: Date.now(),
            });
        }

        throw new Error("Invalid API response");
    } catch (error) {
        console.error("Exchange rate API error:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch exchange rate",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
