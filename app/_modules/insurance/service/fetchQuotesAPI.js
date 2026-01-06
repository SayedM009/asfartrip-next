export async function fetchQuotesAPI(body, signal) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/insurance/get-quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal,
    });

    let data;
    try {
        data = await res.json();
    } catch (e) {
        console.error('Failed to parse JSON:', e);
        data = { error: 'Invalid JSON response', raw: res };
    }

    return { ok: res.ok, status: res.status, data };
}