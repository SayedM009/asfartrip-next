

import { getOrigin } from "@/app/_utils/getOrigin.server";

export async function getWebsiteConfig() {
    const origin = getOrigin();

    const res = await fetch(`${origin}/api/config`, {
        cache: "no-store",
    });

    const json = await res.json();

    if (!json || json.status !== "success") {
        throw new Error(json?.message || "Failed to load website config");
    }

    return json.data;
}
