"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
    DialogDescription,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, X } from "lucide-react";
import { useDateFormatter } from "@/app/_hooks/useDisplayShortDate";
import { useTranslations } from "next-intl";
import useCalendarLocale from "@/app/_hooks/useCalendarLocale";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import useCalculateDaysBetween from "@/app/_hooks/useCalculateDaysBetween";
import { useState } from "react";

/**
 * WegoDateRangeDialog - Wego-style date picker with full-row clickable trigger
 *
 * Features:
 * - Full-row clickable areas for better mobile UX
 * - Dynamic display based on trip type (one-way vs round-trip)
 * - Shows departure date label + date when selected
 * - Shows round-trip dates side by side with days between
 */
export default function WegoDateRangeDialog({
    tripType,
    departDate,
    range,
    onDepartDateChange,
    onRangeDateChange,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations("Calender");
    const { isRTL } = useCheckLocal();
    const { dateLocale } = useCalendarLocale();
    const formatDate = useDateFormatter();
    const differenceInDays = useCalculateDaysBetween(range?.from, range?.to);

    const handleDayClick = (day) => {
        onRangeDateChange((prev) => {
            if (prev?.to) {
                return { from: day, to: undefined };
            } else if (prev?.from) {
                if (day < prev.from) {
                    return { from: day, to: undefined };
                } else {
                    return { from: prev.from, to: day };
                }
            } else {
                return { from: day, to: undefined };
            }
        });
    };

    const pattern = isRTL ? "EEEE, d MMMM" : "EEE, d MMM";

    // Check if dates are selected
    const hasDepartDate = tripType === "oneway" ? departDate : range?.from;
    const hasReturnDate = tripType === "roundtrip" && range?.to;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* Full-width clickable trigger */}
            <DialogTrigger className="w-full flex items-center gap-3 text-start py-2 px-2">
                <CalendarDays className="size-5 flex-shrink-0 text-muted-foreground dark:text-white" />

                {tripType === "roundtrip" ? (
                    // Round-trip: show departure - return dates
                    <div className="flex-1 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">
                                {t("departure_date")}
                            </span>
                            <span className="font-bold text-foreground">
                                {range?.from
                                    ? formatDate(range.from, {
                                          pattern: pattern,
                                      })
                                    : ""}
                            </span>
                        </div>
                        {differenceInDays && (
                            <span className="text-xs text-muted-foreground px-2">
                                {differenceInDays}
                            </span>
                        )}
                        <div className="flex flex-col text-end">
                            <span className="text-xs text-muted-foreground">
                                {t("return_date")}
                            </span>
                            <span className="font-bold text-foreground">
                                {range?.to
                                    ? formatDate(range.to, {
                                          pattern: pattern,
                                      })
                                    : ""}
                            </span>
                        </div>
                    </div>
                ) : (
                    // One-way: just show departure date
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                            {t("departure_date")}
                        </span>
                        <span className="font-bold text-foreground">
                            {departDate
                                ? formatDate(departDate, { pattern })
                                : ""}
                        </span>
                    </div>
                )}
            </DialogTrigger>

            <DialogContent className="bg-background h-full w-full max-w-none rounded-none border-0 p-0 overflow-hidden">
                <DialogHeader className="p-4 border-b">
                    <div className="flex items-center gap-3">
                        <DialogTitle className="text-lg text-muted-foreground font-normal">
                            {t("select_date")}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="sr-only">
                        {t("select_date")}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-4">
                    {tripType === "roundtrip" ? (
                        <Calendar
                            mode="range"
                            selected={range}
                            onDayClick={handleDayClick}
                            className="rounded-lg w-full"
                            numberOfMonths={12}
                            hideNavigation
                            locale={dateLocale}
                            disabled={(date) => date < new Date()}
                        />
                    ) : (
                        <Calendar
                            mode="single"
                            selected={departDate}
                            onSelect={(date) => {
                                onDepartDateChange(date);
                            }}
                            className="rounded-lg w-full"
                            numberOfMonths={12}
                            hideNavigation
                            locale={dateLocale}
                            disabled={(date) => date < new Date()}
                        />
                    )}
                </div>

                <DialogFooter className="w-full sticky bottom-0 p-4 border-t bg-background">
                    <DialogClose asChild>
                        <button className="w-full h-12 bg-accent-500 hover:bg-accent-600 text-white font-bold text-base rounded-full shadow-lg transition-all">
                            {t("apply")}
                        </button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
