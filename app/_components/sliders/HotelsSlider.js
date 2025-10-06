"use client";
import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "../ui/utils";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { format, parseISO } from "date-fns";
import useCheckLocal from "../../_hooks/useCheckLocal";
import { StarIcon } from "@heroicons/react/24/solid";

const destinations = [
    {
        id: "1",
        title: "atlantis",
        location: "dubai",
        backgroundColor:
            "bg-gradient-to-br from-orange-400 via-orange-500 to-red-500",
        img: "/hotels/atlantis.jpg",
        date: "2025-09-12T00:00:00.000Z", // ISO format
        time: "1h 40m",
        isDirect: Math.random() < 0.5,
        price: Math.floor(Math.random() * 901) + 100 + " USD",
    },
    {
        id: "2",
        title: "one",
        location: "dubai",
        backgroundColor:
            "bg-gradient-to-br from-gray-800 via-gray-900 to-black",
        textColor: "text-white",
        img: "/hotels/one.webp",
        date: "2025-09-15T00:00:00.000Z",
        time: "1h 50m",
        isDirect: Math.random() < 0.5,
        price: Math.floor(Math.random() * 901) + 100 + " USD",
    },
    {
        id: "3",
        title: "salalah",
        location: "salalah",
        backgroundColor:
            "bg-gradient-to-br from-gray-800 via-gray-900 to-black",
        textColor: "text-white",
        img: "/hotels/salalah.webp",
        date: "2025-09-20T00:00:00.000Z",
        time: "4h 0m",
        isDirect: Math.random() < 0.5,
        price: Math.floor(Math.random() * 901) + 100 + " USD",
    },
    {
        id: "4",
        title: "mazagan",
        location: "eljadida",
        backgroundColor:
            "bg-gradient-to-br from-gray-800 via-gray-900 to-black",
        textColor: "text-white",
        img: "/hotels/mazagan.jpg",
        date: "2025-09-25T00:00:00.000Z",
        time: "3h 30m",
        isDirect: Math.random() < 0.5,
        price: Math.floor(Math.random() * 901) + 100 + " USD",
    },
];

export function HotelsSlider() {
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const t = useTranslations("Hotels_slider");
    const { isRTL } = useCheckLocal();
    function formatDate(isoDate) {
        if (!isoDate) return "";
        return format(parseISO(isoDate), "dd MMM");
    }

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
                                // src="/icons/bed-m.gif"
                                src="/icons/bed.svg"
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
                                        alt={`${card.from}, ${card.to}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                                    {/* Content */}
                                    <div className=" z-10 h-full flex flex-col justify-end mt-3 ">
                                        <div className="text-white text-xl font-semibold capitalize bg-[#111] absolute w-full left-0 bottom-0 right-0 py-2 px-3">
                                            <h3 className="flex items-center gap-2 text-sm">
                                                {t(`hotels.${card.title}`)}
                                            </h3>
                                            <div className="flex items-center justify-between text-sm font-normal text-gray-400">
                                                {t(
                                                    `locations.${card.location}`
                                                )}
                                                <span className="flex text-xs items-center gap-1">
                                                    5
                                                    <StarIcon className="size-3 text-white" />
                                                </span>
                                            </div>
                                            {/* <div className="flex items-center justify-between text-sm">
                                                <h4>Start from {card.price}</h4>
                                                <h4 className="bg-gray-300 rounded-sm px-2 text-gray-900 text-xs">
                                                    {card.isDirect && "Direct"}
                                                </h4>
                                            </div> */}
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
