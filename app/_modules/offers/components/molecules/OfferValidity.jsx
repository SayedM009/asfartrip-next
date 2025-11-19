export default function OfferValidity({ validity, locale }) {
    const isArabic = locale === "ar";

    return (
        <p className="text-xs text-muted-foreground mt-1">
            {isArabic ? "فترة العرض: " : "Validity: "}
            {validity.from} – {validity.to}
        </p>
    );
}
