// Filter configuration for hotel results

// Star rating options
export const STAR_RATINGS = [2, 3, 4, 5];

// Generate dynamic price ranges based on hotel prices
export const generatePriceRanges = (hotels) => {
    if (!hotels || hotels.length === 0) {
        return [
            { label: "0 - 200", min: 0, max: 200 },
            { label: "200 - 500", min: 200, max: 500 },
            { label: "500 - 1000", min: 500, max: 1000 },
            { label: "1000+", min: 1000, max: Infinity },
        ];
    }

    const prices = hotels.map((h) => h.HotelPrice?.MinPrice || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice;

    // Generate 4-5 ranges based on actual prices
    if (range <= 500) {
        return [
            { label: `0 - 150`, min: 0, max: 150 },
            { label: `150 - 300`, min: 150, max: 300 },
            { label: `300 - 500`, min: 300, max: 500 },
            { label: `500+`, min: 500, max: Infinity },
        ];
    } else if (range <= 1000) {
        return [
            { label: `0 - 250`, min: 0, max: 250 },
            { label: `250 - 500`, min: 250, max: 500 },
            { label: `500 - 750`, min: 500, max: 750 },
            { label: `750 - 1000`, min: 750, max: 1000 },
            { label: `1000+`, min: 1000, max: Infinity },
        ];
    } else {
        return [
            { label: `0 - 500`, min: 0, max: 500 },
            { label: `500 - 1000`, min: 500, max: 1000 },
            { label: `1000 - 2000`, min: 1000, max: 2000 },
            { label: `2000+`, min: 2000, max: Infinity },
        ];
    }
};

// Extract unique property types from hotels
export const getPropertyTypes = (hotels) => {
    if (!hotels || hotels.length === 0) return [];
    const types = hotels.map((h) => h.HotelInfo?.PropertyType).filter(Boolean);
    return [...new Set(types)];
};

// Initial filter state
export const INITIAL_FILTERS = {
    priceRange: { min: 0, max: Infinity },
    starRatings: [],
    propertyTypes: [],
};
