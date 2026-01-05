"use client";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import useCalendarLocale from "@/app/_hooks/useCalendarLocale";

export default function Dates({
    t,
    tripType,
    selectedDate,
    setSelectedDate,
    range,
    setRange,
    formatDate,
    isRTL,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const pattern = isRTL ? "EEEE d MMMM" : "EEE MMM d";
    const { dateLocale } = useCalendarLocale();

    // Handler for range selection
    // - If range is complete and user clicks again, reset and start fresh
    // - First click: set only 'from'
    // - Second click: set 'to' and close popover
    const handleRangeSelect = (newRange) => {
        if (!newRange) {
            setRange({ from: null, to: null });
            return;
        }

        // If we already have a complete range and user clicked a new date,
        // the library keeps 'from' and moves 'to'. We want to reset and start fresh.
        // Check: if the old range was complete and now 'to' changed but 'from' stayed same
        if (range?.from && range?.to && newRange.from && newRange.to) {
            // User clicked on a new date after complete selection
            // Reset to treat this as starting a new range
            setRange({ from: newRange.to, to: null });
            return;
        }

        // If 'to' is now selected, we have a complete range - close the popover
        if (newRange.from && newRange.to) {
            setRange(newRange);
            setIsOpen(false);
        } else {
            // Only 'from' is selected, keep popover open
            setRange(newRange);
        }
    };

    // Handler for single date selection - close after selection
    const handleSingleSelect = (date) => {
        setSelectedDate(date);
        if (date) {
            setIsOpen(false);
        }
    };

    return (
        <>
            <label className="block mb-2 text-muted-foreground text-xs text-left rtl:text-right">
                {t("travel_date")}
            </label>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-12 w-full justify-start border cursor-pointer gap-4 bg-input-background font-medium"
                    >
                        <div className="p-2 bg-stone-50 rounded-lg">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium">
                            {tripType === "single"
                                ? range?.from && range?.to
                                    ? `${formatDate(range.from, {
                                          pattern: pattern,
                                      })} - ${formatDate(range.to, {
                                          pattern: pattern,
                                      })}`
                                    : range?.from
                                    ? `${formatDate(range.from, {
                                          pattern: pattern,
                                      })} - ${t("return_date")}`
                                    : `${t("travel_date")} - ${t(
                                          "return_date"
                                      )}`
                                : selectedDate
                                ? formatDate(selectedDate, {
                                      pattern: pattern,
                                  })
                                : t("travel_date")}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="p-0 mt-0 w-[var(--radix-popover-trigger-width)] md:w-auto"
                    align="start"
                    side="bottom"
                >
                    {tripType === "single" ? (
                        <Calendar
                            mode="range"
                            initialFocus
                            selected={range}
                            onSelect={handleRangeSelect}
                            startMonth={new Date()}
                            disabled={{ before: new Date() }}
                            numberOfMonths={1}
                            className="w-full"
                            locale={dateLocale}
                        />
                    ) : (
                        <Calendar
                            mode="single"
                            initialFocus
                            selected={selectedDate}
                            onSelect={handleSingleSelect}
                            startMonth={new Date()}
                            disabled={{ before: new Date() }}
                            className="w-full"
                            locale={dateLocale}
                        />
                    )}
                </PopoverContent>
            </Popover>
        </>
    );
}
