export default function OfferRoute({ origin, destination, locale }) {
    const isArabic = locale === "ar";

    return (
        <div className="text-sm font-medium mt-1">
            {origin.city[locale]} ({origin.code}) → {destination.city[locale]} (
            {destination.code})
        </div>
    );
}
