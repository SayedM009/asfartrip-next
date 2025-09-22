"use client";

import { format, parseISO } from "date-fns";
import { enUS, arSA } from "date-fns/locale";
import { useLocale } from "next-intl";

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
