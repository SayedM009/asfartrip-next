import { getOrigin } from "@/app/_utils/getOrigin.server";

/**
 * Fetch hotel booking details from the internal API route (server-side).
 * @param {string} pnr_no - Booking PNR number
 * @param {string} booking_no - Booking reference number
 * @returns {Promise<Object>} - Booking details
 */
export async function getHotelBookingDetails(pnr_no, booking_no) {
    const origin = await getOrigin();
    try {
        const res = await fetch(`${origin}/api/hotel/booking-details`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pnr_no, booking_no }),
        });

        let data;
        try {
            data = await res.json();
        } catch {
            const text = await res.text();
            throw new Error(`Invalid JSON from API: ${text.substring(0, 200)}`);
        }

        if (!res.ok || !data.success) {
            throw new Error(data?.error || "Failed to get hotel booking details");
        }

        return data.data;
    } catch (err) {
        console.error("getHotelBookingDetails error:", err.message);
        throw err;
    }
}
