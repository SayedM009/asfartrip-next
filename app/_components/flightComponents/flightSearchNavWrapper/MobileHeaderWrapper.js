"use client";
import CurrencySwitcher from "../../CurrencySwicther";
import { FlightSearchForm } from "../flightSearchFormMobile/FlightSearchFormMobile";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, PencilLineIcon } from "lucide-react";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { BackWardButtonWithDirections } from "./BackwardButton";
import { useTranslations } from "next-intl";
import { useDateFormatter } from "@/app/_hooks/useDisplayShortDate";
import { cn } from "@/lib/utils";

export default function MobileHeaderWrapper() {
    const t = useTranslations("Flight");
    const [open, setOpen] = useState(false);
    const params = useSearchParams();
    const {
        origin,
        destination,
        class: tripClass,
        type,
        ADT,
        CHD,
        INF,
        depart_date,
        return_date,
    } = JSON.parse(params.get("searchObject"));

    function parseDateString(dateStr) {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split("-");
        const isoStr = `${year}-${month}-${day}`;
        const date = new Date(isoStr);
        return isNaN(date.getTime()) ? null : date;
    }
    const departDateObj = parseDateString(depart_date);
    const returnDateObj = parseDateString(return_date);
    const totalPassengers = ADT + CHD + INF;
    const { isRTL } = useCheckLocal();
    const formatDate = useDateFormatter();
    const pattern = isRTL ? "dd MMMM" : "dd MMM";
    return (
        <div className="flex items-center justify-between gap-2">
            {/* Backward Button */}
            <div>
                <BackWardButtonWithDirections href="/" />
            </div>

            {/* Section in the middle */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="flex-1" asChild>
                    <div className="bg-muted text-muted-foreground dark:text-gray-50 min-h-12  rounded-lg flex-1 flex flex-col items-center border-1 pt-1 border-gray-400 dark:border-gray-800  px-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">
                                {origin} {}
                            </span>{" "}
                            <span>
                                {type === "O" ? (
                                    isRTL ? (
                                        <ArrowLeft className="size-4" />
                                    ) : (
                                        <ArrowRight className="size-4" />
                                    )
                                ) : (
                                    <ArrowsRightLeftIcon className="size-4" />
                                )}
                            </span>
                            <span className="text-sm font-semibold">
                                {destination}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-accent-500">
                            <span className="text-xs">
                                <span className="text-xs whitespace-nowrap">
                                    {departDateObj
                                        ? formatDate(departDateObj, {
                                              pattern,
                                          })
                                        : "—"}
                                    {returnDateObj
                                        ? ` - ${formatDate(returnDateObj, {
                                              pattern,
                                          })}`
                                        : ""}
                                </span>
                            </span>
                            <span>|</span>
                            <span className="text-xs whitespace-nowrap">
                                {totalPassengers}{" "}
                                {totalPassengers > 1
                                    ? t("passengers.passengers")
                                    : t("passengers.passenger")}
                            </span>
                            <span>|</span>
                            <span className="text-xs capitalize ">
                                {t(
                                    `ticket_class.${String(
                                        tripClass
                                    ).toLocaleLowerCase()}`
                                )}
                            </span>
                            <span>
                                <PencilLineIcon
                                    className="size-3
                                    "
                                />
                            </span>
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent
                    className={cn(
                        "",
                        "max-w-none w-full h-[45vh]  top-179 rounded-none border-0  md:h-11/12 md:rounded",
                        "open-slide-bottom",
                        "close-slide-bottom",
                        "pt-4"
                    )}
                >
                    <DialogHeader>
                        <DialogTitle className="flex justify-start">
                            <h2 className="text-sm font-medium text-accent-400">
                                {t("operations.edit_your_search")}
                            </h2>
                        </DialogTitle>
                        <DialogDescription>
                            <FlightSearchForm closeModal={setOpen} />
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            {/* Currency Switcher */}
            <div>
                <CurrencySwitcher isLabel={false} />
            </div>
        </div>
    );
}
