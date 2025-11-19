import { useTranslations } from "next-intl";

function OffersTtile() {
    const o = useTranslations("OffersPage");
    return (
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white tracking-tight mb-4">
            {o("hero_title")}
        </h1>
    );
}

export default OffersTtile;
