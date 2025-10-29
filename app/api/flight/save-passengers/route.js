import { NextResponse } from "next/server";
import {
    clearAPIToken,
    loginWithExistsCredintials,
} from "@/app/_libs/token-manager";

const REQUEST_TIMEOUT = 30000; // ⏱️ 30 ثانية
const MAX_RETRIES = 1; // 🔁 محاولة إضافية واحدة

async function makeSaveRequest(formData, basicAuth, apiUrl) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${basicAuth}`,
            },
            body: formData.toString(),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const text = await res.text();
        let data;

        try {
            data = JSON.parse(text);
        } catch {
            console.warn("⚠️ Response is not valid JSON, treating as text");
            data = { message: text, raw_response: text };
        }

        return { res, data };
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === "AbortError") {
            throw new Error("Timeout: save-passengers request took too long");
        }
        throw error;
    }
}

export async function POST(req) {
    const requestId = `SAVE_${Date.now()}`;
    console.log(`[${requestId}] 📥 Received save-passengers request`);

    try {
        const bodyText = await req.text();
        const params = Object.fromEntries(new URLSearchParams(bodyText));

        console.log(`[${requestId}] 📋 Parsed params:`, {
            session_id: params.session_id,
            temp_id: params.temp_id,
            amount: params.amount,
            hasTravelerDetails: !!params.TravelerDetails,
        });

        // ✅ التحقق من TravelerDetails
        if (!params.TravelerDetails) {
            console.error(`[${requestId}] ❌ Missing TravelerDetails`);
            return NextResponse.json(
                {
                    status: "error",
                    message: "TravelerDetails is required",
                },
                { status: 400 }
            );
        }

        // ✅ تحويل TravelerDetails لـ JSON string إذا كان object
        if (typeof params.TravelerDetails === "object") {
            console.log(
                `[${requestId}] 🔄 Converting TravelerDetails object to JSON string`
            );
            params.TravelerDetails = JSON.stringify(params.TravelerDetails);
        }

        // ✅ التحقق من أن TravelerDetails هو JSON صحيح
        try {
            JSON.parse(params.TravelerDetails);
        } catch (e) {
            console.error(
                `[${requestId}] ❌ Invalid TravelerDetails JSON:`,
                e.message
            );
            return NextResponse.json(
                {
                    status: "error",
                    message: "TravelerDetails must be valid JSON",
                },
                { status: 400 }
            );
        }

        // ✅ الحصول على credentials
        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;

        if (!username || !password) {
            console.error(`[${requestId}] ❌ Missing API credentials`);
            return NextResponse.json(
                {
                    status: "error",
                    message: "API credentials not configured",
                },
                { status: 500 }
            );
        }

        const token = await loginWithExistsCredintials();
        const basicAuth = Buffer.from(`${username}:${password}`).toString(
            "base64"
        );
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/save`;

        console.log(
            `[${requestId}] 🔐 Using token: ${token?.substring(0, 10)}...`
        );

        const formData = new URLSearchParams({
            ...params,
            api_token: token,
        });

        // 🔁 محاولة الطلب مع Retry
        let attempt = 0;
        let response, data, lastError;

        while (attempt <= MAX_RETRIES) {
            try {
                console.log(
                    `[${requestId}] 🚀 Attempt ${attempt + 1}/${
                        MAX_RETRIES + 1
                    }`
                );

                const result = await makeSaveRequest(
                    formData,
                    basicAuth,
                    apiUrl
                );
                response = result.res;
                data = result.data;

                console.log(
                    `[${requestId}] 📨 Response status: ${response.status}`
                );
                console.log(`[${requestId}] 📨 Response data:`, data);

                // ✅ نجح الطلب
                if (response.ok && data?.status === "success") {
                    console.log(`[${requestId}] ✅ Save successful:`, {
                        booking_reference: data.booking_reference,
                        gateway: data.gateway?.name || "N/A",
                    });
                    return NextResponse.json(data);
                }

                // ⚠️ استجابة غير متوقعة
                if (response.ok && data?.status !== "success") {
                    console.warn(
                        `[${requestId}] ⚠️ Unexpected response status: ${data?.status}`
                    );
                }

                // ❌ خطأ من API
                const errorMessage =
                    data?.message || data?.error || "Save failed";
                throw new Error(errorMessage);
            } catch (error) {
                lastError = error;
                console.error(
                    `[${requestId}] ❌ Attempt ${attempt + 1} failed:`,
                    error.message
                );

                // 🔄 إذا كان الخطأ بسبب token منتهي، نحاول refresh
                if (
                    error.message?.includes("token") ||
                    error.message?.includes("unauthorized")
                ) {
                    console.log(
                        `[${requestId}] 🔄 Token might be expired, clearing and retrying...`
                    );
                    await clearAPIToken();
                }

                // إذا وصلنا للحد الأقصى من المحاولات
                if (attempt === MAX_RETRIES) {
                    console.error(
                        `[${requestId}] ❌ All retry attempts failed`
                    );
                    throw lastError;
                }

                // انتظار قصير قبل المحاولة التالية
                await new Promise((resolve) => setTimeout(resolve, 1000));
                attempt++;
            }
        }

        // إذا خرجنا من الـ loop بدون نجاح
        throw lastError || new Error("Unknown error occurred");
    } catch (err) {
        console.error(`[${requestId}] ❌ Fatal error:`, {
            message: err.message,
            stack: err.stack,
        });

        return NextResponse.json(
            {
                status: "error",
                message: err.message || "An unexpected error occurred",
                error: err.message,
            },
            { status: 500 }
        );
    }
}
// import { NextResponse } from "next/server";
// import {
//     clearAPIToken,
//     loginWithExistsCredintials,
// } from "@/app/_libs/token-manager";

