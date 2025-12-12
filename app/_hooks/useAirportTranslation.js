import { useLocale } from "next-intl";
import airportCodes from "@/app/_data/airportCodes.json";


export function useAirportTranslation() {
    const locale = useLocale();

    const getAirportName = (code, cityOnly = false) => {
        if (!code) return "";

        const airport = airportCodes[code.toUpperCase()];

        if (!airport) {
            return code;
        }

        if (cityOnly) {
            return locale === "ar" ? airport.city_ar : airport.city_en;
        }

        return locale === "ar" ? airport.ar : airport.en;
    };


    const getCityName = (code) => {
        return getAirportName(code, true);
    };


    const getFormattedName = (code, cityOnly = false) => {
        if (!code) return "";

        const name = getAirportName(code, cityOnly);

        if (name === code) return code;

        return `${code} - ${name}`;
    };

    return {
        getAirportName,
        getCityName,
        getFormattedName,
    };
}
