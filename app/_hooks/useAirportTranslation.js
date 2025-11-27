import { useLocale } from "next-intl";
import airportCodes from "@/app/_data/airportCodes.json";

/**
 * Custom hook to translate airport codes to full names
 * @returns {Object} Functions to get airport and city names
 */
export function useAirportTranslation() {
    const locale = useLocale();

    /**
     * Get airport name from code
     * @param {string} code - Airport code (e.g., "DXB")
     * @param {boolean} cityOnly - Return only city name instead of full airport name
     * @returns {string} Translated airport or city name, or the code if not found
     */
    const getAirportName = (code, cityOnly = false) => {
        if (!code) return "";

        const airport = airportCodes[code.toUpperCase()];

        if (!airport) {
            // If airport not found in our database, return the code
            return code;
        }

        if (cityOnly) {
            return locale === "ar" ? airport.city_ar : airport.city_en;
        }

        return locale === "ar" ? airport.ar : airport.en;
    };

    /**
     * Get city name from airport code
     * @param {string} code - Airport code (e.g., "DXB")
     * @returns {string} Translated city name, or the code if not found
     */
    const getCityName = (code) => {
        return getAirportName(code, true);
    };

    /**
     * Get formatted display with code and name
     * @param {string} code - Airport code (e.g., "DXB")
     * @param {boolean} cityOnly - Use city name instead of full airport name
     * @returns {string} Formatted string like "DXB - Dubai" or "DXB - Dubai International Airport"
     */
    const getFormattedName = (code, cityOnly = false) => {
        if (!code) return "";

        const name = getAirportName(code, cityOnly);

        // If name is same as code (not found), just return code
        if (name === code) return code;

        return `${code} - ${name}`;
    };

    return {
        getAirportName,
        getCityName,
        getFormattedName,
    };
}
