import { Calendar } from "@/components/ui/calendar";
import { formatDisplayDate } from "@/app/_helpers/formatDisplayDate";
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
export default function Dates({
    tripType,
    departDate,
    setDepartDate,
    range,
    setRange,
    isLabel,
}) {
    const c = useTranslations("Calender");
    const { dateLocale } = useCalendarLocale();
    const { isRTL } = useCheckLocal();
    const formatDate = useDateFormatter();
    const pattern = isRTL ? "EEEE d MMMM" : "EEE MMM d";
    function handleSelectDepartureDateWithSession(value) {
        setDepartDate(value);
        sessionStorage.setItem("departureDate", JSON.stringify(value));
    }

    function handleSelectRangeDateWithSession(value) {
        setRange(value);
        sessionStorage.setItem("rangeDate", JSON.stringify(value));
    }
    return (
        <>
            {tripType === "roundtrip" ? (
                <div className="flex-1">
                    {isLabel && (
                        <label className="block mb-2 text-muted-foreground text-xs">
                            {c("departure_date")} & {c("return_date")}
                        </label>
                    )}

                    <Popover>
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
                                    {formatDate(range?.to, { pattern }) ||
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
                                        onSelect={(val) => {
                                            handleSelectRangeDateWithSession?.(
                                                val
                                            );
                                        }}
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

                    <Popover>
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
                                onSelect={(val) => {
                                    handleSelectDepartureDateWithSession?.(val);
                                }}
                                initialFocus
                                locale={dateLocale}
                                startMonth={new Date()}
                                disabled={(date) => date < new Date()}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            )}
        </>
    );
}
