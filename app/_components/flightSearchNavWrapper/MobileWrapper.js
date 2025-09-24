"use client";
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

import { parseISO, format, differenceInMinutes } from "date-fns";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FlightResults } from "./FlightResults";

export default function MobileWrapper({ tickets }) {
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
        <>
            <section>
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
                                                ? format(
                                                      departDateObj,
                                                      "dd MMM"
                                                  )
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

                <MobileFilters />
            </section>
            <section>
                {/* {tickets.map((ticket, index) => (
                    <FlightTicket key={index} ticket={ticket} />
                ))} */}
                <FlightResults flights={tickets} />
            </section>
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

function ShortFilter() {
    return (
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
    );
}

export function DisplayedCities() {
    const { isRTL } = useCheckLocal();
    const params = useSearchParams();
    const { departure: departureObj, destination: destinationObj } = JSON.parse(
        params.get("cities")
    );
    const { type } = JSON.parse(params.get("searchObject"));
    return (
        <div>
            <h1 className="text-lg font-semibold capitalize flex items-center gap-2">
                {departureObj.city}

                {type === "O" ? (
                    isRTL ? (
                        <ArrowLeft className="size-5" />
                    ) : (
                        <ArrowRight className="size-5" />
                    )
                ) : (
                    <ArrowsRightLeftIcon className="size-5" />
                )}
                {destinationObj.city}
            </h1>{" "}
        </div>
    );
}

function FlightsCount({ ticketsCount }) {
    return (
        <div className="flex gap-2 items-center mb-3">
            <span className="text-xs">{ticketsCount || 0}</span>
            <span className="text-xs text-gray-600">Flights</span>
        </div>
    );
}

function MobileFilters() {
    return (
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
    );
}

// function FlightTicket({ ticket }) {
//     const { TotalPrice: price, segments } = ticket;
//     const firstSegment = segments.at(0);
//     const lastSegment = segments.at(-1);
//     const { DepartureTime, Origin, Carrier } = firstSegment;
//     const { ArrivalTime, Destination } = lastSegment;

//     function getTime24(isoString) {
//         return format(parseISO(isoString), "HH:mm");
//     }

//     function getDuration(departureISO, arrivalISO) {
//         const departure = parseISO(departureISO);
//         const arrival = parseISO(arrivalISO);

//         const totalMinutes = differenceInMinutes(arrival, departure);

//         const hours = Math.floor(totalMinutes / 60);
//         const minutes = totalMinutes % 60;

//         return `${hours}h ${minutes}m`;
//     }

//     function getFormattedDate(isoString) {
//         const date = parseISO(isoString);
//         return format(date, "EEE d MMM");
//     }
//     console.log(ticket);
//     return (
//         <Card className="mb-4">
//             <CardHeader className="px-3">
//                 <section className="flex items-center justify-between gap-5">
//                     {/* Departure */}
//                     <div className="text-center">
//                         <span className="font-bold text-sm">
//                             {getTime24(DepartureTime)}
//                         </span>
//                         <div className="flex gap-1 items-center">
//                             <span className="text-xs">{Origin}</span>
//                             <span className="text-xs">
//                                 {getFormattedDate(DepartureTime)}
//                             </span>
//                         </div>
//                     </div>
//                     {/* Timeline */}
//                     <div className="flex-1 text-center relative">
//                         <div
//                             className={`absolute left-[50%] ${
//                                 segments.length == 1 ? "top-[-10]" : "top-0"
//                             } translate-[-50%] w-full`}
//                         >
//                             <span className="flex flex-col text-xs">
//                                 {getDuration(DepartureTime, ArrivalTime)}
//                             </span>
//                             {segments.length > 1 && (
//                                 <div className="flex flex-col items-center">
//                                     <span className="bg-gray-200 w-fit text-xs p-1 rounded">
//                                         KWI
//                                     </span>
//                                     <span className="text-xs">
//                                         1 Stop | 1h 30m
//                                     </span>
//                                 </div>
//                             )}
//                         </div>
//                         <hr className="border-1 border-gray-950"></hr>
//                     </div>
//                     {/* Destination */}
//                     <div className="text-center">
//                         <span className="font-bold text-sm">
//                             {getTime24(ArrivalTime)}
//                         </span>
//                         <div className="flex gap-1 items-center">
//                             <span className="text-xs">{Destination}</span>
//                             <span className="text-xs">
//                                 {getFormattedDate(DepartureTime)}
//                             </span>
//                         </div>
//                     </div>
//                 </section>
//             </CardHeader>
//             <CardContent>
//                 <hr></hr>
//             </CardContent>
//             <CardFooter>
//                 <div className="flex items-center justify-between w-full">
//                     <div className="flex flex-col">
//                         <span>image</span>
//                         <span>{Carrier}</span>
//                     </div>
//                     <div className="flex flex-col items-end">
//                         <span className="text-sm">Total price</span>
//                         <span className="text-2xl font-bold">AED {price}</span>
//                     </div>
//                 </div>
//             </CardFooter>
//         </Card>
//     );
// }
