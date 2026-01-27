import { SORT_OPTIONS } from "../constants/sortOptions";

/**
 * Sort hotels based on sort option
 * @param {Array} hotels - Array of hotel objects
 * @param {string} sortValue - Sort option value
 * @returns {Array} - Sorted hotels array
 */
export const sortHotels = (hotels, sortValue) => {
    if (!hotels || hotels.length === 0) return [];

    const sortOption = SORT_OPTIONS.find((opt) => opt.value === sortValue);
    if (!sortOption) return hotels;

    const { sortBy, order } = sortOption;

    return [...hotels].sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
            case "TripAdvisorRating":
                aValue = parseFloat(a.HotelInfo?.TripAdvisorRating) || 0;
                bValue = parseFloat(b.HotelInfo?.TripAdvisorRating) || 0;
                break;
            case "MinPrice":
                aValue = a.HotelPrice?.MinPrice || 0;
                bValue = b.HotelPrice?.MinPrice || 0;
                break;
            case "Rating":
                aValue = parseInt(a.HotelInfo?.Rating) || 0;
                bValue = parseInt(b.HotelInfo?.Rating) || 0;
                break;
            default:
                return 0;
        }

        if (order === "asc") {
            return aValue - bValue;
        } else {
            return bValue - aValue;
        }
    });
};
