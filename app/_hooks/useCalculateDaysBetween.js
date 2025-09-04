import { useTranslations } from "next-intl";
import { differenceInDays } from "date-fns";
function useCalculateDaysBetween(start, end) {
  const t = useTranslations("Hooks");
  if (!start || !end) return `0 ${t("day")}`;
  return `${differenceInDays(end, start)}  ${t("day")}`;
}

export default useCalculateDaysBetween;
