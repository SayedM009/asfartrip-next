"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeftRight } from "lucide-react";
import WegoDestinationSearchDialog from "./WegoDestinationSearchDialog";

/**
 * WegoLocationSelector - Compact From/To display with swap
 *
 * Wego-style vertical layout with swap button.
 * Uses WegoDestinationSearchDialog for improved mobile UX.
 */
export default function WegoLocationSelector({
    departure,
    destination,
    onDepartureChange,
    onDestinationChange,
    onSwap,
    locale,
}) {
    const t = useTranslations("Flight");
    const [rotationCount, setRotationCount] = useState(0);

    const handleSwap = () => {
        setRotationCount((prev) => prev + 1);
        onSwap();
    };

    // Calculate rotation: base 90deg + 180deg for each click
    const rotationDegrees = 90 + rotationCount * 180;

    return (
        <div className="relative overflow-hidden">
            {/* From Section */}
            <div className="p-4 border-b border-border">
                <WegoDestinationSearchDialog
                    destination={departure}
                    onSelect={onDepartureChange}
                    locale={locale}
                    type="departure"
                />
            </div>

            {/* Swap Button */}
            <button
                onClick={handleSwap}
                className="absolute right-4 rtl:left-4 rtl:right-auto top-1/2 -translate-y-1/2 w-8 h-10 border bg-background rounded-full flex items-center justify-center shadow-lg transition-colors z-10"
                aria-label={t("swap_locations") || "Swap locations"}
            >
                <ArrowLeftRight
                    className="w-5 h-5 transition-transform duration-300 dark:text-white"
                    style={{ transform: `rotate(${rotationDegrees}deg)` }}
                />
            </button>

            {/* To Section */}
            <div className="p-4">
                <WegoDestinationSearchDialog
                    destination={destination}
                    onSelect={onDestinationChange}
                    locale={locale}
                    type="arrival"
                />
            </div>
        </div>
    );
}
