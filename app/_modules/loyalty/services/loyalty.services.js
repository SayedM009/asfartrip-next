import { encodeBase64 } from "@/app/_helpers/codeBase64";

export async function getLoyaltyConfig() {
    const res = await fetch("/api/loyalty/config", {
        cache: "no-store",
    });

    let json;
    try {
        json = await res.json();
    } catch {
        const text = await res.text();
        throw new Error(`Invalid JSON from /api/loyalty/config: ${text.slice(0, 200)}`);
    }

    if (!res.ok) {
        throw new Error(json.error || json.message || "Failed to load loyalty config");
    }

    return json.data;
}

export async function getUserTier(userId) {
    const encodedId = encodeBase64(userId);

    const res = await fetch(
        `/api/loyalty/tier?user_id=${encodeURIComponent(encodedId)}`,
        { cache: "no-store" }
    );

    let json;
    try {
        json = await res.json();
    } catch {
        const text = await res.text();
        throw new Error(`Invalid JSON from /api/loyalty/tier: ${text.slice(0, 200)}`);
    }

    return json.data;
}


export async function getUserBalance(userId) {
    const encodedId = encodeBase64(userId);

    const res = await fetch(
        `/api/loyalty/balance?user_id=${encodeURIComponent(encodedId)}`,
        { cache: "no-store" }
    );

    let json;
    try {
        json = await res.json();
    } catch {
        const text = await res.text();
        throw new Error(`Invalid JSON from /api/loyalty/balance: ${text.slice(0, 200)}`);
    }

    return json.data;
}
