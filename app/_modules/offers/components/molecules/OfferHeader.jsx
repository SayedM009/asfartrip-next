import OfferDateRange from "../atoms/OfferDateRange";

export default function OfferHeader({ offer, locale }) {
    const isArabic = locale === "ar";

    const title = offer.title[locale];
    const subtitle = offer.subtitle[locale];

    return (
        <div className="space-y-1">
            <h3 className="text-base font-semibold leading-snug">{title}</h3>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
            <OfferDateRange
                from={offer.validity.from}
                to={offer.validity.to}
                locale={locale}
            />
        </div>
    );
}
