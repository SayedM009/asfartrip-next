"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Calendar } from "@/components/ui/calendar";
import useCalendarLocale from "@/app/_hooks/useCalendarLocale";
import handleRangeSelect from "@/app/_helpers/handleRangeSelect";

/**
 * DateBottomSheet - Full-screen calendar sheet
 *
 * Features:
 * - Single date selection for one-way
 * - Range selection for round-trip
 * - 12 months scrollable calendar
 * - Reuses existing calendar component and hooks
 */
export default function DateBottomSheet({
    isOpen,
    onClose,
    tripType,
    departDate,
    range,
    onDepartDateChange,
    onRangeChange,
}) {
    const t = useTranslations("Calender");
    const { dateLocale } = useCalendarLocale();

    const handleApply = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b ">
                <button
                    type="button"
                    onClick={onClose}
                    className="p-2 -m-2 "
                    aria-label={t("close") || "Close"}
                >
                    <X className="w-6 h-6" />
                </button>
                <h2 className="text-lg font-bold text-black dark:text-white ">
                    {t("select_date") || "Select dates"}
                </h2>
            </div>

            {/* Calendar */}
            <div className="flex-1 overflow-y-auto p-4">
                {tripType === "roundtrip" ? (
                    <Calendar
                        mode="range"
                        selected={range}
                        onSelect={(newRange) =>
                            handleRangeSelect(newRange, onRangeChange, range)
                        }
                        className="rounded-lg w-full bg-transparent  text-black dark:text-white "
                        numberOfMonths={12}
                        hideNavigation
                        locale={dateLocale}
                        disabled={(date) => date < new Date()}
                    />
                ) : (
                    <Calendar
                        mode="single"
                        selected={departDate}
                        onSelect={onDepartDateChange}
                        className="rounded-lg w-full bg-transparent  text-black dark:text-white "
                        numberOfMonths={12}
                        hideNavigation
                        locale={dateLocale}
                        disabled={(date) => date < new Date()}
                    />
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t ">
                <button
                    type="button"
                    onClick={handleApply}
                    // className="w-full h-12 bg-[#0062E3] text-white  font-bold text-base rounded-full shadow-lg transition-all"
                    className="w-full h-12 bg-accent-500 text-white  font-bold text-base rounded-full shadow-lg transition-all"
                >
                    {t("apply") || "Apply"}
                </button>
            </div>
        </div>
    );
}
