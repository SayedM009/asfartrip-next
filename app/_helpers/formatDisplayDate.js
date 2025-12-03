import { format, parseISO } from "date-fns";
import { enUS, arSA } from "date-fns/locale";

const locales = {
    en: enUS,
    ar: arSA,
};

export function formatDisplayDate(date, options = {}) {
    if (!date) return "";

    try {
        let dateObj;
        if (date instanceof Date) {
            dateObj = date;
        } else if (typeof date === "string") {
            dateObj = date.includes("T") ? parseISO(date) : new Date(date);
        } else {
            dateObj = new Date(date);
        }

        const { pattern = null, withYear = false, locale = null } = options;

        let formatPattern;
        if (pattern) {
            formatPattern = pattern;
        } else {
            formatPattern = withYear ? "EEE, MMM d, yyyy" : "EEE, MMM d";
        }

        // FIX: Removed typeof window check to prevent hydration mismatch (Error #418)
        const localeToUse = locale || "en";

        return format(dateObj, formatPattern, {
            locale: locales[localeToUse] || locales.en,
        });
    } catch (error) {
        console.error("Date format error:", error);
        return String(date);
    }
}
