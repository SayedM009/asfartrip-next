/**
 * Filter hotels based on applied filters
 * @param {Array} hotels - Array of hotel objects
 * @param {Object} filters - Filter object with priceRange, starRatings, propertyTypes
 * @returns {Array} - Filtered hotels array
 */
export const filterHotels = (hotels, filters) => {
    if (!hotels || hotels.length === 0) return [];
    if (!filters) return hotels;

    const { priceRange, starRatings, propertyTypes } = filters;

    return hotels.filter((hotel) => {
        // Price filter
        const price = hotel.HotelPrice?.MinPrice || 0;
        if (priceRange) {
            if (price < priceRange.min || price > priceRange.max) {
                return false;
            }
        }

        // Star rating filter
        if (starRatings && starRatings.length > 0) {
            const rating = parseInt(hotel.HotelInfo?.Rating) || 0;
            if (!starRatings.includes(rating)) {
                return false;
            }
        }

        // Property type filter
        if (propertyTypes && propertyTypes.length > 0) {
            const type = hotel.HotelInfo?.PropertyType;
            if (!propertyTypes.includes(type)) {
                return false;
            }
        }

        return true;
    });
};

/**
 * Check if any filters are active
 * @param {Object} filters - Filter object
 * @returns {boolean}
 */
export const hasActiveFilters = (filters) => {
    if (!filters) return false;

    const { priceRange, starRatings, propertyTypes } = filters;

    if (priceRange && (priceRange.min > 0 || priceRange.max < Infinity)) {
        return true;
    }

    if (starRatings && starRatings.length > 0) {
        return true;
    }

    if (propertyTypes && propertyTypes.length > 0) {
        return true;
    }

    return false;
};
