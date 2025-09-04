import { format } from "date-fns";
import { enUS, arSA } from "date-fns/locale";

const locales = {
  en: enUS,
  ar: arSA,
};

export function formatDisplayDate(date, locale = "en", withYear = false) {
  if (!date) return "";

  try {
    const d = date instanceof Date ? date : new Date(date);

    const pattern = withYear ? "EEE, MMM d, yyyy" : "EEE, MMM d";

    return format(d, pattern, { locale: locales[locale] });
  } catch (error) {
    console.error("Date format error:", error);
    return String(date);
  }
}
