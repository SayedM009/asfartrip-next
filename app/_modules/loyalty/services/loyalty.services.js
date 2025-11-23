const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
import { encodeBase64 } from "@/app/_helpers/codeBase64";

export async function getLoyaltyConfig() {
    const res = await fetch(`${baseUrl}/api/loyalty/config`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to load loyalty config");
    const json = await res.json();
    return json.data;
}

export async function getUserTier(userId) {
    const encodedId = encodeBase64(userId);
    const res = await fetch(
        `/api/loyalty/tier?user_id=${encodeURIComponent(encodedId)}`,
        { cache: "no-store" }
    );
    const json = await res.json();
    return json.data;
}

export async function getUserBalance(userId) {
    const encodedId = encodeBase64(userId);
    const res = await fetch(
        `/api/loyalty/balance?user_id=${encodeURIComponent(encodedId)}`,
        { cache: "no-store" }
    );
    const json = await res.json();
    return json.data;
}
