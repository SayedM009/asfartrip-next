export async function fetchFlightsAPI(body, signal) {
    const res = await fetch("/api/flight/search-flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal,
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
}
