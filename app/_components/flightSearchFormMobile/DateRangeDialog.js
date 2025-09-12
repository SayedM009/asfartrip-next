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
import { formatDisplayDate } from "@/app/_helpers/formatDisplayDate";
import useCalculateDaysBetween from "@/app/_hooks/useCalculateDaysBetween";

import { enUS, arSA } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
const locales = { en: enUS, ar: arSA };

function DateRangeDialog({
    tripType,
    departDate,
    range,
    onDepartDateChange,
    onRangeDateChange,
}) {
    const locale = useLocale();
    const dateLocale = locales[locale] || enUS;
    const t = useTranslations("Calender");
    const differenceInDays = useCalculateDaysBetween(range?.from, range?.to);

    function handleSelectDepartureDateWithSession(value) {
        onDepartDateChange(value);
        sessionStorage.setItem("departureDate", JSON.stringify(value));
    }

    function handleSelectRangeDateWithSession(value) {
        onRangeDateChange(value);
        sessionStorage.setItem("rangeDate", JSON.stringify(value));
    }
    return (
        <Dialog>
            <DialogTrigger className="text-primary-800 w-full flex items-center justify-between py-3 border-t border-gray-200 cursor-pointer hover:bg-gray-50 rounded transition-colors">
                {tripType === "roundtrip" ? (
                    <>
                        <div>
                            <div className="font-semibold text-gray-900">
                                {range?.from
                                    ? formatDisplayDate(range.from, locale)
                                    : t("departure_date")}
                            </div>
                        </div>
                        <div className="text-center flex-1">
                            <div className="text-xs text-gray-500">
                                {differenceInDays}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-semibold text-gray-900">
                                {range?.to
                                    ? formatDisplayDate(range.to, locale)
                                    : t("return_date")}
                            </div>
                        </div>
                    </>
                ) : (
                    <div>
                        <div className="font-semibold text-gray-900">
                            {departDate
                                ? formatDisplayDate(departDate, locale)
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
                        min={2}
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
                    />
                )}

                <DialogFooter className=" w-full  sticky bottom-0">
                    <DialogClose asChild>
                        <button className="w-full py-2 bg-accent-600 text-white rounded-lg cursor-pointer">
                            {t("apply")}
                        </button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DateRangeDialog;
