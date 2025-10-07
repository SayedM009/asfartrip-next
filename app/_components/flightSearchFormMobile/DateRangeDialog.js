"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useDateFormatter } from "@/app/_hooks/useDisplayShortDate";
import { useTranslations } from "next-intl";
import useCalendarLocale from "@/app/_hooks/useCalendarLocale";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import useCalculateDaysBetween from "@/app/_hooks/useCalculateDaysBetween";

function DateRangeDialog({
    tripType,
    departDate,
    range,
    onDepartDateChange,
    onRangeDateChange,
}) {
    const t = useTranslations("Calender");
    const { isRTL } = useCheckLocal();
    const { dateLocale } = useCalendarLocale();
    const formatDate = useDateFormatter();
    const differenceInDays = useCalculateDaysBetween(range?.from, range?.to);

    function handleSelectDepartureDateWithSession(value) {
        onDepartDateChange(value);
        sessionStorage.setItem("departureDate", JSON.stringify(value));
    }

    function handleSelectRangeDateWithSession(value) {
        onRangeDateChange(value);
        sessionStorage.setItem("rangeDate", JSON.stringify(value));
    }

    const pattern = isRTL ? "EEEE d MMMM" : "EEE MMM d";
    return (
        <Dialog>
            <DialogTrigger className="text-primary-800 w-full flex items-center justify-between py-3 border-t border-gray-200 cursor-pointer hover:bg-gray-50 rounded transition-colors ">
                {tripType === "roundtrip" ? (
                    <>
                        <div>
                            <div className="font-semibold dark:text-gray-50">
                                {range?.from
                                    ? formatDate(range.from, {
                                          pattern,
                                      })
                                    : t("departure_date")}
                            </div>
                        </div>
                        <div className="text-center flex-1">
                            <div className="text-xs dark:text-gray-50">
                                {differenceInDays}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-semibold dark:text-gray-50">
                                {range?.to
                                    ? formatDate(range.from, {
                                          pattern,
                                      })
                                    : t("return_date")}
                            </div>
                        </div>
                    </>
                ) : (
                    <div>
                        <div className="font-semibold dark:text-gray-50">
                            {departDate
                                ? formatDate(departDate, {
                                      pattern,
                                  })
                                : t("departure_date")}
                        </div>
                    </div>
                )}
            </DialogTrigger>

            <DialogContent className="h-full w-full max-w-none overflow-y-scroll border-0 rounded-none ">
                <DialogHeader>
                    <DialogTitle>{t("select_date")}</DialogTitle>
                </DialogHeader>

                {tripType === "roundtrip" ? (
                    <Calendar
                        mode="range"
                        selected={range}
                        onSelect={(val) => {
                            handleSelectRangeDateWithSession?.(val);
                        }}
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
                        onSelect={(val) => {
                            handleSelectDepartureDateWithSession?.(val);
                        }}
                        className="rounded-lg w-full"
                        numberOfMonths={12}
                        hideNavigation
                        locale={dateLocale}
                        disabled={(date) => date < new Date()}
                    />
                )}

                <DialogFooter className="w-full sticky bottom-0">
                    <DialogClose asChild>
                        <button className="btn-primary">{t("apply")}</button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DateRangeDialog;
