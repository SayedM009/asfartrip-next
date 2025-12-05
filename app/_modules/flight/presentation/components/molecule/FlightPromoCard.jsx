"use client";

import Image from "next/image";
import AnimatedPrice from "@/app/_components/ui/AnimatedPrice";
import { cn } from "@/lib/utils";
import useDisplayShortDate from "@/app/_hooks/useDisplayShortDate";
import { useTranslations } from "next-intl";
import ChevronBasedOnLanguage from "@/app/_components/ui/ChevronBasedOnLanguage";

export default function FlightPromoCard({ card, isRTL, onClick }) {
    const displayShortDate = useDisplayShortDate();
    const t = useTranslations("Flights_slider");

    return (
        <div
            className="flex-shrink-0 w-[80vw] sm:w-72 lg:w-80"
            style={{ scrollSnapAlign: "start" }}
            onClick={onClick}
        >
            <div
                className={cn(
                    "h-70 rounded-2xl p-6 relative  group cursor-pointer transition-transform duration-300 hover:scale-105 border-0.5",
                    card.backgroundColor
                )}
            >
                {/* Background Image */}
                <Image
                    src={card.img}
                    alt={`${card.from}, ${card.to}`}
                    fill
                    className="object-cover rounded-2xl"
                    loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0  bg-gradient-to-t from-black via-black/30 to-transparent rounded-2xl" />

                {/* Content */}

                <div className="">
                    <div className="flex flex-col gap-0.5 text-xl font-semibold capitalize bg-background absolute left-0 right-0 -bottom-1  py-2 px-3 border-1 rounded-b-2xl">
                        <h3 className="flex items-center gap-2 text-md sm:text-sm font-bold">
                            {t(`cities.${card.from}`)}
                            <ChevronBasedOnLanguage icon="arrow" />
                            {t(`cities.${card.to}`)}
                        </h3>
                        <div className="flex items-center justify-between text-[10px] font-normal text-gray-400 sm:text-xs">
                            <h4>{displayShortDate(card.date)}</h4>
                            <h4>{card.time}</h4>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <h4>
                                {t("start_from")}{" "}
                                <span className="text-accent-500">
                                    <AnimatedPrice
                                        basePrice={card.price}
                                        duration={1}
                                        size={13}
                                    />
                                </span>
                            </h4>
                            <h4 className="bg-blue-100 rounded-sm px-2 py-1 text-gray-900 text-xs">
                                {card.isDirect && t("direct")}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
