import OfferTitle from "../atoms/OfferTitle";
import OfferMainPrice from "../atoms/OfferMainPrice";
import OfferRoute from "../molecules/OfferRoute";
import OfferValidity from "../molecules/OfferValidity";
import Image from "next/image";

export default function OfferDetailsCard({ offer, locale }) {
    const isArabic = locale === "ar";
    const dir = isArabic ? "rtl" : "ltr";

    return (
        <section dir={dir} className="space-y-4 py-4 sm:py-16">
            {/* صورة العرض */}
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden">
                <Image
                    src={offer.image[locale]}
                    alt={offer.title[locale]}
                    fill
                    className="object-cover"
                />
            </div>

            {/* العنوان + السعر */}
            <OfferTitle title={offer.title[locale]} />
            <OfferMainPrice
                amount={offer.priceFrom.amount}
                currency={offer.priceFrom.currency}
                locale={locale}
            />

            {/* Route */}
            <OfferRoute
                origin={offer.origin}
                destination={offer.destination}
                locale={locale}
            />

            {/* Validity */}
            <OfferValidity validity={offer.validity} locale={locale} />

            {/* Tags */}
            {offer.tags[locale]?.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                    {offer.tags[locale].map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full border px-3 py-1 text-xs"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* التفاصيل */}
            <div className="space-y-3 mt-4">
                <h2 className="text-lg font-semibold">
                    {isArabic ? "تفاصيل العرض" : "Offer Details"}
                </h2>

                <ul className="space-y-2 text-sm leading-relaxed">
                    {offer.details[locale].map((line, index) => (
                        <li key={index}>• {line}</li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
