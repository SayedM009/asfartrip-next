"use client";

import { format, parseISO } from "date-fns";
import { enUS, arSA } from "date-fns/locale";
import { useLocale } from "next-intl";
import { formatDisplayDate } from "../_helpers/formatDisplayDate";

const locales = {
    en: enUS,
    ar: arSA,
};

function useDisplayShortDate(pattern = "dd MMMM") {
    const locale = useLocale();

    return (isoDate) => {
        if (!isoDate) return "";

        const selectedLocale = locales[locale] || enUS;

        return format(parseISO(isoDate), pattern, { locale: selectedLocale });
    };
}

export default useDisplayShortDate;

export function useDateFormatter() {
    const locale = useLocale();

    return (date, options = {}) => {
        return formatDisplayDate(date, {
            ...options,
            locale: options.locale || locale, // استخدم locale من الخيارات أو من Hook
        });
    };
}
