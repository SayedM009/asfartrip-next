/**
 * General Booking Service
 * Handles common booking operations across all modules (Flight, Hotel, Insurance, etc.)
 */



/**
 * Send voucher/ticket to customer email
 * @param {string} booking_reference - Booking reference
 * @param {string} module - Module type: "FLIGHT", "HOTEL", "INSURANCE", etc.
 * @returns {Promise<Object>} Response data
 */
export async function sendVoucher(booking_reference, module) {
    try {
        if (!booking_reference) {
            throw new Error("booking_reference is required");
        }

        if (!module) {
            throw new Error("module is required");
        }

        const res = await fetch(`/api/send-voucher`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                booking_reference,
                module: module.toUpperCase()
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error(` Failed to send ${module} voucher:`, data.error);
            throw new Error(data.error || "Failed to send voucher");
        }

        console.log(`✅ ${module} voucher sent successfully for:`, booking_reference);
        return data;
    } catch (err) {
        console.error("sendVoucher error:", err.message);
        throw err;
    }
}

/**
 * Get booking details for any module
 * @param {string} booking_reference - Booking reference
 * @param {string} module - Module type: "FLIGHT", "HOTEL", "INSURANCE", etc.
 * @returns {Promise<Object>} Booking details
 */
// export async function getBookingDetails(booking_reference, module) {
//     try {
//         if (!booking_reference) {
//             throw new Error("booking_reference is required");
//         }

//         if (!module) {
//             throw new Error("module is required");
//         }

//         const moduleEndpoints = {
//             FLIGHT: "/api/flight/get-booking",
//             HOTEL: "/api/hotel/get-booking",
//             INSURANCE: "/api/insurance/get-booking",
//         };

//         const endpoint = moduleEndpoints[module.toUpperCase()];

//         if (!endpoint) {
//             throw new Error(`Unsupported module: ${module}`);
//         }

//         const res = await fetch(`${endpoint}`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ booking_reference }),
//         });

//         const data = await res.json();

//         if (!res.ok) {
//             throw new Error(data.error || "Failed to get booking details");
//         }

//         return data;
//     } catch (err) {
//         console.error("getBookingDetails error:", err.message);
//         throw err;
//     }
// }
