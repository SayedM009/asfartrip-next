"use client";

import { format, parse } from "date-fns";
import { enUS, arSA } from "date-fns/locale";
import { useLocale } from "next-intl";

const locales = {
    en: enUS,
    ar: arSA,
};

function extractDateOnly(iso) {

    if (!iso) return "";

    if (iso instanceof Date) {
        return iso.toISOString().substring(0, 10);
    }

    if (typeof iso === "number") {
        return new Date(iso).toISOString().substring(0, 10);
    }

    if (typeof iso === "string") {
        return iso.substring(0, 10);
    }

    return "";
}


function useDisplayShortDate(pattern = "dd MMMM") {
    const locale = useLocale();

    return (isoDate) => {
        if (!isoDate) return "";

        const selectedLocale = locales[locale] || enUS;

        const dateOnly = extractDateOnly(isoDate);

        const parsedDate = parse(dateOnly, "yyyy-MM-dd", new Date());

        return format(parsedDate, pattern, { locale: selectedLocale });
    };
}

export default useDisplayShortDate;


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
