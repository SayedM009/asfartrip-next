// app/api/flight/save-passengers/route.js

// app/api/flight/save-passengers/route.js
import { NextResponse } from "next/server";
import {
    clearAPIToken,
    loginWithExistsCredintials,
} from "@/app/_libs/token-manager";

const REQUEST_TIMEOUT = 30000; // 30 seconds timeout

async function makeSavePassengersRequest(requestData, basicAuth, apiUrl) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
        const formData = new URLSearchParams();
        for (const [key, value] of Object.entries(requestData)) {
            if (key === "TravelerDetails") {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value);
            }
        }

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${basicAuth}`,
            },
            body: formData.toString(),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === "AbortError") {
            throw new Error("Request timeout - please try again");
        }
        throw error;
    }
}

function validateSavePassengersParams(params) {
    const required = ["session_id", "temp_id", "amount", "TravelerDetails"];
    const missing = required.filter((field) => !params[field]);
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(", ")}`);
    }
    return true;
}

export async function POST(req) {
    const requestId = `SAVE_PASSENGERS_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

    try {
        const params = await req.json();
        validateSavePassengersParams(params);

        let token = await loginWithExistsCredintials();

        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;
        if (!username || !password) {
            throw new Error("Missing API credentials configuration");
        }
        const basicAuth = Buffer.from(`${username}:${password}`).toString(
            "base64"
        );

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/save`;

        let requestData = {
            ...params,
            api_token: token,
        };

        let response = await makeSavePassengersRequest(
            requestData,
            basicAuth,
            apiUrl
        );

        if (response.status === 401 || response.status === 403) {
            await clearAPIToken();
            const newToken = await loginWithExistsCredintials();
            if (!newToken) {
                throw new Error("Failed to obtain new authentication token");
            }
            requestData.api_token = newToken;
            response = await makeSavePassengersRequest(
                requestData,
                basicAuth,
                apiUrl
            );
        }

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = "Failed to save passengers";
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage =
                    errorJson.message || errorJson.error || errorMessage;
            } catch {}
            console.error(
                `❌ [${new Date().toISOString()}] [${requestId}] API error: ${
                    response.status
                } - ${errorMessage}`
            );
            return NextResponse.json(
                { error: errorMessage, requestId, status: response.status },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log(
            `✅ [${new Date().toISOString()}] [${requestId}] Passengers saved successfully`
        );
        console.log(data);
        return NextResponse.json(data);
    } catch (error) {
        console.error(
            `❌ [${new Date().toISOString()}] [${requestId}] Critical error:`,
            error.message
        );
        return NextResponse.json(
            { error: error.message || "Internal server error", requestId },
            { status: 500 }
        );
    }
}
