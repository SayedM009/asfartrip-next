/**
 * Handle date range selection - Airbnb/Booking/Expedia/Skyscanner standard
 * 
 * @param {Object} currentRange - Current range { from: Date|null, to: Date|null }
 * @param {Date} clickedDate - The date that was clicked
 * @returns {Object} New range { from: Date|null, to: Date|null }
 */
export function handleRangeSelection(currentRange, clickedDate) {
    if (!clickedDate) return currentRange;

    const { from, to } = currentRange || { from: null, to: null };

    // RULE 1: First click - no range selected
    if (!from && !to) {
        return { from: clickedDate, to: null };
    }

    // RULE 3: Full range already selected - reset and start fresh
    if (from && to) {
        return { from: clickedDate, to: null };
    }

    // RULE 2: Only 'from' is set (second click)
    if (from && !to) {
        // RULE 4: Same day clicked twice
        if (clickedDate.getTime() === from.getTime()) {
            return { from: clickedDate, to: clickedDate };
        }

        // If clicked date is after 'from', set it as 'to'
        if (clickedDate > from) {
            return { from, to: clickedDate };
        }

        // If clicked date is before 'from', swap them
        return { from: clickedDate, to: from };
    }

    // Fallback: reset
    return { from: clickedDate, to: null };
}
