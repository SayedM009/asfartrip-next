import { NextResponse } from "next/server";
import {
    loginWithExistsCredintials,
    clearAPIToken,
} from "@/app/_libs/token-manager";

// Request timeout: 45 seconds (pricing checks can take longer)
const REQUEST_TIMEOUT = 45000;

/**
 * Makes air pricing request with timeout
 */
async function makeAirPricingRequest(requestData, basicAuth, apiUrl) {
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
            throw new Error("Pricing check timeout - please try again");
        }

        throw error;
    }
}

/**
 * Validates request payload
 */
function validatePayload(payload) {
    if (!payload.request || !payload.response) {
        throw new Error(
            "Missing required fields: request and response payloads are required"
        );
    }

    // Basic validation for base64 strings
    if (
        typeof payload.request !== "string" ||
        typeof payload.response !== "string"
    ) {
        throw new Error(
            "Invalid payload format: request and response must be strings"
        );
    }

    return true;
}

export async function POST(req) {
    const requestId = `PRICE_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

    try {
        console.log(
            `💰 [${new Date().toISOString()}] [${requestId}] Air pricing request received`
        );

        // Parse request body
        const payload = await req.json();

        // Validate payload
        validatePayload(payload);

        console.log(
            `✅ [${new Date().toISOString()}] [${requestId}] Payload validated`
        );

        // Always get a fresh token for each pricing request to avoid reuse issues
        console.log(
            `🔐 [${new Date().toISOString()}] [${requestId}] Getting fresh token...`
        );
        let token = await loginWithExistsCredintials();

        // Prepare credentials
        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;

        if (!username || !password) {
            throw new Error("Missing API credentials configuration");
        }

        const basicAuth = Buffer.from(`${username}:${password}`).toString(
            "base64"
        );
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/airpricing`;

        // Prepare request data
        let requestData = {
            request: payload.request,
            response: payload.response,
            api_token: token,
        };

        console.log(
            `🔍 [${new Date().toISOString()}] [${requestId}] Checking flight pricing...`
        );

        // Make first request
        let response = await makeAirPricingRequest(
            requestData,
            basicAuth,
            apiUrl
        );

        console.log(
            `📡 [${new Date().toISOString()}] [${requestId}] Response status: ${
                response.status
            }`
        );

        // If authentication failed, try ONE more time with fresh token
        if (response.status === 401 || response.status === 403) {
            console.log(
                `⚠️ [${new Date().toISOString()}] [${requestId}] Authentication failed, forcing token refresh...`
            );

            // Force clear and get new fresh token
            await clearAPIToken();
            token = await loginWithExistsCredintials();

            // Update request data with new token
            requestData.api_token = token;

            console.log(
                `🔄 [${new Date().toISOString()}] [${requestId}] Retrying with fresh token...`
            );

            // Retry ONCE
            response = await makeAirPricingRequest(
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
            let errorMessage = "Failed to check flight pricing";

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

        console.log(
            `📊 [${new Date().toISOString()}] [${requestId}] Pricing response:`,
            {
                status: data.Status,
                totalPrice: data.TotalPrice,
                currency: data.Currency,
                hasSessionId: !!data.session_id,
                hasTempId: !!data.temp_id,
            }
        );

        // Validate response structure
        if (!data.Status) {
            console.warn(
                `⚠️ [${new Date().toISOString()}] [${requestId}] Invalid response structure`
            );
            return NextResponse.json(
                {
                    error: "Invalid pricing response from server",
                    requestId: requestId,
                },
                { status: 500 }
            );
        }

        // Handle different status cases
        switch (data.Status) {
            case "Success":
                console.log(
                    `✅ [${new Date().toISOString()}] [${requestId}] Pricing successful: ${
                        data.TotalPrice
                    } ${data.Currency}`
                );

                // Validate required fields for success
                if (!data.session_id || !data.temp_id) {
                    console.error(
                        `❌ [${new Date().toISOString()}] [${requestId}] Missing session_id or temp_id in success response`
                    );
                    return NextResponse.json(
                        {
                            error: "Invalid pricing response: missing session data",
                            requestId: requestId,
                        },
                        { status: 500 }
                    );
                }

                return NextResponse.json({
                    status: "success",
                    data: {
                        sessionId: data.session_id,
                        tempId: data.temp_id,
                        basePrice: data.BasePrice,
                        taxPrice: data.TaxPrice,
                        totalPrice: data.TotalPrice,
                        currency: data.Currency,
                        baggageData: data.Baggage_data,
                        fareRules: data.FareRules || [],
                    },
                    requestId: requestId,
                });

            case "PriceChanged":
            case "Price Changed":
                console.log(
                    `⚠️ [${new Date().toISOString()}] [${requestId}] Price changed`
                );
                return NextResponse.json({
                    status: "price_changed",
                    data: {
                        oldPrice: payload.originalPrice, // if you passed it
                        newPrice: data.TotalPrice,
                        basePrice: data.BasePrice,
                        taxPrice: data.TaxPrice,
                        totalPrice: data.TotalPrice,
                        currency: data.Currency,
                        sessionId: data.session_id,
                        tempId: data.temp_id,
                    },
                    message:
                        "Flight price has changed. Please review the new price.",
                    requestId: requestId,
                });

            case "NotAvailable":
            case "Not Available":
            case "Unavailable":
                console.log(
                    `❌ [${new Date().toISOString()}] [${requestId}] Flight not available`
                );
                return NextResponse.json({
                    status: "not_available",
                    message:
                        "This flight is no longer available. Please search again.",
                    requestId: requestId,
                });

            case "Error":
            case "Failed":
                console.error(
                    `❌ [${new Date().toISOString()}] [${requestId}] Pricing failed:`,
                    data.Message || data.message
                );
                return NextResponse.json(
                    {
                        status: "error",
                        error:
                            data.Message ||
                            data.message ||
                            "Pricing check failed",
                        requestId: requestId,
                    },
                    { status: 400 }
                );

            default:
                console.warn(
                    `⚠️ [${new Date().toISOString()}] [${requestId}] Unknown status: ${
                        data.Status
                    }`
                );
                return NextResponse.json({
                    status: "unknown",
                    data: data,
                    message: `Unexpected status: ${data.Status}`,
                    requestId: requestId,
                });
        }
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

// import { NextResponse } from "next/server";
// import { getValidToken, clearAPIToken } from "@/app/_libs/token-manager";

// // Request timeout: 45 seconds (pricing checks can take longer)
// const REQUEST_TIMEOUT = 45000;

// /**
//  * Makes air pricing request with timeout
//  */
// async function makeAirPricingRequest(requestData, basicAuth, apiUrl) {
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
//             throw new Error("Pricing check timeout - please try again");
//         }

//         throw error;
//     }
// }

// /**
//  * Validates request payload
//  */
// function validatePayload(payload) {
//     if (!payload.request || !payload.response) {
//         throw new Error(
//             "Missing required fields: request and response payloads are required"
//         );
//     }

//     // Basic validation for base64 strings
//     if (
//         typeof payload.request !== "string" ||
//         typeof payload.response !== "string"
//     ) {
//         throw new Error(
//             "Invalid payload format: request and response must be strings"
//         );
//     }

//     return true;
// }

// export async function POST(req) {
//     const requestId = `PRICE_${Date.now()}_${Math.random()
//         .toString(36)
//         .substr(2, 9)}`;

//     try {
//         console.log(
//             `💰 [${new Date().toISOString()}] [${requestId}] Air pricing request received`
//         );

//         // Parse request body
//         const payload = await req.json();

//         // Validate payload
//         validatePayload(payload);

//         console.log(
//             `✅ [${new Date().toISOString()}] [${requestId}] Payload validated`
//         );

//         // Get valid token (will refresh if needed)
//         let token = await getValidToken();

//         // Prepare credentials
//         const username = process.env.TP_USERNAME;
//         const password = process.env.TP_PASSWORD;

//         if (!username || !password) {
//             throw new Error("Missing API credentials configuration");
//         }

//         const basicAuth = Buffer.from(`${username}:${password}`).toString(
//             "base64"
//         );
//         const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/airpricing`;

//         // Prepare request data
//         let requestData = {
//             request: payload.request,
//             response: payload.response,
//             api_token: token,
//         };

//         console.log(
//             `🔍 [${new Date().toISOString()}] [${requestId}] Checking flight pricing...`
//         );

//         // Make first request
//         let response = await makeAirPricingRequest(
//             requestData,
//             basicAuth,
//             apiUrl
//         );

//         console.log(
//             `📡 [${new Date().toISOString()}] [${requestId}] Response status: ${
//                 response.status
//             }`
//         );

//         // If authentication failed, try ONE more time with fresh token
//         if (response.status === 401 || response.status === 403) {
//             console.log(
//                 `⚠️ [${new Date().toISOString()}] [${requestId}] Authentication failed, forcing token refresh...`
//             );

//             // Force clear and refresh token
//             await clearAPIToken();
//             token = await getValidToken();

//             // Update request data with new token
//             requestData.api_token = token;

//             console.log(
//                 `🔄 [${new Date().toISOString()}] [${requestId}] Retrying with fresh token...`
//             );

//             // Retry ONCE
//             response = await makeAirPricingRequest(
//                 requestData,
//                 basicAuth,
//                 apiUrl
//             );

//             console.log(
//                 `📡 [${new Date().toISOString()}] [${requestId}] Retry response status: ${
//                     response.status
//                 }`
//             );
//         }

//         // Handle non-OK response
//         if (!response.ok) {
//             let errorMessage = "Failed to check flight pricing";

//             try {
//                 const errorText = await response.text();
//                 console.error(
//                     `❌ [${new Date().toISOString()}] [${requestId}] API Error (${
//                         response.status
//                     }):`,
//                     errorText
//                 );

//                 // Try to parse error message
//                 try {
//                     const errorJson = JSON.parse(errorText);
//                     errorMessage =
//                         errorJson.message || errorJson.error || errorMessage;
//                 } catch {
//                     errorMessage = errorText || errorMessage;
//                 }
//             } catch (e) {
//                 console.error(
//                     `❌ [${new Date().toISOString()}] [${requestId}] Could not read error response`
//                 );
//             }

//             return NextResponse.json(
//                 {
//                     error: errorMessage,
//                     requestId: requestId,
//                     status: response.status,
//                 },
//                 { status: response.status }
//             );
//         }

//         // Parse successful response
//         const data = await response.json();

//         console.log(
//             `📊 [${new Date().toISOString()}] [${requestId}] Pricing response:`,
//             {
//                 status: data.Status,
//                 totalPrice: data.TotalPrice,
//                 currency: data.Currency,
//                 hasSessionId: !!data.session_id,
//                 hasTempId: !!data.temp_id,
//             }
//         );

//         // Validate response structure
//         if (!data.Status) {
//             console.warn(
//                 `⚠️ [${new Date().toISOString()}] [${requestId}] Invalid response structure`
//             );
//             return NextResponse.json(
//                 {
//                     error: "Invalid pricing response from server",
//                     requestId: requestId,
//                 },
//                 { status: 500 }
//             );
//         }

//         // Handle different status cases
//         switch (data.Status) {
//             case "Success":
//                 console.log(
//                     `✅ [${new Date().toISOString()}] [${requestId}] Pricing successful: ${
//                         data.TotalPrice
//                     } ${data.Currency}`
//                 );

//                 // Validate required fields for success
//                 if (!data.session_id || !data.temp_id) {
//                     console.error(
//                         `❌ [${new Date().toISOString()}] [${requestId}] Missing session_id or temp_id in success response`
//                     );
//                     return NextResponse.json(
//                         {
//                             error: "Invalid pricing response: missing session data",
//                             requestId: requestId,
//                         },
//                         { status: 500 }
//                     );
//                 }

//                 return NextResponse.json({
//                     status: "success",
//                     data: {
//                         sessionId: data.session_id,
//                         tempId: data.temp_id,
//                         basePrice: data.BasePrice,
//                         taxPrice: data.TaxPrice,
//                         totalPrice: data.TotalPrice,
//                         currency: data.Currency,
//                         baggageData: data.Baggage_data,
//                         fareRules: data.FareRules || [],
//                     },
//                     requestId: requestId,
//                 });

//             case "PriceChanged":
//             case "Price Changed":
//                 console.log(
//                     `⚠️ [${new Date().toISOString()}] [${requestId}] Price changed`
//                 );
//                 return NextResponse.json({
//                     status: "price_changed",
//                     data: {
//                         oldPrice: payload.originalPrice, // if you passed it
//                         newPrice: data.TotalPrice,
//                         basePrice: data.BasePrice,
//                         taxPrice: data.TaxPrice,
//                         totalPrice: data.TotalPrice,
//                         currency: data.Currency,
//                         sessionId: data.session_id,
//                         tempId: data.temp_id,
//                     },
//                     message:
//                         "Flight price has changed. Please review the new price.",
//                     requestId: requestId,
//                 });

//             case "NotAvailable":
//             case "Not Available":
//             case "Unavailable":
//                 console.log(
//                     `❌ [${new Date().toISOString()}] [${requestId}] Flight not available`
//                 );
//                 return NextResponse.json({
//                     status: "not_available",
//                     message:
//                         "This flight is no longer available. Please search again.",
//                     requestId: requestId,
//                 });

//             case "Error":
//             case "Failed":
//                 console.error(
//                     `❌ [${new Date().toISOString()}] [${requestId}] Pricing failed:`,
//                     data.Message || data.message
//                 );
//                 return NextResponse.json(
//                     {
//                         status: "error",
//                         error:
//                             data.Message ||
//                             data.message ||
//                             "Pricing check failed",
//                         requestId: requestId,
//                     },
//                     { status: 400 }
//                 );

//             default:
//                 console.warn(
//                     `⚠️ [${new Date().toISOString()}] [${requestId}] Unknown status: ${
//                         data.Status
//                     }`
//                 );
//                 return NextResponse.json({
//                     status: "unknown",
//                     data: data,
//                     message: `Unexpected status: ${data.Status}`,
//                     requestId: requestId,
//                 });
//         }
//     } catch (error) {
//         console.error(
//             `❌ [${new Date().toISOString()}] [${requestId}] Critical error:`,
//             error.message
//         );
//         console.error(error);

//         return NextResponse.json(
//             {
//                 error: error.message || "Internal server error",
//                 requestId: requestId,
//             },
//             { status: 500 }
//         );
//     }
// }
