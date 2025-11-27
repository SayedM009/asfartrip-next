"use client";

import { format, parse } from "date-fns";
import { enUS, arSA } from "date-fns/locale";
import { useLocale } from "next-intl";

const locales = {
    en: enUS,
    ar: arSA,
};

// 🟢 Helper: Extract date only (YYYY-MM-DD) without timezone conversion
function extractDateOnly(iso) {

    if (!iso) return "";

    // إذا كانت Date object → نحولها إلى ISO string
    if (iso instanceof Date) {
        return iso.toISOString().substring(0, 10);
    }

    // إذا كانت Number → نحول timestamp → Date → ISO
    if (typeof iso === "number") {
        return new Date(iso).toISOString().substring(0, 10);
    }

    // إذا كانت String → ممتاز
    if (typeof iso === "string") {
        return iso.substring(0, 10);
    }

    return "";
}


// 🟢 Main Hook: return a formatter function
function useDisplayShortDate(pattern = "dd MMMM") {
    const locale = useLocale();

    return (isoDate) => {
        if (!isoDate) return "";

        const selectedLocale = locales[locale] || enUS;

        // extract pure date without timezone shifting
        const dateOnly = extractDateOnly(isoDate);

        // parse using date-fns (safe)
        const parsedDate = parse(dateOnly, "yyyy-MM-dd", new Date());

        return format(parsedDate, pattern, { locale: selectedLocale });
    };
}

export default useDisplayShortDate;


// 🟢 Longer, more detailed formatter using same safe logic
export function useDateFormatter() {
    const locale = useLocale();

    return (isoDate, options = {}) => {
        if (!isoDate) return "";

        const actualLocale = locales[options.locale || locale] || enUS;

        const dateOnly = extractDateOnly(isoDate);
        const parsedDate = parse(dateOnly, "yyyy-MM-dd", new Date());

        return format(parsedDate, options.pattern || "EEE, d MMM yyyy", {
            locale: actualLocale,
        });
    };
}
