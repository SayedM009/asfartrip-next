"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin, Star, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { useRecommendedHotels } from "../../hooks";

// Hotel card skeleton
// function HotelCardSkeleton() {
//     return (
//         <div className="flex-shrink-0 w-64 sm:w-72 rounded-xl overflow-hidden border bg-card">
//             <Skeleton className="h-52 w-full" />
//             <div className="p-4 space-y-0">
//                 <Skeleton className="h-4 w-3/4" />
//                 <Skeleton className="h-3 w-full" />
//                 <Skeleton className="h-3 w-1/2" />
//             </div>
//         </div>
//     );
// }

// Hotel image with fallback
function HotelImage({ src, alt }) {
    const [imgSrc, setImgSrc] = useState(src || "/no-image.webp");

    return (
        <Image
            src={imgSrc}
            alt={alt}
            fill
            className="object-cover"
            sizes="288px"
            onError={() => setImgSrc("/no-image.webp")}
        />
    );
}

// Convert city name to translation key (e.g., "New York" -> "new_york")
function getCityKey(cityName) {
    return cityName
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[áàâä]/g, "a")
        .replace(/[éèêë]/g, "e")
        .replace(/[íìîï]/g, "i")
        .replace(/[óòôö]/g, "o")
        .replace(/[úùûü]/g, "u")
        .replace(/ñ/g, "n")
        .replace(/ã/g, "a");
}

