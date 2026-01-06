import { headers } from "next/headers";

export async function fetchQuotesAPI(body, signal) {

    const host = (await headers()).get('host');

    const protocol = host.includes('localhost') ? 'http' : 'https';

    const baseUrl = `${protocol}://${host}`;

    try {
        const res = await fetch(`${baseUrl}/api/insurance/get-quotes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal,
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();
        return { ok: true, data };
    } catch (e) {
        console.error('Fetch error on server:', e);
        return { ok: false, error: e.message };
    }
}