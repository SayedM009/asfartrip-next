// Mock destinations data - replace with actual API call later
const mockDestinations = [
    { id: 1, name: "Dubai", country: "UAE", type: "city" },
    { id: 2, name: "Dubai Marina", country: "UAE", type: "area" },
    { id: 3, name: "Downtown Dubai", country: "UAE", type: "area" },
    { id: 4, name: "Riyadh", country: "Saudi Arabia", type: "city" },
    { id: 5, name: "Cairo", country: "Egypt", type: "city" },
    { id: 6, name: "Istanbul", country: "Turkey", type: "city" },
];

/**
 * Search destinations by query
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of matching destinations
 */
export async function searchDestinations(query) {
    // TODO: Replace with actual API call
    // Example: const response = await fetch(`/api/hotels/destinations?q=${query}`);
    // return await response.json();

    return mockDestinations.filter(
        (dest) =>
            dest.name.toLowerCase().includes(query.toLowerCase()) ||
            dest.country.toLowerCase().includes(query.toLowerCase()),
    );
}
