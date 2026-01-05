/**
 * Formats travel dates based on trip type
 * @param {string} tripType - 'single' for round-trip, other for one-way
 * @param {Date} selectedDate - Single date for annual/biennial trips
 * @param {{from: Date, to: Date}} range - Date range for single trips
 * @param {Function} formatDate - Date formatter function
 * @returns {Object} Formatted date object
 */
export function formatTravelDates(tripType, selectedDate, range, formatDate) {
    const pattern = "dd-MM-yyyy";

    if (tripType !== "single") {
        return {
            from: formatDate(selectedDate, { pattern }),
        };
    }

    return {
        from: formatDate(range.from, { pattern }),
        to: formatDate(range.to, { pattern }),
    };
}

// Default export for backward compatibility
export default formatTravelDates;
