

import { headers } from "next/headers";

export async function getWebsiteConfig() {
    const h = headers();
    const protocol = h.get("x-forwarded-proto") || "https";
    const host = h.get("host");
    const origin = `${protocol}://${host}`;

    const res = await fetch(`${origin}/api/config`, {
        cache: "no-store",
    });

    const json = await res.json();

    if (!json || json.status !== "success") {
        throw new Error(json?.message || "Failed to load website config");
    }

    return json.data;
}
