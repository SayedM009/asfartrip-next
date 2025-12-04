// import { headers } from "next/headers";

// export async function getWebsiteConfig() {
//     const h = headers();
//     const protocol = h.get("x-forwarded-proto") || "https";
//     const host = h.get("host");

//     // ALWAYS fetch root API (no /en)
//     const origin = `${protocol}://${host}`;
//     const url = `${origin}/api/config`;

//     const res = await fetch(url, {
//         cache: "no-store",
//     });

//     if (!res.ok) {
//         const errorText = await res.text();
//         console.error(`Config API failed: ${res.status} ${res.statusText}`, {
//             url,
//             status: res.status,
//             preview: errorText.substring(0, 200),
//         });
//         throw new Error(
//             `Config API returned ${res.status}: ${errorText.substring(0, 100)}`
//         );
//     }

//     // Content type check
//     const contentType = res.headers.get("content-type");
//     if (!contentType?.includes("application/json")) {
//         const text = await res.text();
//         console.error(`Config API returned non-JSON response`, {
//             contentType,
//             preview: text.substring(0, 200),
//         });
//         throw new Error(
//             `Expected JSON but got ${contentType || "unknown content type"}`
//         );
//     }

//     const json = await res.json();

//     if (!json || json.status !== "success") {
//         throw new Error(json?.message || "Failed to load website config");
//     }

//     return json.data;
// }
