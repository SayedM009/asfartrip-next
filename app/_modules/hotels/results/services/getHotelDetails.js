"use server";

/**
 * Fetches detailed hotel information from the API
 * @param {string} hotelId - The hotel ID to fetch details for
 * @returns {Promise<{success: boolean, data: object|null, error: string|null}>}
 */
export async function getHotelDetails(hotelId) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/hotel/v2/HotelDetails`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ hotel_id: hotelId }),
                cache: "force-cache",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch hotel details");
        }

        const result = await response.json();

        if (result.status !== "Success" || !result.response?.HotelDetails) {
            return {
                success: false,
                data: null,
                error: "Hotel details not found",
            };
        }

        return {
            success: true,
            data: result.response.HotelDetails,
            error: null,
        };
    } catch (error) {
        console.error("[getHotelDetails Error]:", error);
        return {
            success: false,
            data: null,
            error: error.message,
        };
    }
}
