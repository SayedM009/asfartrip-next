import { useTranslations } from "next-intl";

function CountText({ totalCount, filteredCount }) {
    const t = useTranslations("Hotels.results");
    const countText =
        filteredCount === totalCount
            ? `${totalCount} ${t("properties_found")}`
            : `${filteredCount} ${t("of")} ${totalCount} ${t("properties_found")}`;
    return (
        <p className="text-xs sm:text-lg font-bold capitalize">{countText}</p>
    );
}

export default CountText;
