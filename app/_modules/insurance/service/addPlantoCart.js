import { headers } from "next/headers";

export async function addToCartAPI(cartData, signal) {
    const host = (await headers()).get('host');
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    try {
        const res = await fetch(`${baseUrl}/api/insurance/add-to-cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cartData),
            signal,
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `Error: ${res.status}`);
        }

        const data = await res.json();
        return { ok: true, data };
    } catch (e) {
        console.error('Add to cart API error:', e);
        return { ok: false, error: e.message };
    }
}