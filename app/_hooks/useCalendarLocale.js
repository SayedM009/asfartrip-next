import { enUS, arSA } from "date-fns/locale";
import { useLocale } from "next-intl";
const locales = { en: enUS, ar: arSA };

function useCalendarLocale() {
    const locale = useLocale();
    const dateLocale = locales[locale] || enUS;
    return { dateLocale };
}

export default useCalendarLocale;
