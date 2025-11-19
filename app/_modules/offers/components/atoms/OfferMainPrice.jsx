export default function OfferMainPrice({ amount, currency, locale }) {
    const isArabic = locale === "ar";

    return (
        <p className="text-xl font-bold text-primary mt-3">
            {isArabic ? (
                <>
                    ابتداءً من {amount.toLocaleString("ar-AE")} {currency}
                </>
            ) : (
                <>
                    From {amount.toLocaleString("en-AE")} {currency}
                </>
            )}
        </p>
    );
}
