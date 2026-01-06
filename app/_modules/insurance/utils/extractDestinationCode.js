/**
 * Extracts the destination code from a hyphenated destination value
 * @param {string} destination - Destination value (e.g., "gulf-sa" or "europe")
 * @returns {string} Extracted destination code
 */
export function extractDestinationCode(destination) {
    return destination.includes("-") ? destination.split("-")[0] : destination;
}

