"use client";
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
    const pattern = isRTL ? "EEEE d MMMM" : "EEE MMM d";
    const { dateLocale } = useCalendarLocale();
    return (
        <>
            <label className="block mb-2 text-muted-foreground text-xs">
                {t("travel_date")}
            </label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-12 w-full justify-start border cursor-pointer gap-4 bg-input-background  font-medium"
                    >
                        <div className="p-2 bg-stone-50   rounded-lg">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium">
                            {tripType === "single"
                                ? range.from && range.to
                                    ? `${formatDate(range.from, {
                                          pattern: pattern,
                                      })} - ${formatDate(range.to, {
                                          pattern: pattern,
                                      })}`
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
                    className=" p-0 mt-0 w-[var(--radix-popover-trigger-width)] md:w-auto"
                    align="start"
                    side="bottom"
                >
                    {tripType === "single" ? (
                        <Calendar
                            mode="range"
                            initialFocus
                            selected={range}
                            onSelect={setRange}
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
                            onSelect={setSelectedDate}
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
