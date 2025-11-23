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
import "../calendar-custom.css";

/**
 * SingleDatePicker - Molecule Component
 * A date picker for selecting a single date (one-way trips)
 * 
 * @param {Date} value - Selected date
 * @param {function} onChange - Callback when date changes
 * @param {boolean} showLabel - Whether to show label above picker
 * @param {string} label - Custom label text
 */
export default function SingleDatePicker({ 
    value, 
    onChange, 
    showLabel = true,
    label 
}) {
    const c = useTranslations("Calender");
    const { dateLocale } = useCalendarLocale();
    const { isRTL } = useCheckLocal();
    const formatDate = useDateFormatter();
    const pattern = isRTL ? "EEEE d MMMM" : "EEE MMM d";

    const handleSelect = (selectedDate) => {
        onChange(selectedDate);
        sessionStorage.setItem("departureDate", JSON.stringify(selectedDate));
    };

    const displayLabel = label || c("departure_date");
    const formattedDate = formatDate(value, { pattern });

    return (
        <div className="flex-1">
            {showLabel && (
                <label className="block mb-2 text-muted-foreground text-xs">
                    {displayLabel}
                </label>
            )}

            <Popover>
                <PopoverTrigger asChild>
                    <DateButton
                        label={displayLabel}
                        formattedDate={formattedDate}
                        placeholder={displayLabel}
                    />
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0 mt-0"
                    align="start"
                    side="bottom"
                >
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={handleSelect}
                        initialFocus
                        locale={dateLocale}
                        startMonth={new Date()}
                        disabled={(date) => date < new Date()}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