// const REQUEST_TIMEOUT = 30000; // ⏱️ 30 ثانية زي النظام القديم
// const MAX_RETRIES = 1; // 🔁 نحاول مرة واحدة إضافية عند الفشل

// async function makeSaveRequest(formData, basicAuth, apiUrl) {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

//     try {
//         const res = await fetch(apiUrl, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded",
//                 Authorization: `Basic ${basicAuth}`,
//             },
//             body: formData.toString(),
//             signal: controller.signal,
//         });

//         clearTimeout(timeoutId);

//         const text = await res.text();
//         let data;
//         try {
//             data = JSON.parse(text);
//         } catch {
//             data = { message: text };
//         }

//         return { res, data };
//     } catch (error) {
//         clearTimeout(timeoutId);
//         if (error.name === "AbortError") {
//             throw new Error("Timeout: save-passengers request took too long");
//         }
//         throw error;
//     }
// }

// export async function POST(req) {
//     const requestId = `SAVE_PASSENGERS_${Date.now()}`;
//     try {
//         const bodyText = await req.text();
//         const params = Object.fromEntries(new URLSearchParams(bodyText));

//         // TravelerDetails لازم تفضل string JSON
//         if (typeof params.TravelerDetails !== "string") {
//             params.TravelerDetails = JSON.stringify(params.TravelerDetails);
//         }

//         const username = process.env.TP_USERNAME;
//         const password = process.env.TP_PASSWORD;
//         const token = await loginWithExistsCredintials();
//         const basicAuth = Buffer.from(`${username}:${password}`).toString(
//             "base64"
//         );

//         const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/save`;

//         const formData = new URLSearchParams({
//             ...params,
//             api_token: token,
//         });

//         // 🌀 نحاول تنفيذ الطلب + Retry تلقائي
//         let attempt = 0;
//         let response, data;

//         while (attempt <= MAX_RETRIES) {
//             try {
//                 const result = await makeSaveRequest(
//                     formData,
//                     basicAuth,
//                     apiUrl
//                 );
//                 response = result.res;
//                 data = result.data;

//                 if (response.ok) break;
//                 throw new Error(data?.message || "Save failed");
//             } catch (error) {
//                 if (attempt === MAX_RETRIES) throw error;
//                 console.warn(
//                     `[Retry ${attempt + 1}] Retrying save-passengers...`
//                 );
//                 attempt++;
//             }
//         }

