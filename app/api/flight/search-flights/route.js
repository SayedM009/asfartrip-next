import { NextResponse } from "next/server";
import {
    clearAPIToken,
    loginWithExistsCredintials,
} from "@/app/_libs/token-manager";

// Request timeout: 30 seconds
const REQUEST_TIMEOUT = 30000;

// Simple in-memory cache
const CACHE = new Map();
const CACHE_TTL = 60 * 1000; // 1 minute

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

    if (params.type === "R" && params.return_date) {
        requestData.return_date = params.return_date;
    }

    return requestData;
}

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
        const params = await req.json();
        validateParams(params);

        // Generate cache key based on search params
        const cacheKey = JSON.stringify(params);
        const cached = CACHE.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log(
                `💾 [${new Date().toISOString()}] [${requestId}] Returning cached results`
            );
            return NextResponse.json(cached.data);
        }

        // Always get a fresh token for each search to avoid reuse issues
        console.log(
            `🔐 [${new Date().toISOString()}] [${requestId}] Getting fresh token...`
        );
        let token = await loginWithExistsCredintials();

        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;

        if (!username || !password) {
            throw new Error("Missing API credentials configuration");
        }

        const basicAuth = Buffer.from(`${username}:${password}`).toString(
            "base64"
        );
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/search`;

        let requestData = prepareRequestData(params, token);

        let response = await makeFlightSearchRequest(
            requestData,
            basicAuth,
            apiUrl
        );

        // Keep retry logic as fallback, though unlikely with fresh token
        if (response.status === 401 || response.status === 403) {
            console.log(
                `⚠️ [${new Date().toISOString()}] [${requestId}] Auth failed, retrying with new token...`
            );
            await clearAPIToken(); // Clean up if any old cookies
            const newToken = await loginWithExistsCredintials();

            if (!newToken) {
                throw new Error("Failed to obtain new authentication token");
            }

            requestData.api_token = newToken;
            response = await makeFlightSearchRequest(
                requestData,
                basicAuth,
                apiUrl
            );
        }

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = "Failed to search flights";

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

        // Save to cache
        CACHE.set(cacheKey, { data, timestamp: Date.now() });

        console.log(
            `✅ [${new Date().toISOString()}] [${requestId}] Flight search successful`
        );

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
// import { NextResponse } from "next/server";
// import {
//     getValidToken,
//     clearAPIToken,
//     setApiToken,
//     loginWithExistsCredintials,
// } from "@/app/_libs/token-manager";

// // Request timeout: 30 seconds
// const REQUEST_TIMEOUT = 30000;

// // Simple in-memory cache
// const CACHE = new Map();
// const CACHE_TTL = 60 * 1000; // 1 دقيقة

// async function makeFlightSearchRequest(requestData, basicAuth, apiUrl) {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

//     try {
//         const response = await fetch(apiUrl, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded",
//                 Authorization: `Basic ${basicAuth}`,
//             },
//             body: new URLSearchParams(requestData),
//             signal: controller.signal,
//         });

//         clearTimeout(timeoutId);
//         return response;
//     } catch (error) {
//         clearTimeout(timeoutId);

//         if (error.name === "AbortError") {
//             throw new Error("Request timeout - please try again");
//         }

//         throw error;
//     }
// }

// function prepareRequestData(params, token) {
//     const requestData = {
//         origin: params.origin,
//         destination: params.destination,
//         depart_date: params.depart_date,
//         ADT: params.ADT || 1,
//         CHD: params.CHD || 0,
//         INF: params.INF || 0,
//         class: `${params.class[0].toUpperCase()}${params.class.slice(1)}`,
//         type: params.type || "O",
//         api_token: token,
//     };

//     if (params.type === "R" && params.return_date) {
//         requestData.return_date = params.return_date;
//     }

//     return requestData;
// }

// function validateParams(params) {
//     const required = ["origin", "destination", "depart_date", "class"];
//     const missing = required.filter((field) => !params[field]);

//     if (missing.length > 0) {
//         throw new Error(`Missing required fields: ${missing.join(", ")}`);
//     }

//     return true;
// }

// export async function POST(req) {
//     const requestId = `REQ_${Date.now()}_${Math.random()
//         .toString(36)
//         .substr(2, 9)}`;

//     try {
//         const params = await req.json();
//         validateParams(params);

//         // Generate cache key based on search params
//         const cacheKey = JSON.stringify(params);
//         const cached = CACHE.get(cacheKey);

//         if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
//             console.log(
//                 `💾 [${new Date().toISOString()}] [${requestId}] Returning cached results`
//             );
//             return NextResponse.json(cached.data);
//         }

//         // Get valid token
//         let token = await getValidToken();

//         const username = process.env.TP_USERNAME;
//         const password = process.env.TP_PASSWORD;

//         if (!username || !password) {
//             throw new Error("Missing API credentials configuration");
//         }

//         const basicAuth = Buffer.from(`${username}:${password}`).toString(
//             "base64"
//         );
//         const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/search`;

//         let requestData = prepareRequestData(params, token);

//         let response = await makeFlightSearchRequest(
//             requestData,
//             basicAuth,
//             apiUrl
//         );

//         if (response.status === 401 || response.status === 403) {
//             await clearAPIToken();
//             const newToken = await loginWithExistsCredintials();

//             if (!newToken)
//                 throw new Error("Failed to refresh authentication token");

//             await setApiToken(newToken);
//             requestData.api_token = newToken;

//             response = await makeFlightSearchRequest(
//                 requestData,
//                 basicAuth,
//                 apiUrl
//             );
//         }

//         if (!response.ok) {
//             const errorText = await response.text();
//             let errorMessage = "Failed to search flights";

//             try {
//                 const errorJson = JSON.parse(errorText);
//                 errorMessage =
//                     errorJson.message || errorJson.error || errorMessage;
//             } catch {}

//             return NextResponse.json(
//                 { error: errorMessage, requestId, status: response.status },
//                 { status: response.status }
//             );
//         }

//         const data = await response.json();

//         // Save to cache
//         CACHE.set(cacheKey, { data, timestamp: Date.now() });

//         return NextResponse.json(data);
//     } catch (error) {
//         console.error(
//             `❌ [${new Date().toISOString()}] [${requestId}] Critical error:`,
//             error.message
//         );
//         return NextResponse.json(
//             { error: error.message || "Internal server error", requestId },
//             { status: 500 }
//         );
//     }
// }
