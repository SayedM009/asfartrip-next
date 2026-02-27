/**
 * Client-side service for hotel booking operations.
 * Calls internal Next.js API routes which in turn call hotelService.
 */

/**
 * Get rate info for a selected room
 * @param {string} roomLoad - Room load data
 * @param {string} searchPayLoad - Encoded search payload
 * @returns {Promise<Object>} - { RateInfo, CartId }
 */
export async function getRateInfo(roomLoad, searchPayLoad) {
    const res = await fetch("/api/hotel/rateinfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ RoomLoad: roomLoad, SearchPayLoad: searchPayLoad }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to get rate info");
    }
    return data.data;
}

/**
 * Book a hotel room
 * @param {Object} payload - BookHotel payload (cart_id, guest info, guests JSON)
 * @returns {Promise<Object>} - { BookingReference, BookingPNR }
 */
export async function bookHotel(payload) {
    const res = await fetch("/api/hotel/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to book hotel");
    }
    return data.data;
}
