

import { getOrigin } from "@/app/_utils/getOrigin.server";


export async function getFlightBookingDetails(booking_reference) {
    const origin = await getOrigin();
    try {
        const res = await fetch(`${origin}/api/flight/get-booking`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ booking_reference }),
        });

        let data;
        try {
            data = await res.json();
        } catch {
            const text = await res.text();
            throw new Error(`Invalid JSON from API: ${text.substring(0, 200)}`);
        }

        if (!res.ok) {
            throw new Error(data?.error || data?.message || "Failed to get booking");
        }

        return data;
    } catch (err) {
        console.error("getFlightBookingDetails error:", err.message);
        throw err;
    }
}
