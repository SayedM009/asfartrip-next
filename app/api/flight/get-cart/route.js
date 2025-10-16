// app/api/getCart/route.js
import { NextResponse } from "next/server";
import {
    loginWithExistsCredintials,
    clearAPIToken,
} from "@/app/_libs/token-manager";

const REQUEST_TIMEOUT = 30000; // 30 ثانية كحد أقصى

async function makeCartRequest(requestData, basicAuth, apiUrl) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${basicAuth}`,
            },
            body: new URLSearchParams(requestData),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === "AbortError") {
            throw new Error("Cart request timeout - please try again");
        }
        throw error;
    }
}

export async function POST(req) {
    const requestId = `CART_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

    try {
        const payload = await req.json();
        const sessionId = payload.session_id;

        if (!sessionId) {
            return NextResponse.json(
                { error: "session_id is required" },
                { status: 400 }
            );
        }

        // Always get a fresh token for each cart request to avoid reuse issues
        console.log(
            `🔐 [${new Date().toISOString()}] [${requestId}] Getting fresh token...`
        );
        let token = await loginWithExistsCredintials();

        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;
        const basicAuth = Buffer.from(`${username}:${password}`).toString(
            "base64"
        );
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/getCart`;

        let requestData = {
            session_id: sessionId,
            api_token: token,
        };

        let response = await makeCartRequest(requestData, basicAuth, apiUrl);

        // Retry if token invalid
        if (response.status === 401 || response.status === 403) {
            console.log(
                `⚠️ [${new Date().toISOString()}] [${requestId}] Auth failed, retrying with new token...`
            );
            await clearAPIToken();
            token = await loginWithExistsCredintials();
            requestData.api_token = token;
            response = await makeCartRequest(requestData, basicAuth, apiUrl);
        }

        if (!response.ok) {
            const errorText = await response
                .text()
                .catch(() => "Unknown error");
            return NextResponse.json(
                { error: errorText, status: response.status },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json({ status: "success", data, requestId });
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error", requestId },
            { status: 500 }
        );
    }
}
