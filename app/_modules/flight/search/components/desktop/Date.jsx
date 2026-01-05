"use client";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import useCalendarLocale from "@/app/_hooks/useCalendarLocale";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { useDateFormatter } from "@/app/_hooks/useDisplayShortDate";
import handleRangeSelect from "@/app/_helpers/handleRangeSelect";

export default function Dates({
    tripType,
    departDate,
    setDepartDate,
    range,
    setRange,
    isLabel,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const c = useTranslations("Calender");
    const { dateLocale } = useCalendarLocale();
    const { isRTL } = useCheckLocal();
    const formatDate = useDateFormatter();
    const pattern = isRTL ? "EEEE d MMMM" : "EEE MMM d";

    // Handler for range selection with proper logic
    // const handleRangeSelect = (newRange) => {
    //     if (!newRange) {
    //         setRange({ from: null, to: null });
    //         return;
    //     }

    //     // Check if from and to are the same date (first click)
    //     const fromTime =
    //         newRange.from instanceof Date
    //             ? newRange.from.getTime()
    //             : new Date(newRange.from).getTime();
    //     const toTime =
    //         newRange.to instanceof Date
    //             ? newRange.to.getTime()
    //             : new Date(newRange.to).getTime();
    //     const isSameDate = newRange.from && newRange.to && fromTime === toTime;

    //     // If same date, treat as first click - only set 'from', keep popover open
    //     if (isSameDate) {
    //         setRange({ from: newRange.from, to: null });
    //         return;
    //     }

    //     // If we already have a complete range and user clicked a new date,
    //     // Reset and start fresh with new 'from'
    //     if (range?.from && range?.to && newRange.from && newRange.to) {
    //         setRange({ from: newRange.to, to: null });
    //         return;
    //     }

    //     // If 'to' is now selected (different from 'from'), we have a complete range - close
    //     if (newRange.from && newRange.to) {
    //         setRange(newRange);
    //         setIsOpen(false);
    //     } else {
    //         // Only 'from' is selected, keep popover open
    //         setRange(newRange);
    //     }
    // };

    // Handler for single date selection - close after selection
    const handleSingleSelect = (date) => {
        setDepartDate(date);
        if (date) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {tripType === "roundtrip" ? (
                <div className="flex-1">
                    {isLabel && (
                        <label className="block mb-2 text-muted-foreground text-xs">
                            {c("departure_date")} & {c("return_date")}
                        </label>
                    )}

                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-12 w-full justify-start bg-input-background border-0 cursor-pointer "
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                    {formatDate(range?.from, { pattern }) ||
                                        c("departure_date")}{" "}
                                    -{" "}
                                    {range?.from && !range?.to
                                        ? c("return_date")
                                        : formatDate(range?.to, { pattern }) ||
                                          c("return_date")}
                                </span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto p-4 mt-1"
                            align="start"
                            side="bottom"
                        >
                            <div className="flex gap-4">
                                <div>
                                    <div className="flex items-center justify-around gap-5">
                                        <h4 className="font-medium mb-2 text-center">
                                            {c("departure_date")}
                                        </h4>
                                        <h4 className="font-medium mb-2 text-center">
                                            {c("return_date")}
                                        </h4>
                                    </div>
                                    <Calendar
                                        mode="range"
                                        selected={range}
                                        onSelect={(newRange) =>
                                            handleRangeSelect(
                                                newRange,
                                                setRange,
                                                range
                                            )
                                        }
                                        initialFocus
                                        locale={dateLocale}
                                        numberOfMonths={2}
                                        startMonth={new Date()}
                                        disabled={(date) => date < new Date()}
                                    />
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            ) : (
                <div className="flex-1">
                    {isLabel && (
                        <label className="block mb-2 text-muted-foreground text-xs">
                            {c("departure_date")}
                        </label>
                    )}

                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-12 w-full justify-start bg-input-background border-0 cursor-pointer "
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                    {formatDate(departDate, { pattern }) ||
                                        c("departure_date")}
                                </span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto p-0 mt-0"
                            align="start"
                            side="bottom"
                        >
                            <Calendar
                                mode="single"
                                selected={departDate}
                                onSelect={handleSingleSelect}
                                initialFocus
                                locale={dateLocale}
                                startMonth={new Date()}
                                disabled={(date) => date < new Date()}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            )}
        </>
    );
}