//         return NextResponse.json(data);
//     } catch (err) {
//         console.error(`[${requestId}]`, err.message);
//         return NextResponse.json({ error: err.message }, { status: 500 });
//     }
// }

// app/api/flight/save-passengers/route.js
// import { NextResponse } from "next/server";
// import {
//     clearAPIToken,
//     loginWithExistsCredintials,
// } from "@/app/_libs/token-manager";

// const REQUEST_TIMEOUT = 30000; // 30 seconds timeout

// async function makeSavePassengersRequest(requestData, basicAuth, apiUrl) {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

//     try {
//         const formData = new URLSearchParams();
//         for (const [key, value] of Object.entries(requestData)) {
//             if (key === "TravelerDetails") {
//                 formData.append(key, JSON.stringify(value));
//             } else {
//                 formData.append(key, value);
//             }
//         }

//         const response = await fetch(apiUrl, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded",
//                 Authorization: `Basic ${basicAuth}`,
//             },
//             body: formData.toString(),
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

// function validateSavePassengersParams(params) {
//     const required = ["session_id", "temp_id", "amount", "TravelerDetails"];
//     const missing = required.filter((field) => !params[field]);
//     if (missing.length > 0) {
//         throw new Error(`Missing required fields: ${missing.join(", ")}`);
//     }
//     return true;
// }

// export async function POST(req) {
//     const requestId = `SAVE_PASSENGERS_${Date.now()}_${Math.random()
//         .toString(36)
//         .substr(2, 9)}`;

//     try {
//         const params = await req.json();
//         validateSavePassengersParams(params);

//         let token = await loginWithExistsCredintials();

//         const username = process.env.TP_USERNAME;
//         const password = process.env.TP_PASSWORD;
//         if (!username || !password) {
//             throw new Error("Missing API credentials configuration");
//         }
//         const basicAuth = Buffer.from(`${username}:${password}`).toString(
//             "base64"
//         );

//         const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/save`;

//         let requestData = {
//             ...params,
//             api_token: token,
//         };

//         let response = await makeSavePassengersRequest(
//             requestData,
//             basicAuth,
//             apiUrl
//         );

//         if (response.status === 401 || response.status === 403) {
//             await clearAPIToken();
//             const newToken = await loginWithExistsCredintials();
//             if (!newToken) {
//                 throw new Error("Failed to obtain new authentication token");
//             }
//             requestData.api_token = newToken;
//             response = await makeSavePassengersRequest(
//                 requestData,
//                 basicAuth,
//                 apiUrl
//             );
//         }

//         if (!response.ok) {
//             const errorText = await response.text();
//             let errorMessage = "Failed to save passengers";
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
//             `✅ [${new Date().toISOString()}] [${requestId}] Passengers saved successfully`
//         );
//         console.log(data);
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
// import { NextResponse } from "next/server";
// import {
//     clearAPIToken,
//     loginWithExistsCredintials,
// } from "@/app/_libs/token-manager";

// const REQUEST_TIMEOUT = 30000; // 30 ثانية مهلة زمنية

// async function makeSavePassengersRequest(requestData, basicAuth, apiUrl) {
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

// function validateSavePassengersParams(params) {
//     const required = ["session_id", "temp_id", "amount", "TravelerDetails"];
//     const missing = required.filter((field) => !params[field]);
//     if (missing.length > 0) {
//         throw new Error(`Missing required fields: ${missing.join(", ")}`);
//     }
//     return true;
// }

// export async function POST(req) {
//     const requestId = `SAVE_PASSENGERS_${Date.now()}_${Math.random()
//         .toString(36)
//         .substr(2, 9)}`;

//     try {
//         const params = await req.json();
//         validateSavePassengersParams(params);

//         let token = await loginWithExistsCredintials();

//         const username = process.env.TP_USERNAME;
//         const password = process.env.TP_PASSWORD;
//         if (!username || !password) {
//             throw new Error("Missing API credentials configuration");
//         }
//         const basicAuth = Buffer.from(`${username}:${password}`).toString(
//             "base64"
//         );

//         const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/save-passengers`;

//         let requestData = {
//             ...params,
//             api_token: token,
//         };

