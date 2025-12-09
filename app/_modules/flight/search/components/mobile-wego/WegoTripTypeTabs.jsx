"use client";

import { useTranslations } from "next-intl";

/**
 * WegoTripTypeTabs - Pill-style segmented control
 *
 * Matches Wego screenshot: One-way / Round-trip only (NO multi-city)
 * Pill with border, selected state has filled background
 */
export default function WegoTripTypeTabs({ tripType, onTripTypeChange }) {
    const t = useTranslations("Flight");

    return (
        <div className=" p-1.5 flex gap-4 justify-center">
            {/* One-way Tab */}
            <button
                onClick={() => onTripTypeChange("oneway")}
                className={` p-2  text-sm font-bold rounded-lg transition-all duration-200 ${
                    tripType === "oneway"
                        ? "bg-accent-200  shadow-sm border border-accent-500 text-black"
                        : "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700"
                }`}
            >
                {t("one_way")}
            </button>

            {/* Round-trip Tab */}
            <button
                onClick={() => onTripTypeChange("roundtrip")}
                className={` p-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                    tripType === "roundtrip"
                        ? "bg-accent-200  shadow-sm border border-accent-500 text-black dark:text-black"
                        : "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700"
                }`}
            >
                {t("round_trip")}
            </button>
        </div>
    );
}
