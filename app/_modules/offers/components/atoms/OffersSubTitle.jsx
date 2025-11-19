import { useTranslations } from "next-intl";

function OffersSubTitle() {
    const o = useTranslations("OffersPage");
    return (
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl">
            {o("hero_subtitle")}
        </p>
    );
}

export default OffersSubTitle;
