
import { getOrigin } from "@/app/_utils/getOrigin.server";

export async function getCart(sessionId) {
    const origin = getOrigin();
    const res = await fetch(`${origin}/api/flight/get-cart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId }),
        cache: "no-store",
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch cart");
    }

    const data = await res.json();
    return data.data;
}
