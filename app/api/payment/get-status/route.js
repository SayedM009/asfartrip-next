import { NextResponse } from "next/server";
import {
    clearAPIToken,
    loginWithExistsCredintials,
} from "@/app/_libs/token-manager";

const REQUEST_TIMEOUT = 30000;

async function makeRequest(requestData, basicAuth, apiUrl) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    try {
        const formData = new URLSearchParams(requestData).toString();
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${basicAuth}`,
            },
            body: formData,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === "AbortError")
            throw new Error("Timeout: Payment check");
        throw error;
    }
}

export async function POST(req) {
    const requestId = `PAYMENT_STATUS_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}`;
    try {
        const { bookingRef } = await req.json();
        if (!bookingRef) throw new Error("Missing bookingRef");

        let token = await loginWithExistsCredintials();
        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;
        if (!username || !password) throw new Error("Missing credentials");
        const basicAuth = Buffer.from(`${username}:${password}`).toString(
            "base64"
        );

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/getStatus`;
        let requestData = { bookingRef, api_token: token };

        let res = await makeRequest(requestData, basicAuth, apiUrl);
        if (res.status === 401 || res.status === 403) {
            await clearAPIToken();
            token = await loginWithExistsCredintials();
            requestData.api_token = token;
            res = await makeRequest(requestData, basicAuth, apiUrl);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error(`[${requestId}]`, err);
        return NextResponse.json(
            { error: err.message, requestId },
            { status: 500 }
        );
    }
}
