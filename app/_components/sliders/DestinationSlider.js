"use client";
import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "../ui/utils";
import Image from "next/image";
import { useTranslations } from "next-intl";
import useCheckLocal from "../../_hooks/useCheckLocal";

const destinations = [
    {
        id: "1",
        city: "dubai",
        country: "uae",
        backgroundColor:
            "bg-gradient-to-br from-orange-400 via-orange-500 to-red-500",
        img: "/destinations/Dubai.jpg",
    },
    {
        id: "2",
        city: "phuket",
        country: "thailand",

        backgroundColor:
            "bg-gradient-to-br from-gray-800 via-gray-900 to-black",
        textColor: "text-white",
        img: "/destinations/tailand.jpg",
    },
    {
        id: "3",
        city: "istanbul",
        country: "turkey",

        backgroundColor:
            "bg-gradient-to-br from-gray-800 via-gray-900 to-black",
        textColor: "text-white",
        img: "/destinations/istanbul.jpg",
    },
    {
        id: "4",
        city: "salalah",
        country: "oman",

        backgroundColor:
            "bg-gradient-to-br from-gray-800 via-gray-900 to-black",
        textColor: "text-white",
        img: "/destinations/salalah.jpg",
    },
    {
        id: "5",
        city: "kuala_lumpur",
        country: "malaysia",

        backgroundColor:
            "bg-gradient-to-br from-gray-800 via-gray-900 to-black",
        textColor: "text-white",
        img: "/destinations/malaysia.jpg",
    },
];

export function DestinationSlider() {
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const t = useTranslations("Destination_slider");
    const { isRTL } = useCheckLocal();

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const containerWidth = scrollContainerRef.current.clientWidth;
            const scrollAmount = containerWidth * 0.8;

            // في RTL نستخدم نفس المنطق ولكن نحسب بناءً على الموضع الحالي
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

    return (
        <div
            className="py-8 px-4  lg:px-8 bg-background sm:mt-5"
            style={{ paddingRight: "0", paddingLeft: "0" }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-2 sm:mb-6">
                    <div>
                        <div className="flex items-center sm:mb-2 gap-2">
                            <Image
                                // src="/icons/globe.gif"
                                src="/icons/globe.svg"
                                alt="Destination dream trip"
                                width={30}
                                height={30}
                                // unoptimized
                                priority
                                fetchPriority="high"
                                loading="eager"
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
                                        alt={`${card.city}, ${card.country}`}
                                        fill
                                        className="object-cover"
                                        priority
                                        fetchPriority="high"
                                        loading="eager"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                                    {/* Content */}
                                    <div className="relative z-10 h-full flex flex-col justify-end mt-3">
                                        <h3 className="text-white text-xl font-semibold capitalize">
                                            {t(`cities.${card.city}`)},{" "}
                                            {t(`countries.${card.country}`)}
                                        </h3>
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
