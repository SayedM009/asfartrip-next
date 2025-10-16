"use client";
import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../ui/utils";
import { useTranslations } from "next-intl";

import Image from "next/image";
import useCheckLocal from "../../_hooks/useCheckLocal";
import useDisplayShortDate from "@/app/_hooks/useDisplayShortDate";
import { useCurrency } from "@/app/_context/CurrencyContext";
import { useRouter } from "@/i18n/navigation";
import { addDays, format } from "date-fns";

const destinations = [
    {
        id: "1",
        from: "dubai",
        fromCode: "DXB",
        to: "riyadh",
        toCode: "RUH",
        backgroundColor:
            "bg-gradient-to-br from-orange-400 via-orange-500 to-red-500",
        img: "/destinations/riyadh.jpg",
        date: "2025-09-12T00:00:00.000Z",
        time: "1h 40m",
        isDirect: Math.random() < 0.5,
        price: Math.floor(Math.random() * 901) + 100,
    },
    {
        id: "2",
        from: "dubai",
        fromCode: "DXB",
        to: "salalah",
        toCode: "SLL",
        backgroundColor:
            "bg-gradient-to-br from-gray-800 via-gray-900 to-black",
        textColor: "text-white",
        img: "/destinations/salalah.jpg",
        date: "2025-09-15T00:00:00.000Z",
        time: "1h 50m",
        isDirect: Math.random() < 0.5,
        price: Math.floor(Math.random() * 901) + 100,
    },
    {
        id: "3",
        from: "dubai",
        fromCode: "DXB",
        to: "trabzon",
        toCode: "TZX",
        backgroundColor:
            "bg-gradient-to-br from-gray-800 via-gray-900 to-black",
        textColor: "text-white",
        img: "/destinations/trabzon.jpg",
        date: "2025-09-20T00:00:00.000Z",
        time: "4h 0m",
        isDirect: Math.random() < 0.5,
        price: Math.floor(Math.random() * 901) + 100,
    },
    {
        id: "4",
        from: "dubai",
        fromCode: "DXB",
        to: "tbilisi",
        toCode: "TBS",
        backgroundColor:
            "bg-gradient-to-br from-gray-800 via-gray-900 to-black",
        textColor: "text-white",
        img: "/destinations/tbilisi.webp",
        date: "2025-09-25T00:00:00.000Z",
        time: "3h 30m",
        isDirect: Math.random() < 0.5,
        price: Math.floor(Math.random() * 901) + 100,
    },
    {
        id: "5",
        from: "dubai",
        fromCode: "DXB",
        to: "saraievo",
        toCode: "SJJ",
        backgroundColor:
            "bg-gradient-to-br from-gray-800 via-gray-900 to-black",
        textColor: "text-white",
        img: "/destinations/saraievo.jpg",
        date: "2025-09-28T00:00:00.000Z",
        time: "5h 0m",
        isDirect: Math.random() < 0.5,
        price: Math.floor(Math.random() * 901) + 100,
    },
    {
        id: "6",
        from: "dubai",
        fromCode: "DXB",
        to: "vienna",
        toCode: "VIE",
        backgroundColor:
            "bg-gradient-to-br from-gray-800 via-gray-900 to-black",
        textColor: "text-white",
        img: "/destinations/vienna.jpg",
        date: "2025-10-02T00:00:00.000Z",
        time: "6h 0m",
        isDirect: Math.random() < 0.5,
        price: Math.floor(Math.random() * 901) + 100,
    },
    {
        id: "7",
        from: "dubai",
        fromCode: "DXB",
        to: "salzburg",
        toCode: "SZG",
        backgroundColor:
            "bg-gradient-to-br from-gray-800 via-gray-900 to-black",
        textColor: "text-white",
        img: "/destinations/salzburg.jpg",
        date: "2025-10-05T00:00:00.000Z",
        time: "6h 20m",
        isDirect: Math.random() < 0.5,
        price: Math.floor(Math.random() * 901) + 100,
    },
    {
        id: "8",
        from: "dubai",
        fromCode: "DXB",
        to: "cairo",
        toCode: "CAI",
        backgroundColor:
            "bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500",
        textColor: "text-white",
        img: "/destinations/cairo.jpg",
        date: "2025-09-10T00:00:00.000Z",
        time: "3h 0m",
        isDirect: Math.random() < 0.5,
        price: Math.floor(Math.random() * 901) + 100,
    },
];

