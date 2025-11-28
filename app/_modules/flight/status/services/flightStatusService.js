/**
 * Flight Status Service
 * Handles fetching flight booking details for status page
 */

/**
 * Get flight booking details
 * @param {string} booking_reference - Booking reference
 * @returns {Promise<Object>} Booking details
 */
export async function getFlightBookingDetails(booking_reference) {
    try {
        const res = await fetch("/api/flight/get-booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ booking_reference }),
        });

        const text = await res.text();
        let data;

        try {
            data = JSON.parse(text);
        } catch (error) {
            throw new Error(`Invalid JSON from /api/flight/get-booking: ${text.substring(0, 200)}`);
        }

        if (!res.ok) {
            throw new Error(data.error || data.message || "Failed to get booking");
        }

        return data;
    } catch (err) {
        console.error("getFlightBookingDetails error:", err.message);
        throw err;
    }
}