//         let response = await makeSavePassengersRequest(
//             requestData,
//             basicAuth,
//             apiUrl
//         );

//         if (response.status === 401 || response.status === 403) {
//             await clearAPIToken();
//             const newToken = await loginWithExistsCredintials();
//             if (!newToken)
//                 throw new Error("Failed to obtain new authentication token");
//             requestData.api_token = newToken;
//             response = await makeSavePassengersRequest(
//                 requestData,
//                 basicAuth,
//                 apiUrl
//             );
//         }

//         if (!response.ok) {
//             const errorText = await response.text();
//             let errorMessage = "Failed to save passengers";
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
//             `✅ [${new Date().toISOString()}] [${requestId}] Passengers saved successfully`
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

// // app/api/flight/book/route.js
// // This is the API route for booking flights, optimized for efficiency with fresh tokens, timeout handling, and minimal caching (disabled for bookings to avoid duplicates).
// // Improvements: Removed unnecessary cache for bookings (as they are unique), added better error logging, and ensured payload is JSON for modern APIs.

// import { NextResponse } from "next/server";
// import {
//     clearAPIToken,
//     loginWithExistsCredintials,
// } from "@/app/_libs/token-manager";

// const REQUEST_TIMEOUT = 30000; // 30 seconds timeout for reliability

// async function makeFlightBookRequest(requestData, basicAuth, apiUrl) {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

//     try {
//         const response = await fetch(apiUrl, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json", // Changed to JSON for better compatibility and readability
//                 Authorization: `Basic ${basicAuth}`,
//             },
//             body: JSON.stringify(requestData), // Use JSON instead of URLSearchParams for complex payloads
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

// function prepareBookRequestData(params, token) {
//     // Simplified preparation: Use object spread for defaults and clearer structure
//     return {
//         ...params, // Spread incoming params first
//         api_token: token,
//         transaction_status: params.transaction_status || "PROCESS",
//         booking_status: params.booking_status || "PROCESS",
//         payment_method: params.payment_method || "Payment Gateway",
//         currency: params.currency || "AED",
//         rate: params.rate || 1,
//         payment_status: params.payment_status || 0,
//         user_type: params.user_type || 0,
//         user_id: params.user_id || 0,
//         insurance: params.insurance || null,
//     };
// }

// function validateBookParams(params) {
//     const required = ["session_id", "temp_id", "amount", "TravelerDetails"];
//     const missing = required.filter((field) => !params[field]);
//     if (missing.length > 0) {
//         throw new Error(`Missing required fields: ${missing.join(", ")}`);
//     }
//     return true;
// }

// export async function POST(req) {
//     const requestId = `BOOK_${Date.now()}_${Math.random()
//         .toString(36)
//         .substr(2, 9)}`;

//     try {
//         const params = await req.json();
//         validateBookParams(params);

//         // Always get fresh token for security and to avoid expiration issues
//         let token = await loginWithExistsCredintials();

//         const username = process.env.TP_USERNAME;
//         const password = process.env.TP_PASSWORD;
//         if (!username || !password) {
//             throw new Error("Missing API credentials configuration");
//         }
//         const basicAuth = Buffer.from(`${username}:${password}`).toString(
//             "base64"
//         );

//         // Assume the external API endpoint for booking (update as needed)
//         const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/save-passengers`;

//         let requestData = prepareBookRequestData(params, token);

//         let response = await makeFlightBookRequest(
//             requestData,
//             basicAuth,
//             apiUrl
//         );

//         // Retry only on auth failure for efficiency
//         if (response.status === 401 || response.status === 403) {
//             await clearAPIToken();
//             const newToken = await loginWithExistsCredintials();
//             if (!newToken)
//                 throw new Error("Failed to obtain new authentication token");
//             requestData.api_token = newToken;
//             response = await makeFlightBookRequest(
//                 requestData,
//                 basicAuth,
//                 apiUrl
//             );
//         }

//         if (!response.ok) {
//             const errorText = await response.text();
//             let errorMessage = "Failed to book flight";
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
//             `✅ [${new Date().toISOString()}] [${requestId}] Flight booking successful`
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
