/**
 * Client-side function to fetch recommended hotels
 * @param {string} city - City name
 * @param {string} country - Country code
 * @returns {Promise<Object>} - { success: boolean, data: Hotel[] }
 */
export async function getRecommendedHotels(city, country) {
    try {
        const response = await fetch(
            `/api/hotel/recommended?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to fetch recommended hotels");
        }

        return await response.json();
    } catch (error) {
        console.error("[getRecommendedHotels Error]:", error);
        return {
            success: false,
            error: error.message,
            data: [],
        };
    }
}
