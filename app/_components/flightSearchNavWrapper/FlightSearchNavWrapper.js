"use client";
import Navbar from "@/app/_components/Navbar";
import { FlightSearchFormDesktop } from "../flightSearchFormDesktop/FlightSearchFromDesktop";
import { cloneElement, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
    ArrowDownWideNarrow,
    ArrowLeft,
    ArrowRight,
    ArrowRightCircleIcon,
    ChevronLeft,
    ChevronRight,
    Funnel,
    PencilLineIcon,
    PlaneIcon,
    SunIcon,
} from "lucide-react";
import CurrencySwitcher from "../CurrencySwicther";
import { useSearchParams } from "next/navigation";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { FlightSearchForm } from "../flightSearchFormMobile/FlightSearchFormMobile";
import useCheckLocal from "@/app/_hooks/useCheckLocal";

function FlightSearchNavWrapper({ tickets }) {
    // const { mobile } = useIsDevice();
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
    const { departure: departureObj, destination: destinationObj } = JSON.parse(
        params.get("cities")
    );
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
        <>
            <div className="flex items-center justify-between space-x-4">
                {/* Backward Button */}
                <Backward>
                    <Button className="p-0 bg-accent-100 ">
                        {isRTL ? (
                            <ChevronRight className="size-5  font-bold text-accent-700" />
                        ) : (
                            <ChevronLeft className="size-5  font-bold text-accent-700" />
                        )}
                    </Button>
                </Backward>

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
            <div className="bg-gray-100 mt-3 rounded-3xl py-1 px-5 shadow flex items-center justify-between">
                <Button className="flex items-center gap-2 p-0 bg-transparent shadow-none text-gray-900">
                    <SunIcon className="size-5" />
                    <span className="text-sm">Trip time</span>
                </Button>
                <Button className="flex items-center gap-2 p-0 bg-transparent shadow-none text-gray-900">
                    <PlaneIcon className="size-5" />
                    <span className="text-sm">Airlines</span>
                </Button>
                <Button className="flex items-center gap-2 p-0 bg-transparent shadow-none text-gray-900">
                    <ArrowRightCircleIcon className="size-5" />
                    <span className="text-sm">Direct</span>
                </Button>
            </div>
            <div className="flex items-center gap-2 mt-3">
                <span className="text-lg font-semibold capitalize">
                    {departureObj.city}
                </span>{" "}
                <span>
                    {type === "O" ? (
                        isRTL ? (
                            <ArrowLeft className="size-5" />
                        ) : (
                            <ArrowRight className="size-5" />
                        )
                    ) : (
                        <ArrowsRightLeftIcon className="size-5" />
                    )}
                </span>
                <span className="text-lg font-semibold capitalize">
                    {destinationObj.city}
                </span>
            </div>
            <div className="flex gap-2 items-center">
                <span className="text-xs">{tickets.length || 0}</span>
                <span className="text-xs text-gray-600">Flights</span>
            </div>
            <div className="fixed bottom-5 left-50 flex items-center translate-x-[-50%] gap-2  shadow py-1 px-3 rounded-3xl text-accent-500 bg-accent-50">
                <div className="flex items-center gap-2">
                    <ArrowDownWideNarrow className="size-5" />
                    <span>Sort</span>
                </div>
                <span>|</span>
                <div className="flex items-center gap-2">
                    <Funnel className="size-5" />
                    <span>Filter</span>
                </div>
            </div>
        </>
    );
}

function DesktopWrapper() {
    return (
        <>
            <Navbar />
            <div className="mt-5">
                <FlightSearchFormDesktop isLabel={false} />
            </div>
        </>
    );
}

function Backward({ children }) {
    const router = useRouter();
    function goBack() {
        router.push("/");
    }
    return cloneElement(children, {
        onClick: (e) => {
            if (children.props.onClick) children.props.onClick(e);
            goBack();
        },
    });
}

export default FlightSearchNavWrapper;
