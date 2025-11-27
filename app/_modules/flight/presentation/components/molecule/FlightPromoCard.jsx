"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AnimatedPrice from "@/app/_components/ui/AnimatedPrice";
import { cn } from "@/lib/utils";
import useDisplayShortDate from "@/app/_hooks/useDisplayShortDate";

export default function FlightPromoCard({ card, t, isRTL, onClick }) {
    const displayShortDate = useDisplayShortDate();

    return (
        <div
            className="flex-shrink-0 w-[80vw] sm:w-72 lg:w-80"
            style={{ scrollSnapAlign: "start" }}
            onClick={onClick}
        >
            <div
                className={cn(
                    "h-70 rounded-2xl p-6 relative overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-105",
                    card.backgroundColor
                )}
            >
                {/* Background Image */}
                <Image
                    src={card.img}
                    alt={`${card.from}, ${card.to}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Content */}
                <div className=" z-10 h-full flex flex-col justify-end mt-3 ">
                    <div className="text-white text-xl font-semibold capitalize bg-[#111] absolute w-full left-0 bottom-0 right-0 py-2 px-3">
                        <h3 className="flex items-center gap-2 text-md sm:text-sm">
                            {t(`cities.${card.from}`)}{" "}
                            {isRTL ? (
                                <ArrowLeft className="size-5" />
                            ) : (
                                <ArrowRight className="size-5" />
                            )}{" "}
                            {t(`cities.${card.to}`)}
                        </h3>
                        <div className="flex items-center justify-between text-sm font-normal text-gray-400 sm:text-xs">
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
                            <h4 className="bg-gray-300 rounded-sm px-2 text-gray-900 text-xs">
                                {card.isDirect && t("direct")}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
