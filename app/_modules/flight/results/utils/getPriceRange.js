// app/_modules/flights/results/filters/utils/getPriceRange.js

export function getPriceRange(flights) {
    if (!flights || flights.length === 0) return { min: 0, max: 2000 };

    const prices = flights.map((f) => f.TotalPrice || 0);

    return {
        min: Math.floor(Math.min(...prices)),
        max: Math.ceil(Math.max(...prices)),
    };
}
