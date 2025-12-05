"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { addDays, format } from "date-fns";

import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { Button } from "@/components/ui/button";
import FlightPromoCard from "../molecule/FlightPromoCard";
import Image from "next/image";

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
        isDirect: true,
        price: 999,
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
        isDirect: true,
        price: 999,
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
        isDirect: true,
        price: 999,
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
        isDirect: true,
        price: 999,
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
        isDirect: true,
        price: 999,
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
        isDirect: true,
        price: 999,
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
        isDirect: true,
        price: 999,
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
        isDirect: true,
        price: 999,
    },
];

export default function FlightsSlider() {
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const router = useRouter();
    const t = useTranslations("Flights_slider");
    const { isRTL } = useCheckLocal();

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
                // In RTL, we need to calculate position differently
                const maxScrollLeft = scrollWidth - clientWidth;
                setCanScrollRight(Math.abs(scrollLeft) > 1);
                setCanScrollLeft(Math.abs(scrollLeft) < maxScrollLeft - 1);
            } else {
                // LTR normal logic
                setCanScrollLeft(scrollLeft > 1);
                setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
            }
        }
    };

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
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-2 sm:mb-6">
                <div>
                    <div className="flex items-center sm:mb-2 gap-2">
                        <Image
                            src="/icons/air-freight.webp"
                            alt="take-off"
                            width={22}
                            height={22}
                            className="w-5 h-5 md:w-7 md:h-7"
                            loading="eager"
                            priority="true"
                        />

                        <h2 className="text-md uppercase sm:text-2xl font-bold text-foreground mb-0  ">
                            {t("title")}
                        </h2>
                    </div>

                    {/* <p className="text-xs sm:text-lg text-muted-foreground">
                        {t("sub_title")}
                    </p> */}
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
                        <FlightPromoCard
                            key={card.id}
                            card={card}
                            t={t}
                            isRTL={isRTL}
                            onClick={() => handleSlideClick(card)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