export function FlightsSlider() {
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const router = useRouter();
    const t = useTranslations("Flights_slider");
    const { isRTL } = useCheckLocal();
    const displayShortDate = useDisplayShortDate();

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const containerWidth = scrollContainerRef.current.clientWidth;
            const scrollAmount = containerWidth * 0.8;

            const currentScroll = scrollContainerRef.current.scrollLeft;
            let newScrollPosition;

            if (direction === "left") {
                newScrollPosition = currentScroll - scrollAmount;
            } else {
                newScrollPosition = currentScroll + scrollAmount;
            }

            scrollContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: "smooth",
            });
        }
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } =
                scrollContainerRef.current;

            if (isRTL) {
                // في RTL، نحتاج لحساب الموضع بشكل مختلف
                const maxScrollLeft = scrollWidth - clientWidth;
                setCanScrollRight(Math.abs(scrollLeft) > 1);
                setCanScrollLeft(Math.abs(scrollLeft) < maxScrollLeft - 1);
            } else {
                // LTR المنطق العادي
                setCanScrollLeft(scrollLeft > 1);
                setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
            }
        }
    };

    // Convert Currency
    const { formatPrice } = useCurrency();

    function handleSlideClick(card) {
        const searchObject = {
            origin: card.fromCode,
            destination: card.toCode,
            depart_date: format(addDays(new Date(), 2), "dd-MM-yyyy"),
            ADT: 1,
            CHD: 0,
            INF: 0,
            class: "Economy",
            type: "O",
        };

        const cities = {
            departure: { city: card.from, label_code: card.from.toUpperCase() },
            destination: { city: card.to, label_code: card.to.toUpperCase() },
        };

        const params = new URLSearchParams();
        params.set("searchObject", JSON.stringify(searchObject));
        params.set("cities", JSON.stringify(cities));
        router.push(`/flights/search?${params.toString()}`);
    }
    return (
        <div
            className="pb-8 px-4  lg:px-8 bg-background sm:mt-5"
            style={{ paddingRight: "0", paddingLeft: "0" }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-2 sm:mb-6">
                    <div>
                        <div className="flex items-center sm:mb-2 gap-2">
                            <Image
                                // src="/icons/airplane-m.gif"
                                src="/icons/airplane.svg"
                                alt="Destination dream trip"
                                width={30}
                                height={30}
                                // unoptimized
                                // priority
                                // fetchPriority="high"
                                loading="lazy"
                            />
                            <h2 className="text-md uppercase sm:text-2xl font-bold text-foreground mb-0  ">
                                {t("title")}
                            </h2>
                        </div>

                        <p className="text-xs sm:text-lg text-muted-foreground">
                            {t("sub_title")}
                        </p>
                    </div>

                    {/* Desktop Navigation Buttons */}
                    <div
                        className={`hidden sm:flex gap-2 ${
                            isRTL && "flex-row-reverse"
                        }`}
                    >
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => scroll("left")}
                            disabled={!canScrollLeft}
                            className="h-10 w-10 cursor-pointer disabled:cursor-not-allowed"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => scroll("right")}
                            disabled={!canScrollRight}
                            className="h-10 w-10 cursor-pointer disabled:cursor-not-allowed"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Slider Container */}
                <div className="relative">
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-1"
                        style={{
                            scrollSnapType: "x mandatory",
                        }}
                    >
                        {destinations.map((card) => (
                            <div
                                key={card.id}
                                className="flex-shrink-0 w-[80vw] sm:w-72 lg:w-80"
                                style={{ scrollSnapAlign: "start" }}
                                onClick={() => handleSlideClick(card)} // 👈 أضف هذا
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
                                                <h4>
                                                    {displayShortDate(
                                                        card.date
                                                    )}
                                                </h4>
                                                <h4>{card.time}</h4>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <h4>
                                                    {t("start_from")}{" "}
                                                    <span className="text-accent-500">
                                                        {formatPrice(
                                                            card.price
                                                        )}
                                                    </span>
                                                </h4>
                                                <h4 className="bg-gray-300 rounded-sm px-2 text-gray-900 text-xs">
                                                    {card.isDirect &&
                                                        t("direct")}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
