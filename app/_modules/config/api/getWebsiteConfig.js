import { headers } from "next/headers";

export async function getWebsiteConfig() {
    const h = await headers();

    const protocol = h.get("x-forwarded-proto") || "https";
    const host = h.get("host");
    const origin = `${protocol}://${host}`;

    const res = await fetch(`${origin}/api/config`, {
        cache: "no-store",
    });

    // Check response status before parsing
    if (!res.ok) {
        const errorText = await res.text();
        console.error(`Config API failed: ${res.status} ${res.statusText}`, {
            url: `${origin}/api/config`,
            status: res.status,
            preview: errorText.substring(0, 200),
        });
        throw new Error(
            `Config API returned ${res.status}: ${errorText.substring(0, 100)}`
        );
    }

    // Validate Content-Type
    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
        const text = await res.text();
        console.error(`Config API returned non-JSON response`, {
            contentType,
            preview: text.substring(0, 200),
        });
        throw new Error(
            `Expected JSON from /api/config but got ${contentType || "unknown content type"}`
        );
    }

    const json = await res.json();

    if (!json || json.status !== "success") {
        throw new Error(json?.message || "Failed to load website config");
    }

    return json.data;
}
