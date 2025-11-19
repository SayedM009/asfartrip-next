// app/_modules/offers/components/atoms/OfferDateRange.jsx

export default function OfferDateRange({ from, to, locale }) {
    if (!from || !to) return null;

    const isArabic = locale === "ar";

    return (
        <p className="text-xs text-muted-foreground">
            {isArabic ? "فترة العرض:" : "Offer period:"} {from} – {to}
        </p>
    );
}
