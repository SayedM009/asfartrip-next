"use client";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import handleRangeSelect from "@/app/_helpers/handleRangeSelect";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { useDateFormatter } from "@/app/_hooks/useDisplayShortDate";
import useCalendarLocale from "@/app/_hooks/useCalendarLocale";
import { differenceInDays, startOfToday } from "date-fns";
import DateSelectorDialog from "./DateSelectorDialog";

export default function DateSelector({ value, onChange, t }) {
    const { isRTL } = useCheckLocal();
    const formatDate = useDateFormatter();
    const { dateLocale } = useCalendarLocale();

    const calculateNights = () => {
        if (value?.from && value?.to) {
            const nights = differenceInDays(value.to, value.from);
            return nights > 0 ? nights : 0;
        }
        return 0;
    };

    const pattern = isRTL ? "EEEE, MMMM d" : "EEE MMM d";

    return (
        <>
            {/* Mobile Search */}
            <DateSelectorDialog
                value={value}
                onChange={onChange}
                t={t}
                pattern={pattern}
                calculateNights={calculateNights}
                dateLocale={dateLocale}
                formatDate={formatDate}
                handleRangeSelect={handleRangeSelect}
            />
            {/* Desktop Search */}
            <Popover>
                <PopoverTrigger className="col-span-3 border px-3 rounded-sm cursor-pointer  justify-between items-center py-2 md:py-0 md:flex hidden">
                    <div className="flex flex-col items-start">
                        <Label className="text-xs">{t("check_in")}</Label>
                        <span className="text-sm font-bold">
                            {formatDate(value?.from || new Date(), { pattern })}
                        </span>
                    </div>

                    <p className="text-xs">
                        {calculateNights()}{" "}
                        {calculateNights() > 1 ? t("nights") : t("night")}
                    </p>

                    <div className="flex flex-col items-end">
                        <Label className="text-xs">{t("check_out")}</Label>
                        <span className="text-sm font-bold">
                            {formatDate(
                                value?.to ||
                                    new Date(
                                        new Date().getTime() +
                                            24 * 60 * 60 * 1000,
                                    ),
                                { pattern },
                            )}
                        </span>
                    </div>
                </PopoverTrigger>

                <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    side="bottom"
                >
                    <Calendar
                        className="w-full"
                        mode="range"
                        numberOfMonths={2}
                        selected={value}
                        onSelect={(newRange) =>
                            handleRangeSelect(newRange, onChange, value)
                        }
                        locale={dateLocale}
                        startMonth={new Date()}
                        disabled={(date) => date < startOfToday()}
                    />
                </PopoverContent>
            </Popover>
        </>
    );
}
