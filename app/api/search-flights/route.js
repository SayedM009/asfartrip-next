import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loginWithExistsCredintials } from "@/app/_libs/auth";

const TOKEN_EXPIRY = 10 * 60;

async function makeFlightSearchRequest(requestData, basicAuth, apiUrl) {
    return await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${basicAuth}`,
        },
        body: new URLSearchParams(requestData),
    });
}

async function refreshToken(cookieStore) {
    console.log("🔄 Refreshing token...");

    cookieStore.delete("api_token");

    const token = await loginWithExistsCredintials();

    if (!token) {
        throw new Error("Failed to obtain authentication token");
    }

    cookieStore.set("api_token", token, {
        path: "/",
        httpOnly: true,
        maxAge: TOKEN_EXPIRY,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    console.log("✅ Token refreshed");
    return token;
}

export async function POST(req) {
    try {
        const params = await req.json();
        console.log("📥 Search request received");

        const cookieStore = await cookies();
        let token = cookieStore.get("api_token")?.value;

        // لو مفيش token، اجيب واحد جديد
        if (!token) {
            console.log("🔐 No token found, getting new one...");
            token = await refreshToken(cookieStore);
        } else {
            console.log("✅ Using existing token");
        }

        // حضر الـ request data
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

        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;
        const basicAuth = Buffer.from(`${username}:${password}`).toString(
            "base64"
        );

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/search`;

        console.log("🔍 Searching flights...");

        // ابعت الـ request الأول
        let res = await makeFlightSearchRequest(requestData, basicAuth, apiUrl);

        console.log("📡 Response status:", res.status);

        // ✅ لو فشل بسبب authentication، اعمل refresh وحاول تاني
        if (res.status === 401 || res.status === 403) {
            console.log("⚠️ Token invalid/expired, refreshing...");

            token = await refreshToken(cookieStore);
            requestData.api_token = token;

            console.log("🔍 Retrying search with new token...");
            res = await makeFlightSearchRequest(requestData, basicAuth, apiUrl);
            console.log("📡 Retry response status:", res.status);
        }

        // لو لسه فيه مشكلة
        if (!res.ok) {
            const errText = await res.text();
            console.error("❌ API Error:", errText);

            return NextResponse.json(
                { error: errText || "Failed to search flights" },
                { status: res.status }
            );
        }

        const data = await res.json();
        console.log("✅ Search successful, returning results");

        return NextResponse.json(data);
    } catch (err) {
        console.error("❌ Critical Error:", err.message);
        console.error(err);

        return NextResponse.json(
            { error: err.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { loginWithExistsCredintials } from "@/app/_libs/auth";

// const TOKEN_EXPIRY = 10 * 60;

// async function getOrRefreshToken() {
//     const cookieStore = await cookies();
//     let token = cookieStore.get("api_token")?.value;

//     if (!token) {
//         console.log("No token, logging in...");
//         token = await loginWithExistsCredintials();

//         cookieStore.set("api_token", token, {
//             path: "/",
//             httpOnly: true,
//             maxAge: TOKEN_EXPIRY,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "lax",
//         });
//     }

//     return token;
// }

// export async function POST(req) {
//     try {
//         const params = await req.json();

//         // جيب الـ token
//         let token = await getOrRefreshToken();

//         // حضر الـ request data
//         const requestData = {
//             origin: params.origin,
//             destination: params.destination,
//             depart_date: params.depart_date,
//             ADT: params.ADT || 1,
//             CHD: params.CHD || 0,
//             INF: params.INF || 0,
//             class: `${params.class[0].toUpperCase()}${params.class.slice(1)}`,
//             type: params.type || "O",
//             api_token: token,
//         };

//         if (params.type === "R" && params.return_date) {
//             requestData.return_date = params.return_date;
//         }

//         const username = process.env.TP_USERNAME;
//         const password = process.env.TP_PASSWORD;
//         const basicAuth = Buffer.from(`${username}:${password}`).toString(
//             "base64"
//         );

//         // ابعت للـ External API
//         let res = await fetch(
//             `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/search`,
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/x-www-form-urlencoded",
//                     Authorization: `Basic ${basicAuth}`,
//                 },
//                 body: new URLSearchParams(requestData),
//             }
//         );

//         // لو Token expired
//         if (res.status === 401) {
//             console.log("Token expired, refreshing...");

//             const cookieStore = await cookies();
//             cookieStore.delete("api_token");

//             // اعمل login جديد
//             token = await loginWithExistsCredintials();
//             cookieStore.set("api_token", token, {
//                 path: "/",
//                 httpOnly: true,
//                 maxAge: TOKEN_EXPIRY,
//                 secure: process.env.NODE_ENV === "production",
//                 sameSite: "lax",
//             });

//             // حاول تاني بالـ token الجديد
//             requestData.api_token = token;
//             res = await fetch(
//                 `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/search`,
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/x-www-form-urlencoded",
//                         Authorization: `Basic ${basicAuth}`,
//                     },
//                     body: new URLSearchParams(requestData),
//                 }
//             );
//         }

//         if (!res.ok) {
//             const errText = await res.text();
//             console.error("Search failed:", errText);
//             throw new Error("Failed to search flights");
//         }

//         const data = await res.json();
//         return NextResponse.json(data);
//     } catch (err) {
//         console.error("API Route Error:", err);
//         return NextResponse.json(
//             { error: err.message || "Failed to search" },
//             { status: 500 }
//         );
//     }
// }
