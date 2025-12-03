/**
 * Flight Status Service
 * Handles fetching flight booking details for status page
 */

import { getOrigin } from "@/app/_utils/getOrigin.server";

/**
 * Get flight booking details
 * @param {string} booking_reference - Booking reference
 * @returns {Promise<Object>} Booking details
 */
export async function getFlightBookingDetails(booking_reference) {
    const origin = getOrigin();
    try {
        const res = await fetch(`${origin}/api/flight/get-booking`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ booking_reference }),
        });

        // Try safer JSON
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
