// import { NextResponse } from "next/server";

// export async function GET() {
//     try {
//         const url = process.env.API_BASE_URL;
//         const username = process.env.TP_USERNAME;
//         const password = process.env.TP_PASSWORD;

//         if (!username || !password) {
//             throw new Error("Missing API credentials configuration");
//         }

//         const targetDomain = "whitelabel-demo.asfartrip.com";

//         const basicAuth = Buffer.from(`${username}:${password}`).toString(
//             "base64"
//         );

//         const res = await fetch(`${url}/api/website/${targetDomain}`, {
//             method: "GET",
//             headers: {
//                 Authorization: `Basic ${basicAuth}`,
//                 Accept: "application/json",
//             },
//             cache: "no-store",
//         });


//         if (!res.ok) {
//             console.error(" Upstream API error:", {
//                 status: res.status,
//                 statusText: res.statusText,
//                 url: `${url}/api/website/${targetDomain}`,
//             });
//             return NextResponse.json(
//                 {
//                     status: "error",
//                     message: `Upstream error: ${res.status} ${res.statusText}`,
//                 },
//                 { status: res.status }
//             );
//         }

//         const data = await res.json();

//         console.log(" Website config loaded successfully:", {
//             status: data.status,
//             hasData: !!data.data,
//             domain: targetDomain,
//         });

//         return NextResponse.json({
//             status: "success",
//             data: data.data ?? data,
//         });

//     } catch (error) {
//         console.error(" Config API error:", {
//             message: error.message,
//             stack: error.stack,
//         });
//         return NextResponse.json(
//             {
//                 status: "error",
//                 message: error.message ?? "Unknown error",
//             },
//             { status: 500 }
//         );
//     }
// }
