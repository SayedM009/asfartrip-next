/**
 * Search for hotels and locations by term
 * @param {string} term - Search term (city name, hotel name, etc.)
 * @returns {Promise<{ locations: Array, hotels: Array }>}
 */
export async function searchHotels(term) {
    try {
        const response = await fetch("/api/hotel/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ term }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to search hotels");
        }

        return await response.json();
    } catch (error) {
        console.error("[searchHotels Error]:", error);
        throw error;
    }
}
