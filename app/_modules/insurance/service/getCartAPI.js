import { headers } from "next/headers";

export async function getCartAPI(sessionId, signal) {
    const host = (await headers()).get('host');
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    try {
        const res = await fetch(`${baseUrl}/api/insurance/get-cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionId }),
            signal,
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `Error: ${res.status}`);
        }

        const data = await res.json();
        return { ok: true, data };
    } catch (e) {
        console.error('Get cart API error:', e);
        return { ok: false, error: e.message };
    }
}