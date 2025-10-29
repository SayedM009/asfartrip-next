import { NextResponse } from "next/server";
import {
    clearAPIToken,
    loginWithExistsCredintials,
} from "@/app/_libs/token-manager";

export async function POST(req) {
    const requestId = `ISSUE_TICKET_${Date.now()}`;
    try {
        const { booking_reference, transaction_id, payment_method } =
            await req.json();

        if (!booking_reference) throw new Error("Missing booking_reference");
        if (!transaction_id) throw new Error("Missing transaction_id");
        if (!payment_method) throw new Error("Missing payment_method");

        let token = await loginWithExistsCredintials();
        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;
        const basicAuth = Buffer.from(`${username}:${password}`).toString(
            "base64"
        );

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/issueticket`;

        const formData = new URLSearchParams({
            booking_reference,
            transaction_id,
            payment_method,
            api_token: token,
        });

        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${basicAuth}`,
            },
            body: formData.toString(),
        });

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error(`[${requestId}]`, err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// // app/api/flight/issue/route.js
// import { NextResponse } from "next/server";
// import {
//     clearAPIToken,
//     loginWithExistsCredintials,
// } from "@/app/_libs/token-manager";

// const REQUEST_TIMEOUT = 30000;

// async function makeIssueRequest(requestData, basicAuth, apiUrl) {
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

// function prepareIssueRequestData(params, token) {
//     return {
//         ...params,
//         api_token: token,
//     };
// }

// function validateIssueParams(params) {
//     if (!params.booking_reference) {
//         throw new Error("Missing booking_reference");
//     }
//     return true;
// }

// export async function POST(req) {
//     const requestId = `ISSUE_${Date.now()}_${Math.random()
//         .toString(36)
//         .substr(2, 9)}`;

//     try {
//         const params = await req.json();
//         validateIssueParams(params);

//         let token = await loginWithExistsCredintials();

//         const username = process.env.TP_USERNAME;
//         const password = process.env.TP_PASSWORD;
//         if (!username || !password) {
//             throw new Error("Missing API credentials configuration");
//         }
//         const basicAuth = Buffer.from(`${username}:${password}`).toString(
//             "base64"
//         );

//         const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/issue`;

//         let requestData = prepareIssueRequestData(params, token);

//         let response = await makeIssueRequest(requestData, basicAuth, apiUrl);

//         if (response.status === 401 || response.status === 403) {
//             await clearAPIToken();
//             const newToken = await loginWithExistsCredintials();
//             if (!newToken)
//                 throw new Error("Failed to obtain new authentication token");
//             requestData.api_token = newToken;
//             response = await makeIssueRequest(requestData, basicAuth, apiUrl);
//         }

//         if (!response.ok) {
//             const errorText = await response.text();
//             let errorMessage = "Failed to issue ticket";
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
//             `✅ [${new Date().toISOString()}] [${requestId}] Issue ticket successful`
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
