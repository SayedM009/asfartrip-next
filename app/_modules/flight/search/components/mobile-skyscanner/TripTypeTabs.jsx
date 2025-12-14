"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import useCheckLocal from "@/app/_hooks/useCheckLocal";

/**
 * TripTypeTabs - Skyscanner-style horizontal tabs with underline indicator
 *
 * Features:
 * - Three tabs: Round-trip, One-way, Multi-city
 * - Active tab has underline indicator
 * - RTL: Tab order is mirrored
 */
export default function TripTypeTabs({ tripType, onTripTypeChange }) {
    const t = useTranslations("Flight");
    const { isRTL } = useCheckLocal();

    const tabs = [
        { id: "roundtrip", label: t("round_trip") },
        { id: "oneway", label: t("one_way") },
        // { id: "multicity", label: t("multi_city") || "Multi-city" },
    ];

    // For RTL, reverse the visual order
    const displayTabs = isRTL ? [...tabs].reverse() : tabs;

    return (
        <div className="relativ mb-5">
            <div
                className="flex justify-start gap-8 "
                role="tablist"
                aria-label={t("trip_type") || "Trip type selection"}
            >
                {displayTabs.map((tab) => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={tripType === tab.id}
                        tabIndex={tripType === tab.id ? 0 : -1}
                        onClick={() => onTripTypeChange(tab.id)}
                        className={`relative pb-2 text-sm font-medium transition-colors text-black dark:text-white `}
                    >
                        {tab.label}
                        {/* Animated underline indicator */}
                        {tripType === tab.id && (
                            <motion.div
                                layoutId="tripTypeIndicator"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"
                                initial={false}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                }}
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
