
const baseUrl =
    process.env.VERCEL_URL
        ? process.env.VERCEL_URL
        : process.env.NEXT_PUBLIC_SITE_URL ||
        "http://localhost:3000";

export async function getCart(sessionId) {
    const res = await fetch(`${baseUrl}/api/flight/get-cart`, {
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
