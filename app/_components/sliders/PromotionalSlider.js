"use client";
import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import {
    ChevronLeft,
    ChevronRight,
    Plane,
    MapPin,
    Clock,
    Star,
} from "lucide-react";
import { cn } from "../ui/utils";
import Image from "next/image";
import { useTranslations } from "next-intl";
import useCheckLocal from "../../_hooks/useCheckLocal";

const promoCards = [
    {
        id: "1",
        title: "Summer Getaway",
        subtitle: "Up to 35% Off",
        discount: "35%",
        description: "Book your dream vacation now",
        backgroundColor:
            "bg-gradient-to-br from-orange-400 via-orange-500 to-red-500",
        textColor: "text-white",
        buttonColor: "bg-white text-orange-600 hover:bg-gray-100",
        icon: <Plane className="h-6 w-6" />,
    },
    {
        id: "2",
        title: "BSF Hotels",
        subtitle: "Up to 20% Off",
        discount: "20%",
        description: "On Hotels & Flights for all BSF credit cardholders",
        backgroundColor:
            "bg-gradient-to-br from-gray-800 via-gray-900 to-black",
        textColor: "text-white",
        buttonColor: "bg-yellow-400 text-gray-900 hover:bg-yellow-300",
        icon: <Star className="h-6 w-6" />,
    },
    {
        id: "3",
        title: "Travel More",
        subtitle: "Best Travel Program",
        discount: "25%",
        description: "Discover amazing destinations",
        backgroundColor:
            "bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500",
        textColor: "text-white",
        buttonColor: "bg-white text-teal-600 hover:bg-gray-100",
        icon: <MapPin className="h-6 w-6" />,
    },
    {
        id: "4",
        title: "Weekend Special",
        subtitle: "Limited Time Offer",
        discount: "40%",
        description: "Quick weekend trips at unbeatable prices",
        backgroundColor:
            "bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600",
        textColor: "text-white",
        buttonColor: "bg-white text-purple-600 hover:bg-gray-100",
        icon: <Clock className="h-6 w-6" />,
    },
    {
        id: "5",
        title: "Business Class",
        subtitle: "Premium Experience",
        discount: "15%",
        description: "Upgrade your journey with luxury",
        backgroundColor:
            "bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600",
        textColor: "text-white",
        buttonColor: "bg-white text-green-600 hover:bg-gray-100",
        icon: <Star className="h-6 w-6" />,
    },
];

export function PromotionalSlider() {
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const t = useTranslations("Offers_slider");
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
            className="py-8 px-4  lg:px-8 bg-background mt-3 sm:mt-5"
            style={{ paddingRight: "0", paddingLeft: "0" }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-2 sm:mb-6">
                    <div>
                        <div className="flex items-center sm:mb-2 gap-2">
                            <Image
                                // src="/icons/fire.gif"
                                src="/icons/fire.svg"
                                alt="offers"
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
                        {promoCards.map((card) => (
                            <div
                                key={card.id}
                                className="flex-shrink-0 w-[36vw] sm:w-72 lg:w-80"
                                style={{ scrollSnapAlign: "start" }}
                            >
                                <div
                                    className={cn(
                                        "h-40 rounded-2xl p-6 relative overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-105",
                                        card.backgroundColor
                                    )}
                                >
                                    {/* Background Pattern/Decoration */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/20" />
                                        <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white/10" />
                                        <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-white/5" />
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 h-full flex flex-col justify-between">
                                        <div>
                                            {/* Icon and Discount Badge */}
                                            <div className="flex items-center justify-between mb-3">
                                                {/* <div
                                                    className={cn(
                                                        "p-2 rounded-lg bg-white/20",
                                                        card.textColor
                                                    )}
                                                >
                                                    {card.icon}
                                                </div> */}
                                                {/* <div className="bg-white/90 text-gray-900 px-3 py-1 rounded-full font-bold text-xs">
                                                    Up to {card.discount} OFF
                                                </div> */}
                                            </div>

                                            {/* Title and Subtitle */}
                                            <div className="mb-2">
                                                {/* <h3
                                                    className={cn(
                                                        "text-xs sm:text-xl font-bold mb-1",
                                                        card.textColor
                                                    )}
                                                >
                                                    {card.title}
                                                </h3>
                                                <p
                                                    className={cn(
                                                        "text-sm opacity-90",
                                                        card.textColor
                                                    )}
                                                >
                                                    {card.subtitle}
                                                </p> */}
                                            </div>

                                            {/* Description */}
                                            {/* <p
                                                className={cn(
                                                    "text-sm opacity-80 mb-4",
                                                    card.textColor
                                                )}
                                            >
                                                {card.description}
                                            </p> */}
                                        </div>

                                        {/* CTA Button */}
                                        {/* <Button
                                            size="sm"
                                            className={cn(
                                                "self-start font-semibold transition-all duration-200",
                                                card.buttonColor
                                            )}
                                        >
                                            Book Now
                                        </Button> */}
                                    </div>

                                    {/* Hover Effect Overlay */}
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
