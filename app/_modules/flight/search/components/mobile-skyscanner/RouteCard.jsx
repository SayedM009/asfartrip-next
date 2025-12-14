"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import SwapButton from "./SwapButton";
import LocationBottomSheet from "./LocationBottomSheet";

/**
 * RouteCard - Skyscanner-style From/To card with stacked rows
 *
 * Features:
 * - Two stacked location rows in a rounded card
 * - Swap button positioned at vertical center
 * - Opens bottom sheet for airport search
 */
export default function RouteCard({
    departure,
    destination,
    onDepartureChange,
    onDestinationChange,
    onSwap,
    locale,
}) {
    const t = useTranslations("Flight");
    const [departureSheetOpen, setDepartureSheetOpen] = useState(false);
    const [destinationSheetOpen, setDestinationSheetOpen] = useState(false);

    return (
        <div className="relative">
            <div className=" overflow-hidden space-y-2">
                {/* From Row */}
                <button
                    type="button"
                    onClick={() => setDepartureSheetOpen(true)}
                    className="w-full flex items-start gap-4 p-3 text-end dark:bg-[#243346]  hover:bg-[#0D2D4D] transition-colors rounded-2xl border  dark:border-0"
                    aria-label={t("from") || "From"}
                >
                    <PlaneIcon className="w-5 h-5 rotate-55 text-black dark:text-white flex-shrink-0" />

                    <div className="flex-1 min-w-0 text-left rtl:text-right">
                        {departure?.city ? (
                            <span className="text-black dark:text-white font-medium truncate block">
                                {departure.city}
                            </span>
                        ) : (
                            <span className="text-gray-400">
                                {t("from") || "From"}
                            </span>
                        )}
                    </div>
                </button>

                {/* To Row */}
                <button
                    type="button"
                    onClick={() => setDestinationSheetOpen(true)}
                    className="w-full flex items-center gap-4 p-3 text-start dark:bg-[#243346] hover:bg-[#0D2D4D] transition-colors rounded-2xl border dark:border-0"
                    aria-label={t("to") || "To"}
                >
                    <PlaneIcon className="w-5 h-5 rotate-125 text-black dark:text-white flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        {destination?.city ? (
                            <span className="text-black dark:text-white font-medium truncate block">
                                {destination.city}
                            </span>
                        ) : (
                            <span className="text-gray-400">
                                {t("to") || "To"}
                            </span>
                        )}
                    </div>
                </button>
            </div>

            {/* Swap Button - Positioned at vertical center */}
            <SwapButton onSwap={onSwap} />

            {/* Bottom Sheets */}
            <LocationBottomSheet
                isOpen={departureSheetOpen}
                onClose={() => setDepartureSheetOpen(false)}
                type="departure"
                onSelect={(airport) => {
                    onDepartureChange(airport);
                    setDepartureSheetOpen(false);
                }}
                locale={locale}
            />

            <LocationBottomSheet
                isOpen={destinationSheetOpen}
                onClose={() => setDestinationSheetOpen(false)}
                type="arrival"
                onSelect={(airport) => {
                    onDestinationChange(airport);
                    setDestinationSheetOpen(false);
                }}
                locale={locale}
            />
        </div>
    );
}

function PlaneIcon({
    className = "w-5 h-5 rotate-45 text-black dark:text-white flex-shrink-0",
}) {
    return (
        <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={className}
        >
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
    );
}