// Capitalize first letter of each word
function capitalize(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function ContinentHotelsSlider() {
    const citiesScrollRef = useRef(null);
    const hotelsScrollRef = useRef(null);

    // Cities scroll state
    const [canScrollCitiesLeft, setCanScrollCitiesLeft] = useState(false);
    const [canScrollCitiesRight, setCanScrollCitiesRight] = useState(true);

    // Hotels scroll state
    const [canScrollHotelsLeft, setCanScrollHotelsLeft] = useState(false);
    const [canScrollHotelsRight, setCanScrollHotelsRight] = useState(true);

    const t = useTranslations("ContinentHotels");
    const { isRTL } = useCheckLocal();

    const {
        selectedContinent,
        selectedCity,
        hotels,
        isLoading,
        error,
        cities,
        continents,
        changeContinent,
        selectCity,
        clearSelection,
    } = useRecommendedHotels("asia", "Dubai");

    // Get translated city name or fallback to original with capitalize
    const getCityDisplayName = useCallback(
        (cityName) => {
            const key = getCityKey(cityName);
            const translated = t.raw(`cities.${key}`);
            // If translation exists, use it, otherwise capitalize original name
            return translated && !translated.startsWith("cities.")
                ? translated
                : capitalize(cityName);
        },
        [t],
    );

    // Scroll function - same logic as DestinationSlider
    const scrollCities = (direction) => {
        if (citiesScrollRef.current) {
            const containerWidth = citiesScrollRef.current.clientWidth;
            const scrollAmount = containerWidth * 0.8;
            const currentScroll = citiesScrollRef.current.scrollLeft;

            let newScrollPosition;
            if (direction === "left") {
                newScrollPosition = currentScroll - scrollAmount;
            } else {
                newScrollPosition = currentScroll + scrollAmount;
            }

            citiesScrollRef.current.scrollTo({
                left: newScrollPosition,
                behavior: "smooth",
            });
        }
    };

    const scrollHotels = (direction) => {
        if (hotelsScrollRef.current) {
            const containerWidth = hotelsScrollRef.current.clientWidth;
            const scrollAmount = containerWidth * 0.8;
            const currentScroll = hotelsScrollRef.current.scrollLeft;

            let newScrollPosition;
            if (direction === "left") {
                newScrollPosition = currentScroll - scrollAmount;
            } else {
                newScrollPosition = currentScroll + scrollAmount;
            }

            hotelsScrollRef.current.scrollTo({
                left: newScrollPosition,
                behavior: "smooth",
            });
        }
    };

    // Handle cities scroll state
    const handleCitiesScroll = () => {
        if (citiesScrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } =
                citiesScrollRef.current;

            if (isRTL) {
                const maxScrollLeft = scrollWidth - clientWidth;
                setCanScrollCitiesRight(Math.abs(scrollLeft) > 1);
                setCanScrollCitiesLeft(
                    Math.abs(scrollLeft) < maxScrollLeft - 1,
                );
            } else {
                setCanScrollCitiesLeft(scrollLeft > 1);
                setCanScrollCitiesRight(
                    scrollLeft < scrollWidth - clientWidth - 1,
                );
            }
        }
    };

    // Handle hotels scroll state
    const handleHotelsScroll = () => {
        if (hotelsScrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } =
                hotelsScrollRef.current;

            if (isRTL) {
                const maxScrollLeft = scrollWidth - clientWidth;
                setCanScrollHotelsRight(Math.abs(scrollLeft) > 1);
                setCanScrollHotelsLeft(
                    Math.abs(scrollLeft) < maxScrollLeft - 1,
                );
            } else {
                setCanScrollHotelsLeft(scrollLeft > 1);
                setCanScrollHotelsRight(
                    scrollLeft < scrollWidth - clientWidth - 1,
                );
            }
        }
    };

    // Initialize cities scroll state on mount
    useEffect(() => {
        const timer = setTimeout(handleCitiesScroll, 200);
        return () => clearTimeout(timer);
    }, [cities, isRTL]);

    // Reset hotels scroll when hotels change
    useEffect(() => {
        if (hotels.length > 0 && hotelsScrollRef.current) {
            hotelsScrollRef.current.scrollLeft = 0;
            setTimeout(handleHotelsScroll, 200);
        }
    }, [hotels]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Image
                        src="/icons/hotel.webp"
                        alt="hotel icon"
                        width={22}
                        height={22}
                        className="w-5 h-5 md:w-7 md:h-7"
                        loading="eager"
                        priority={true}
                    />
                    <h2 className="text-md md:text-2xl font-bold uppercase">
                        {t("title")}
                    </h2>
                </div>

                {/* Cities Navigation Buttons */}
                <div
                    className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""} hidden md:flex`}
                >
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => scrollCities("left")}
                        disabled={!canScrollCitiesLeft}
                        className="h-8 w-8 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Scroll cities left"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => scrollCities("right")}
                        disabled={!canScrollCitiesRight}
                        className="h-8 w-8 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Scroll cities right"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Continent Tabs - No emojis */}
            <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {continents.map((continent) => (
                    <Button
                        key={continent.id}
                        variant={
                            selectedContinent === continent.id
                                ? "default"
                                : "outline"
                        }
                        className={cn(
                            "flex-shrink-0 transition-all px-4",
                            selectedContinent === continent.id &&
                                "bg-accent-500 text-white hover:bg-accent-600",
                        )}
                        onClick={() => changeContinent(continent.id)}
                    >
                        <span>{t(`continents.${continent.id}`)}</span>
                    </Button>
                ))}
            </div>

            {/* Cities Grid with scroll */}
            <div
                ref={citiesScrollRef}
                onScroll={handleCitiesScroll}
                className="flex gap-3 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
                style={{ scrollSnapType: "x mandatory" }}
            >
                {cities.map((city) => (
                    <div
                        key={`${city.name}-${city.country}`}
                        className={cn(
                            "flex-shrink-0 px-4 py-3 rounded-full cursor-pointer transition-all border",
                            selectedCity?.name === city.name
                                ? "border-accent-500 bg-accent-50 dark:bg-accent-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:border-accent-300",
                        )}
                        style={{ scrollSnapAlign: "start" }}
                        onClick={() => selectCity(city)}
                    >
                        <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-accent-500 flex-shrink-0" />
                            <span className="font-medium text-sm whitespace-nowrap">
                                {getCityDisplayName(city.name)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Hotels Section - Always show if city selected */}
            {selectedCity && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                            {t("hotels_in", {
                                city: getCityDisplayName(selectedCity.name),
                            })}
                        </h3>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearSelection}
                                className="text-muted-foreground hidden md:flex"
                            >
                                {t("clear")}
                            </Button>
                            {/* Hotels Navigation Buttons */}
                            <div
                                className={`flex gap-1 ${isRTL ? "flex-row-reverse" : ""} `}
                            >
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => scrollHotels("left")}
                                    disabled={!canScrollHotelsLeft || isLoading}
                                    className="h-8 w-8 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hidden md:flex"
                                    aria-label="Scroll hotels left"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => scrollHotels("right")}
                                    disabled={
                                        !canScrollHotelsRight || isLoading
                                    }
                                    className="h-8 w-8 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hidden md:flex"
                                    aria-label="Scroll hotels right"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Error State */}
                    {error && !isLoading && (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>{error}</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => selectCity(selectedCity)}
                            >
                                {t("retry")}
                            </Button>
                        </div>
                    )}

                    {/* Hotels Grid or Skeleton */}
                    {!error && (
                        <div
                            ref={hotelsScrollRef}
                            onScroll={handleHotelsScroll}
                            className="flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
                        >
                            {isLoading ? (
                                // Skeleton loading
                                <>
                                    {/* <HotelCardSkeleton />
                                    <HotelCardSkeleton />
                                    <HotelCardSkeleton />
                                    <HotelCardSkeleton /> */}
                                </>
                            ) : hotels.length > 0 ? (
                                // Hotels cards
                                hotels.map((hotel) => (
                                    <div
                                        key={hotel.id}
                                        className="flex-shrink-0 w-64 sm:w-72 rounded-xl overflow-hidden border bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                        <div className="relative h-52">
                                            <HotelImage
                                                src={hotel.image}
                                                alt={hotel.name}
                                            />
                                            {/* Rating badge - bottom right (LTR) / bottom left (RTL) */}
                                            {hotel.reviewScore && (
                                                <span
                                                    className={`absolute bottom-2 ${isRTL ? "left-2" : "right-2"} bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded`}
                                                >
                                                    {hotel.reviewScore}/5
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-4 space-y-2">
                                            <h4 className="font-semibold text-sm line-clamp-1">
                                                {/* Star rating inline */}
                                                <span className="inline-flex me-1">
                                                    {[
                                                        ...Array(
                                                            hotel.rating || 0,
                                                        ),
                                                    ].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                                        />
                                                    ))}
                                                </span>
                                                {hotel.name}
                                            </h4>
                                            <div className="flex items-start gap-1 text-xs text-muted-foreground">
                                                <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5" />
                                                <span className="line-clamp-2">
                                                    {hotel.address}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // No hotels
                                <div className="w-full text-center py-8 text-muted-foreground">
                                    <p>{t("no_hotels")}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
