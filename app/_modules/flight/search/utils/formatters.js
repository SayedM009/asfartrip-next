/**
 * Format/normalize class name to lowercase for consistency
 * Handles both "Economy" and "economy" variants
 */
export function normalizeClassName(className) {
    const normalized = className?.toLowerCase();
    switch (normalized) {
        case "economy":
            return "economy";
        case "business":
            return "business";
        case "first":
            return "first";
        default:
            return "economy";
    }
}
