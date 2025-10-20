// 1. Search airports
const API = process.env.NEXT_PUBLIC_APP_API_BASE_URL;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function searchAirports(value) {
    if (!value) throw new Error("There is no value");
    try {
        const res = await fetch(`${API}/api/flight/airports?term=${value}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error.message);
    }
}

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

export async function savePassengers(payload) {
    try {
        const response = await fetch(`${baseUrl}/api/flight/save-passengers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Invalid response from save-passengers API:", text);
            throw new Error("Invalid response format from save-passengers API");
        }

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to save passengers");
        }

        console.log(data);

        return data;
    } catch (error) {
        console.error("Save passengers service error:", error.message, {
            payload,
        });
        throw error;
    }
}

export async function confirmBooking(payload) {
    try {
        const response = await fetch("/api/flight/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Invalid response from confirm API:", text);
            throw new Error("Invalid response format from confirm API");
        }

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to confirm booking");
        }

        return data;
    } catch (error) {
        console.error("Confirm booking service error:", error.message, {
            payload,
        });
        throw error;
    }
}

export async function issueTicket(payload) {
    try {
        const response = await fetch("/api/flight/issue", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Invalid response from issue API:", text);
            throw new Error("Invalid response format from issue API");
        }

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to issue ticket");
        }

        return data;
    } catch (error) {
        console.error("Issue ticket service error:", error.message, {
            payload,
        });
        throw error;
    }
}
