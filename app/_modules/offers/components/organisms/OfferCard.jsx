// app/_modules/offers/components/organisms/OfferCard.jsx

"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import OfferHeader from "../molecules/OfferHeader";
import OfferRouteMeta from "../molecules/OfferRouteMeta";
import OfferTag from "../atoms/OfferTag";
import OfferPrice from "../atoms/OfferPrice";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { useTranslations } from "next-intl";

export default function OfferCard({ offer }) {
    const { locale } = useCheckLocal();
    const o = useTranslations("OffersPage");

    const tags = offer.tags?.[locale] || [];
    const details = offer.details?.[locale] || [];

    return (
        <article className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-40 w-full">
                <Image
                    src={offer.image[locale]}
                    alt={offer.title[locale]}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
                <OfferHeader offer={offer} locale={locale} />

                {/* <OfferRouteMeta offer={offer} locale={locale} /> */}

                {/* Tags */}
                {/* {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                        {tags.map((tag) => (
                            <OfferTag key={tag} label={tag} />
                        ))}
                    </div>
                )} */}

                {/* Details (نبذة مختصرة) */}
                {/* <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {details.slice(0, 3).map((line, index) => (
                        <li key={index}>• {line}</li>
                    ))}
                </ul> */}

                {/* Footer (السعر + زر) */}
                <div className="mt-auto flex items-center justify-between pt-3 border-t">
                    <OfferPrice
                        amount={offer.priceFrom.amount}
                        currency={offer.priceFrom.currency}
                        locale={locale}
                    />
                    <Link
                        href={`/offers/${offer.slug}`}
                        className="rounded-sm px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 bg-accent-500 hover:bg-accent-600 transition-colors dark:text-white"
                    >
                        {o("view_details")}
                    </Link>
                </div>
            </div>
        </article>
    );
}
