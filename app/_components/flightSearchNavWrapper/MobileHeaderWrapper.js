"use client";
import CurrencySwitcher from "../CurrencySwicther";
import { FlightSearchForm } from "../flightSearchFormMobile/FlightSearchFormMobile";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    PencilLineIcon,
} from "lucide-react";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { format } from "date-fns";
import { cn } from "../ui/utils";
import { useRouter } from "next/router";
import { cloneElement } from "react";
import BackwardButton from "./BackwardButton";

export default function MobileHeaderWrapper() {
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
    return (
        <div className="flex items-center justify-between space-x-4">
            {/* Backward Button */}
            <BackwardButton>
                <Button className="p-0 bg-accent-100 ">
                    {isRTL ? (
                        <ChevronRight className="size-5  font-bold text-accent-700" />
                    ) : (
                        <ChevronLeft className="size-5  font-bold text-accent-700" />
                    )}
                </Button>
            </BackwardButton>

            {/* Section in the middle */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="flex-1" asChild>
                    <div className="bg-gray-100 min-h-12  rounded-lg flex-1 flex flex-col items-center border-1 pt-1 border-gray-400 dark:text-gray-950 px-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">
                                {origin}
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
                                <span className="text-xs">
                                    {departDateObj
                                        ? format(departDateObj, "dd MMM")
                                        : "—"}
                                    {returnDateObj
                                        ? ` - ${format(
                                              returnDateObj,
                                              "dd MMM"
                                          )}`
                                        : ""}
                                </span>
                            </span>
                            <span>|</span>
                            <span className="text-xs">
                                {totalPassengers} Passenger
                                {totalPassengers > 1 ? "'s" : ""}
                            </span>
                            <span>|</span>
                            <span className="text-xs capitalize">
                                {tripClass}
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
                        "max-w-none w-full h-[50vh]  top-172 rounded-none border-0  md:h-11/12 md:rounded",
                        "open-slide-bottom",
                        "close-slide-bottom",
                        "pt-4"
                    )}
                >
                    <DialogHeader>
                        <DialogTitle className="flex justify-start">
                            <h2 className="text-sm font-medium">
                                Edit your search
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
