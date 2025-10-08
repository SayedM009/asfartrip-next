import { NextResponse } from "next/server";
import {
    getValidToken,
    clearAPIToken,
    setApiToken,
} from "@/app/_libs/token-manager";

// Request timeout: 30 seconds
const REQUEST_TIMEOUT = 30000;

/**
 * Makes flight search request with timeout
 */
async function makeFlightSearchRequest(requestData, basicAuth, apiUrl) {
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
            throw new Error("Request timeout - please try again");
        }

        throw error;
    }
}

/**
 * Prepares request data from params
 */
function prepareRequestData(params, token) {
    const requestData = {
        origin: params.origin,
        destination: params.destination,
        depart_date: params.depart_date,
        ADT: params.ADT || 1,
        CHD: params.CHD || 0,
        INF: params.INF || 0,
        class: `${params.class[0].toUpperCase()}${params.class.slice(1)}`,
        type: params.type || "O",
        api_token: token,
    };

    // Add return date for round trips
    if (params.type === "R" && params.return_date) {
        requestData.return_date = params.return_date;
    }

    return requestData;
}

/**
 * Validates search parameters
 */
function validateParams(params) {
    const required = ["origin", "destination", "depart_date", "class"];
    const missing = required.filter((field) => !params[field]);

    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(", ")}`);
    }

    return true;
}

export async function POST(req) {
    const requestId = `REQ_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

    try {
        console.log(
            `📥 [${new Date().toISOString()}] [${requestId}] Search request received`
        );

        // Parse and validate parameters
        const params = await req.json();
        validateParams(params);

        console.log(
            `🔍 [${new Date().toISOString()}] [${requestId}] Params: ${
                params.origin
            } → ${params.destination}, ${params.depart_date}`
        );

        // Get valid token (will refresh if needed)
        let token = await getValidToken();

        // Prepare credentials and URL
        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;

        if (!username || !password) {
            throw new Error("Missing API credentials configuration");
        }

        const basicAuth = Buffer.from(`${username}:${password}`).toString(
            "base64"
        );
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/search`;

        // Prepare request data
        let requestData = prepareRequestData(params, token);

        // Make first request
        let response = await makeFlightSearchRequest(
            requestData,
            basicAuth,
            apiUrl
        );

        // If authentication failed, try ONE more time with fresh token
        if (response.status === 401 || response.status === 403) {
            console.log(
                `⚠️ [${new Date().toISOString()}] [${requestId}] Authentication failed, forcing token refresh...`
            );

            // Force clear and get new token
            await clearAPIToken();
            const newToken = await loginWithExistsCredintials();

            if (!newToken) {
                throw new Error("Failed to refresh authentication token");
            }

            await setApiToken(newToken);

            // Update request data with new token
            requestData.api_token = newToken;

            console.log(
                `🔄 [${new Date().toISOString()}] [${requestId}] Retrying with fresh token...`
            );

            // Retry ONCE
            response = await makeFlightSearchRequest(
                requestData,
                basicAuth,
                apiUrl
            );

            console.log(
                `📡 [${new Date().toISOString()}] [${requestId}] Retry response status: ${
                    response.status
                }`
            );
        }

        // Handle non-OK response
        if (!response.ok) {
            let errorMessage = "Failed to search flights";

            try {
                const errorText = await response.text();
                console.error(
                    `❌ [${new Date().toISOString()}] [${requestId}] API Error (${
                        response.status
                    }):`,
                    errorText
                );

                // Try to parse error message
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage =
                        errorJson.message || errorJson.error || errorMessage;
                } catch {
                    errorMessage = errorText || errorMessage;
                }
            } catch (e) {
                console.error(
                    `❌ [${new Date().toISOString()}] [${requestId}] Could not read error response`
                );
            }

            return NextResponse.json(
                {
                    error: errorMessage,
                    requestId: requestId,
                    status: response.status,
                },
                { status: response.status }
            );
        }

        // Parse successful response
        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error(
            `❌ [${new Date().toISOString()}] [${requestId}] Critical error:`,
            error.message
        );
        console.error(error);

        return NextResponse.json(
            {
                error: error.message || "Internal server error",
                requestId: requestId,
            },
            { status: 500 }
        );
    }
}
