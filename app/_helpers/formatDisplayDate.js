import { format, parseISO } from "date-fns";
import { enUS, arSA } from "date-fns/locale";

const locales = {
    en: enUS,
    ar: arSA,
};

export function formatDisplayDate(date, options = {}) {
    if (!date) return "";

    try {
        // تحويل التاريخ إلى Date object
        let dateObj;
        if (date instanceof Date) {
            dateObj = date;
        } else if (typeof date === "string") {
            // للتعامل مع ISO dates مثل "2025-10-29T23:45:00+03:00"
            dateObj = date.includes("T") ? parseISO(date) : new Date(date);
        } else {
            dateObj = new Date(date);
        }

        // الخيارات الافتراضية
        const { pattern = null, withYear = false, locale = null } = options;

        // تحديد النمط
        let formatPattern;
        if (pattern) {
            formatPattern = pattern;
        } else {
            formatPattern = withYear ? "EEE, MMM d, yyyy" : "EEE, MMM d";
        }

        // تحديد اللغة (من الخيارات أو من السياق)
        const localeToUse =
            locale ||
            (typeof window !== "undefined"
                ? document.documentElement.lang
                : "en");

        return format(dateObj, formatPattern, {
            locale: locales[localeToUse] || locales.en,
        });
    } catch (error) {
        console.error("Date format error:", error);
        return String(date);
    }
}
