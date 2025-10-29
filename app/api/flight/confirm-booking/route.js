import { NextResponse } from "next/server";
import {
    clearAPIToken,
    loginWithExistsCredintials,
} from "@/app/_libs/token-manager";

const REQUEST_TIMEOUT = 30000;

async function makeConfirmRequest(requestData, basicAuth, apiUrl) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    try {
        const formData = new URLSearchParams(requestData).toString();
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${basicAuth}`,
            },
            body: formData,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return res;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === "AbortError")
            throw new Error("Timeout: Confirm flight");
        throw error;
    }
}

export async function POST(req) {
    const requestId = `CONFIRM_FLIGHT_${Date.now()}`;
    try {
        const { booking_reference } = await req.json();
        if (!booking_reference) throw new Error("Missing booking_reference");

        let token = await loginWithExistsCredintials();
        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;
        const basicAuth = Buffer.from(`${username}:${password}`).toString(
            "base64"
        );
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/confirmbooking`;

        let requestData = { booking_reference, api_token: token };

        let res = await makeConfirmRequest(requestData, basicAuth, apiUrl);
        if (res.status === 401 || res.status === 403) {
            await clearAPIToken();
            token = await loginWithExistsCredintials();
            requestData.api_token = token;
            res = await makeConfirmRequest(requestData, basicAuth, apiUrl);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error(`[${requestId}]`, err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// // app/api/flight/confirm/route.js
// import { NextResponse } from "next/server";
// import {
//     clearAPIToken,
//     loginWithExistsCredintials,
// } from "@/app/_libs/token-manager";

// const REQUEST_TIMEOUT = 30000;

// async function makeConfirmRequest(requestData, basicAuth, apiUrl) {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

//     try {
//         const response = await fetch(apiUrl, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Basic ${basicAuth}`,
//             },
//             body: JSON.stringify(requestData),
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

// function prepareConfirmRequestData(params, token) {
//     return {
//         ...params,
//         api_token: token,
//     };
// }

// function validateConfirmParams(params) {
//     if (!params.booking_reference) {
//         throw new Error("Missing booking_reference");
//     }
//     return true;
// }

// export async function POST(req) {
//     const requestId = `CONFIRM_${Date.now()}_${Math.random()
//         .toString(36)
//         .substr(2, 9)}`;

//     try {
//         const params = await req.json();
//         validateConfirmParams(params);

//         let token = await loginWithExistsCredintials();

//         const username = process.env.TP_USERNAME;
//         const password = process.env.TP_PASSWORD;
//         if (!username || !password) {
//             throw new Error("Missing API credentials configuration");
//         }
//         const basicAuth = Buffer.from(`${username}:${password}`).toString(
//             "base64"
//         );

//         const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/confirm`;

//         let requestData = prepareConfirmRequestData(params, token);

//         let response = await makeConfirmRequest(requestData, basicAuth, apiUrl);

//         if (response.status === 401 || response.status === 403) {
//             await clearAPIToken();
//             const newToken = await loginWithExistsCredintials();
//             if (!newToken)
//                 throw new Error("Failed to obtain new authentication token");
//             requestData.api_token = newToken;
//             response = await makeConfirmRequest(requestData, basicAuth, apiUrl);
//         }

//         if (!response.ok) {
//             const errorText = await response.text();
//             let errorMessage = "Failed to confirm booking";
//             try {
//                 const errorJson = JSON.parse(errorText);
//                 errorMessage =
//                     errorJson.message || errorJson.error || errorMessage;
//             } catch {}
//             console.error(
//                 `❌ [${new Date().toISOString()}] [${requestId}] API error: ${
//                     response.status
//                 } - ${errorMessage}`
//             );
//             return NextResponse.json(
//                 { error: errorMessage, requestId, status: response.status },
//                 { status: response.status }
//             );
//         }

//         const data = await response.json();
//         console.log(
//             `✅ [${new Date().toISOString()}] [${requestId}] Confirm booking successful`
//         );
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
