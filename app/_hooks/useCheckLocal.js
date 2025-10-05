import { useLocale } from "next-intl";

function useCheckLocal() {
    const locale = useLocale();
    const isRTL = locale === "ar";
    return { locale, isRTL, locale };
}

export default useCheckLocal;
