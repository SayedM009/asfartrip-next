"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useDateFormatter } from "@/app/_hooks/useDisplayShortDate";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import DateBottomSheet from "./DateBottomSheet";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";

/**
 * DateSelectorRow - Skyscanner-style date selector row
 *
 * Features:
 * - One-way: Single date box
 * - Round-trip: Two date boxes side by side
 * - Shows nights between dates for round-trip
 */
export default function DateSelectorRow({
    tripType,
    departDate,
    range,
    onDepartDateChange,
    onRangeChange,
}) {
    const t = useTranslations("Calender");
    const { isRTL } = useCheckLocal();
    const formatDate = useDateFormatter();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const pattern = isRTL ? "EEEE، d MMMM" : "EEE, d MMM";

    // Get departure date based on trip type
    const displayDepartDate = tripType === "oneway" ? departDate : range?.from;
    const displayReturnDate = tripType === "roundtrip" ? range?.to : null;

    return (
        <>
            <div className="flex gap-2">
                {/* Departure Date */}
                <button
                    type="button"
                    onClick={() => setIsSheetOpen(true)}
                    className="flex-1 flex items-center gap-3 p-3  rounded-2xl text-start dark:bg-[#243346] hover:bg-[#0D2D4D] transition-colors border dark:border-0"
                    aria-label={t("departure_date") || "Departure date"}
                >
                    <CalendarDaysIcon className="w-5 h-5 text-black dark:text-white flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="text-black dark:text-white font-medium truncate">
                            {displayDepartDate ? (
                                formatDate(displayDepartDate, { pattern })
                            ) : (
                                <span className="text-xs text-black dark:text-white mb-0.5">
                                    {t("departure_date") || "Depart"}
                                </span>
                            )}
                        </div>
                    </div>
                </button>

                {/* Return Date (round-trip only) */}
                {tripType === "roundtrip" && (
                    <button
                        type="button"
                        onClick={() => setIsSheetOpen(true)}
                        className="flex-1 flex items-center gap-3 p-3  rounded-2xl text-start dark:bg-[#243346] hover:bg-[#0D2D4D] transition-colors border dark:border-0"
                        aria-label={t("return_date") || "Return date"}
                    >
                        <CalendarDaysIcon className="w-5 h-5  flex-shrink-0 text-black dark:text-white" />
                        <div className="flex-1 min-w-0">
                            <div className="text-black dark:text-white font-medium truncate">
                                {displayReturnDate ? (
                                    formatDate(displayReturnDate, { pattern })
                                ) : (
                                    <span className="text-xs text-black dark:text-white  mb-0.5">
                                        {t("return_date") || "Return"}
                                    </span>
                                )}
                            </div>
                        </div>
                    </button>
                )}
            </div>

            {/* Date Bottom Sheet */}
            <DateBottomSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                tripType={tripType}
                departDate={departDate}
                range={range}
                onDepartDateChange={onDepartDateChange}
                onRangeChange={onRangeChange}
            />
        </>
    );
}
