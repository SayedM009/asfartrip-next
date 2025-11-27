/**
 * Flight Status Service
 * Handles fetching flight booking details for status page
 */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

/**
 * Get flight booking details
 * @param {string} booking_reference - Booking reference
 * @returns {Promise<Object>} Booking details
 */
export async function getFlightBookingDetails(booking_reference) {
    try {
        const res = await fetch(`${baseUrl}/api/flight/get-booking`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ booking_reference }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to get booking");
        return data;
    } catch (err) {
        console.error("getFlightBookingDetails error:", err.message);
        throw err;
    }
}
