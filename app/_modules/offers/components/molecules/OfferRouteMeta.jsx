// app/_modules/offers/components/molecules/OfferRouteMeta.jsx

export default function OfferRouteMeta({ offer, locale }) {
    const isArabic = locale === "ar";
    const origin = offer.origin.city[locale];
    const destination = offer.destination.city[locale];

    return (
        <p className="text-xs font-medium">
            {isArabic ? (
                <>
                    {origin} ({offer.origin.code}) → {destination} (
                    {offer.destination.code})
                </>
            ) : (
                <>
                    {origin} ({offer.origin.code}) → {destination} (
                    {offer.destination.code})
                </>
            )}
        </p>
    );
}
