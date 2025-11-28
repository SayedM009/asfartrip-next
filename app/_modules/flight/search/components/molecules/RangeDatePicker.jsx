import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from "next-intl";
import useCalendarLocale from "@/app/_hooks/useCalendarLocale";
import { useDateFormatter } from "@/app/_hooks/useDisplayShortDate";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import DateButton from "../atoms/DateButton";

/**
 * RangeDatePicker - Molecule Component
 * A date picker for selecting a date range (round-trip)
 * 
 * @param {Object} value - Selected date range { from: Date, to: Date }
 * @param {function} onChange - Callback when range changes
 * @param {boolean} showLabel - Whether to show label above picker
 */
export default function RangeDatePicker({ 
    value, 
    onChange, 
    showLabel = true 
}) {
    const c = useTranslations("Calender");
    const { dateLocale } = useCalendarLocale();
    const { isRTL } = useCheckLocal();
    const formatDate = useDateFormatter();
    const pattern = isRTL ? "EEEE d MMMM" : "EEE MMM d";

    const handleSelect = (selectedRange) => {
        onChange(selectedRange);
        sessionStorage.setItem("rangeDate", JSON.stringify(selectedRange));
    };

    const formattedFrom = formatDate(value?.from, { pattern });
    const formattedTo = formatDate(value?.to, { pattern });
    const displayText = value?.from 
        ? `${formattedFrom || c("departure_date")} - ${formattedTo || c("return_date")}`
        : `${c("departure_date")} - ${c("return_date")}`;

    return (
        <div className="flex-1">
            {showLabel && (
                <label className="block mb-2 text-muted-foreground text-xs">
                    {c("departure_date")} & {c("return_date")}
                </label>
            )}

            <Popover>
                <PopoverTrigger asChild>
                    <DateButton
                        label={`${c("departure_date")} & ${c("return_date")}`}
                        formattedDate={displayText}
                        placeholder={displayText}
                    />
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
                                selected={value}
                                onSelect={handleSelect}
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
    );
}
