"use client";
import React, { useState, useMemo, useCallback } from "react";
import { FlightTicket } from "./FlightTicket";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    SunIcon,
    PlaneIcon,
    ArrowRightCircleIcon,
    ArrowLeft,
    ArrowRight,
    Sunrise,
    SunMedium,
    Sunset,
    CloudSun,
    Funnel,
    SortDesc,
} from "lucide-react";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { useSearchParams } from "next/navigation";
import FlightFilters from "./FlightFilters";
import Image from "next/image";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { cn } from "../ui/utils";
import { Button } from "@/components/ui/button";

const tripTimes = [
    { id: "before6", label: "Before 6:00", icon: <CloudSun /> },
    { id: "morning", label: "06:00 - 12:00", icon: <Sunrise /> },
    { id: "afternoon", label: "12:00 - 18:00", icon: <SunMedium /> },
    { id: "evening", label: "After 18:00", icon: <Sunset /> },
];

export function FlightResults({ flights = [] }) {
    const [filterBy, setFilterBy] = useState("all");
    const [sortBy, setSortBy] = useState("price");
    const [selectedAirlines, setSelectedAirlines] = useState([]);
    const [selectedTripTimes, setSelectedTripTimes] = useState([]);

    // إضافة state للفلاتر المتقدمة
    const [selectedFilters, setSelectedFilters] = useState({
        stops: [],
        fare: [],
        airlines: [],
        priceRange: [0, 200000],
        duration: [0, 96],
        airports: [],
    });

    // === المنطق الجديد ===
    const getOutboundSegments = useCallback((flight) => {
        if (flight.MultiLeg === "true" && flight.onward)
            return flight.onward.segments;
        return flight.segments || [];
    }, []);

    const getReturnSegments = useCallback((flight) => {
        if (flight.MultiLeg === "true" && flight.return)
            return flight.return.segments;
        return null;
    }, []);

    const getTotalDuration = useCallback(
        (flight) => {
            const outbound = getOutboundSegments(flight);
            if (!outbound.length) return 0;
            const outboundStart = new Date(outbound[0].DepartureTime).getTime();
            const outboundEnd = new Date(outbound.at(-1).ArrivalTime).getTime();

            const ret = getReturnSegments(flight);
            if (ret?.length) {
                const retStart = new Date(ret[0].DepartureTime).getTime();
                const retEnd = new Date(ret.at(-1).ArrivalTime).getTime();
                return outboundEnd - outboundStart + (retEnd - retStart);
            }
            return outboundEnd - outboundStart;
        },
        [getOutboundSegments, getReturnSegments]
    );

    const getStopsCount = useCallback(
        (flight) => {
            const outboundStops = Math.max(
                0,
                getOutboundSegments(flight).length - 1
            );
            const returnStops = getReturnSegments(flight)
                ? Math.max(0, getReturnSegments(flight).length - 1)
                : 0;
            return Math.max(outboundStops, returnStops);
        },
        [getOutboundSegments, getReturnSegments]
    );

    // Helper function to get flight duration in hours
    const getFlightDurationHours = useCallback(
        (flight) => {
            const durationMs = getTotalDuration(flight);
            return durationMs / (1000 * 60 * 60); // Convert ms to hours
        },
        [getTotalDuration]
    );

    // Helper function to check if flight has stopover airports
    const hasStopoverAirport = useCallback(
        (flight, airportCode) => {
            const segments = getOutboundSegments(flight);
            const returnSegments = getReturnSegments(flight);
            const allSegments = [...segments, ...(returnSegments || [])];

            // Check intermediate airports (not first departure or last arrival)
            for (let i = 1; i < allSegments.length; i++) {
                if (allSegments[i].Origin === airportCode) {
                    return true;
                }
            }
            return false;
        },
        [getOutboundSegments, getReturnSegments]
    );

    // === فلترة + ترتيب محسّنة ===
    const filteredAndSortedFlights = useMemo(() => {
        let filtered = [...flights];

        // Main filter (Direct flights)
        if (filterBy === "direct") {
            filtered = filtered.filter((f) => getStopsCount(f) === 0);
        }

        // Airline filter (from tabs)
        if (selectedAirlines.length > 0) {
            filtered = filtered.filter((f) =>
                getOutboundSegments(f).some((s) =>
                    selectedAirlines.includes(s.Carrier)
                )
            );
        }

        // Trip time filter (from tabs)
        if (selectedTripTimes.length > 0) {
            filtered = filtered.filter((f) => {
                const depHour = new Date(
                    getOutboundSegments(f)[0].DepartureTime
                ).getHours();
                return selectedTripTimes.some((id) => {
                    if (id === "before6") return depHour < 6;
                    if (id === "evening") return depHour >= 18;
                    if (id === "morning") return depHour >= 6 && depHour < 12;
                    if (id === "afternoon")
                        return depHour >= 12 && depHour < 18;
                    return false;
                });
            });
        }

        // Advanced Filters
        // Stops filter
        if (selectedFilters.stops.length > 0) {
            filtered = filtered.filter((f) =>
                selectedFilters.stops.includes(getStopsCount(f))
            );
        }

        // Fare type filter
        if (selectedFilters.fare.length > 0) {
            filtered = filtered.filter((f) => {
                if (
                    selectedFilters.fare.includes("refundable") &&
                    f.Refundable === "true"
                ) {
                    return true;
                }
                if (
                    selectedFilters.fare.includes("nonRefundable") &&
                    f.Refundable !== "true"
                ) {
                    return true;
                }
                return false;
            });
        }

        // Airlines filter (from advanced filters)
        if (selectedFilters.airlines.length > 0) {
            filtered = filtered.filter((f) =>
                getOutboundSegments(f).some((s) =>
                    selectedFilters.airlines.includes(s.Carrier)
                )
            );
        }

        // Price range filter
        if (selectedFilters.priceRange) {
            const [minPrice, maxPrice] = selectedFilters.priceRange;
            filtered = filtered.filter(
                (f) => f.TotalPrice >= minPrice && f.TotalPrice <= maxPrice
            );
        }

        // Duration filter
        if (selectedFilters.duration) {
            const [minDuration, maxDuration] = selectedFilters.duration;
            filtered = filtered.filter((f) => {
                const durationHours = getFlightDurationHours(f);
                return (
                    durationHours >= minDuration && durationHours <= maxDuration
                );
            });
        }

        // Stopover airports filter
        if (selectedFilters.airports.length > 0) {
            filtered = filtered.filter((f) =>
                selectedFilters.airports.some((airport) =>
                    hasStopoverAirport(f, airport)
                )
            );
        }

        // Sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "price":
                    return a.TotalPrice - b.TotalPrice;
                case "duration":
                    return getTotalDuration(a) - getTotalDuration(b);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [
        flights,
        sortBy,
        filterBy,
        selectedAirlines,
        selectedTripTimes,
        selectedFilters,
        getStopsCount,
        getTotalDuration,
        getOutboundSegments,
        getFlightDurationHours,
        hasStopoverAirport,
    ]);

    const { cheapestIndex, fastestIndex } = React.useMemo(() => {
        if (
            !filteredAndSortedFlights ||
            filteredAndSortedFlights.length === 0
        ) {
            return { cheapestIndex: -1, fastestIndex: -1 };
        }

        let cheapestIdx = 0;
        let fastestIdx = 0;
        let cheapestPrice = filteredAndSortedFlights[0].TotalPrice ?? Infinity;
        let fastestDur = getDurationMs(filteredAndSortedFlights[0]);

        for (let i = 1; i < filteredAndSortedFlights.length; i++) {
            const f = filteredAndSortedFlights[i];
            const price = f.TotalPrice ?? Infinity;
            const dur = getDurationMs(f);

            if (price < cheapestPrice) {
                cheapestPrice = price;
                cheapestIdx = i;
            }
            if (dur < fastestDur) {
                fastestDur = dur;
                fastestIdx = i;
            }
        }

        return { cheapestIndex: cheapestIdx, fastestIndex: fastestIdx };
    }, [filteredAndSortedFlights]);

    return (
        <div className="mx-auto space-y-2">
            {/* Tabs / Filters */}
            <FlightTabs
                filterBy={filterBy}
                setFilterBy={setFilterBy}
                airlines={Array.from(
                    new Set(
                        flights.flatMap((f) =>
                            getOutboundSegments(f).map((s) => s.Carrier)
                        )
                    )
                )}
                selectedAirlines={selectedAirlines}
                setSelectedAirlines={setSelectedAirlines}
                tripTimes={tripTimes}
                selectedTripTimes={selectedTripTimes}
                setSelectedTripTimes={setSelectedTripTimes}
            />

            <div className="grid grid-cols-12 gap-4 sm:mt-5">
                {/* Advanced Filters - يظهر في dialog عند الضغط على Filter */}
                <div className="hidden sm:block col-span-3">
                    <FlightFilters
                        flights={flights}
                        selectedFilters={selectedFilters}
                        setSelectedFilters={setSelectedFilters}
                    />
                </div>

                {/* Tickets list */}
                <div className="col-span-12 sm:col-span-9">
                    <div className="grid gap-4">
                        <FlightTicketsList
                            filteredAndSortedFlights={filteredAndSortedFlights}
                            filterBy={filterBy}
                            cheapestIndex={cheapestIndex}
                            fastestIndex={fastestIndex}
                        />
                    </div>
                </div>
            </div>
            {/* Floating sort (Cheapest / Fastest) */}
            <FlowingSortFilter
                flights={filteredAndSortedFlights}
                setSortBy={setSortBy}
                sortBy={sortBy}
                // Pass filters props
                originalFlights={flights}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
            />
        </div>
    );
}

export function FlightTabs({
    filterBy,
    setFilterBy,
    airlines,
    selectedAirlines,
    setSelectedAirlines,
    tripTimes,
    selectedTripTimes,
    setSelectedTripTimes,
}) {
    function handleValueChange(val) {
        setFilterBy(val);
    }

    function clearSubFiltersFor(tab) {
        if (tab === "airline" && setSelectedAirlines) setSelectedAirlines([]);
        if (tab === "triptime" && setSelectedTripTimes)
            setSelectedTripTimes([]);
    }

    const makePreemptiveHandler = (value) => (e) => {
        if (filterBy === value) {
            e.preventDefault();
            setFilterBy("");
            clearSubFiltersFor(value);
        }
    };

    return (
        <div>
            <Tabs
                value={filterBy || ""}
                onValueChange={handleValueChange}
                className="w-full shadow border-2 rounded-full mt-3"
            >
                <TabsList className="grid grid-cols-3 w-full ">
                    <TabsTrigger
                        value="triptime"
                        onPointerDown={makePreemptiveHandler("triptime")}
                        className="data-[state=active]:bg-accent-100 data-[state=active]:text-accent-500 rounded-full"
                    >
                        <SunIcon className="size-5" />
                        <span className="text-sm">Trip time</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="airline"
                        onPointerDown={makePreemptiveHandler("airline")}
                        className="data-[state=active]:bg-accent-100 data-[state=active]:text-accent-500 rounded-full"
                    >
                        <PlaneIcon className="size-5" />
                        <span className="text-sm">Airlines</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="direct"
                        onPointerDown={makePreemptiveHandler("direct")}
                        className="data-[state=active]:bg-accent-100 data-[state=active]:text-accent-500 rounded-full"
                    >
                        <ArrowRightCircleIcon className="size-5" />
                        <span className="text-sm">Direct</span>
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Sub Tabs - Airlines */}
            {filterBy === "airline" && (
                <div className="flex gap-4 mt-3 overflow-x-scroll">
                    {airlines.map((code) => (
                        <button
                            key={code}
                            onClick={() =>
                                setSelectedAirlines((prev) =>
                                    prev.includes(code)
                                        ? prev.filter((a) => a !== code)
                                        : [...prev, code]
                                )
                            }
                            className={`px-3 pt-2 pb-1 rounded-xl border text-sm flex items-center gap-2 flex-col min-w-20 ${
                                selectedAirlines.includes(code) &&
                                "bg-accent-100"
                            }`}
                        >
                            <Image
                                src={`https://images.kiwi.com/airlines/64x64/${code}.png`}
                                alt={code}
                                className="w-5 h-5"
                                width={30}
                                height={30}
                            />
                            <span className="text-xs">{code}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Sub Tabs - Trip Times */}
            {filterBy === "triptime" && (
                <div className="flex gap-2 mt-3 overflow-x-auto">
                    {tripTimes.map((t) => (
                        <button
                            key={t.id}
                            onClick={() =>
                                setSelectedTripTimes((prev) =>
                                    prev.includes(t.id)
                                        ? prev.filter((x) => x !== t.id)
                                        : [...prev, t.id]
                                )
                            }
                            className={`px-2 py-1 rounded-xl border text-xs flex flex-col items-center gap-2 ${
                                selectedTripTimes.includes(t.id) &&
                                "bg-accent-100 "
                            }`}
                        >
                            <span>{t.icon}</span>
                            <span className="text-[12px] whitespace-nowrap font-semibold">
                                {t.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function DisplayedCities() {
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
            </h1>
        </div>
    );
}

function TicketsCount({ filteredAndSortedFlights }) {
    return (
        <div className="flex items-center justify-between gap-2 px-2 my-3">
            <DisplayedCities />
            <p className="text-xs capitalize flex items-center gap-2  text-accent-500">
                {filteredAndSortedFlights
                    ? String(filteredAndSortedFlights?.length).padStart(2, 0)
                    : 0}
                <span>flights found</span>
            </p>
        </div>
    );
}

export function FlightTicketsList({
    filteredAndSortedFlights,
    filterBy,
    cheapestIndex,
    fastestIndex,
}) {
    return (
        <>
            <TicketsCount filteredAndSortedFlights={filteredAndSortedFlights} />
            {!filteredAndSortedFlights ||
            filteredAndSortedFlights.length === 0 ? (
                <NoFlightTickets />
            ) : (
                filteredAndSortedFlights.map((flight, index) => (
                    <FlightTicket
                        key={`${filterBy}-flight-${index}`}
                        ticket={flight}
                        onSelect={() => handleSelectFlight(index)}
                        isCheapest={index === cheapestIndex}
                        isFastest={index === fastestIndex}
                    />
                ))
            )}
        </>
    );
}

export function NoFlightTickets() {
    return (
        <Card className="shadow-none border-0 ">
            <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="relative flex justify-center">
                        <Image
                            src="/not-found/no-flights.webp"
                            alt="no-flights"
                            className="object-cover"
                            width={500}
                            height={500}
                        />
                    </div>
                    <h1 className="text-lg font-medium text-muted-foreground mb-2">
                        Ops!.. there are no flights available for your selected
                        dates
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Please try again with different dates
                    </p>
                    <p>Dubai to Shohag (07 Oct 2025)</p>
                    <p>1 Adult, Economy </p>
                    <Button className="w-full sm:w-auto">Refresh</Button>
                </div>
            </CardContent>
        </Card>
    );
}

function FlowingSortFilter({
    flights,
    setSortBy,
    sortBy,
    originalFlights,
    selectedFilters,
    setSelectedFilters,
}) {
    return (
        <section className="fixed bottom-3 left-50 translate-x-[-50%] bg-accent-50 shadow text-accent-500 px-3 py-2 rounded-full font-semibold flex items-center space-x-2">
            <FlowingSortDialog
                flights={flights}
                setSortBy={setSortBy}
                sortBy={sortBy}
            />
            <span>|</span>
            <FlowingFilterDialog
                flights={originalFlights}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
            />
        </section>
    );
}

function FlowingSortDialog({ flights, setSortBy, sortBy }) {
    const [open, setOpen] = useState(false);

    function getAllSegments(flight) {
        if (!flight) return [];

        if (flight.MultiLeg === "true" && Array.isArray(flight.legs)) {
            return flight.legs.flatMap((leg) => leg.segments || []);
        }

        const onward = flight?.onward?.segments || flight?.segments || [];
        const ret = flight?.return?.segments || [];
        return [...onward, ...ret];
    }

    const getDuration = useCallback((flight) => {
        const segs = getAllSegments(flight);
        if (!segs || segs.length === 0) return 0;

        const first = segs[0];
        const last = segs[segs.length - 1];
        if (!first?.DepartureTime || !last?.ArrivalTime) return 0;

        const dep = new Date(first.DepartureTime).getTime();
        const arr = new Date(last.ArrivalTime).getTime();
        return arr - dep;
    }, []);

    function formatDuration(ms) {
        if (!ms || ms <= 0) return "0h 0m";
        const minutes = Math.floor(ms / 60000);
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    }

    const cheapest = useMemo(() => {
        if (!flights || flights.length === 0) return null;
        return flights.reduce((min, f) =>
            f.TotalPrice < min.TotalPrice ? f : min
        );
    }, [flights]);

    const fastest = useMemo(() => {
        if (!flights || flights.length === 0) return null;
        return flights.reduce((min, f) =>
            getDuration(f) < getDuration(min) ? f : min
        );
    }, [flights, getDuration]);

    const handleSort = (type) => {
        setSortBy(type);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="flex-1" asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                    <SortDesc className="size-5" />
                    <span>Sort</span>
                </div>
            </DialogTrigger>

            <DialogContent
                className={cn(
                    "max-w-none w-full h-[28vh] top-200 rounded-t-xl border-0 md:h-11/12 md:rounded",
                    "open-slide-bottom close-slide-bottom",
                    "pt-4 shadow"
                )}
            >
                <DialogHeader>
                    <DialogTitle className="flex justify-start">
                        <h2 className="text-sm font-semibold text-accent-500">
                            Sort By
                        </h2>
                    </DialogTitle>

                    <DialogDescription className="space-y-4 mt-4">
                        {cheapest && (
                            <button
                                onClick={() => handleSort("price")}
                                className={`w-full flex justify-between items-center px-4 py-3 border rounded-xl uppercase
                                    ${
                                        sortBy === "price"
                                            ? "bg-green-500 text-white"
                                            : "bg-transparent text-green-500"
                                    }`}
                            >
                                <div className="text-left">
                                    <p className="font-semibold">Cheapest</p>
                                    <p className="text-xs ">
                                        {formatDuration(getDuration(cheapest))}
                                    </p>
                                </div>
                                <div className="font-bold">
                                    ${cheapest.TotalPrice}
                                </div>
                            </button>
                        )}

                        {fastest && (
                            <button
                                onClick={() => handleSort("duration")}
                                className={`w-full flex justify-between items-center px-4 py-3 border rounded-xl uppercase
                                    ${
                                        sortBy === "duration"
                                            ? "bg-accent-400 text-white"
                                            : "bg-transparent text-accent-500"
                                    }`}
                            >
                                <div className="text-left">
                                    <p className="font-semibold">Fastest</p>
                                    <p className="text-xs ">
                                        {formatDuration(getDuration(fastest))}
                                    </p>
                                </div>
                                <div className="font-bold">
                                    ${fastest.TotalPrice}
                                </div>
                            </button>
                        )}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

function getAllSegments(flight) {
    if (!flight) return [];
    if (flight.MultiLeg === "true" && Array.isArray(flight.legs)) {
        return flight.legs.flatMap((leg) => leg.segments || []);
    }
    if (flight.MultiLeg === "true" && flight.onward && flight.return) {
        return [
            ...(flight.onward?.segments || []),
            ...(flight.return?.segments || []),
        ];
    }
    return flight.segments || [];
}

function getDurationMs(flight) {
    const segs = getAllSegments(flight);
    if (!segs.length) return Infinity;
    const first = segs[0];
    const last = segs[segs.length - 1];
    if (!first?.DepartureTime || !last?.ArrivalTime) return Infinity;
    return (
        new Date(last.ArrivalTime).getTime() -
        new Date(first.DepartureTime).getTime()
    );
}

function FlowingFilterDialog({ flights, selectedFilters, setSelectedFilters }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                    <Funnel className="size-4" />
                    <span>Filter</span>
                </div>
            </DialogTrigger>

            <DialogContent
                className={cn(
                    "max-w-none w-full h-[80vh] top-140 rounded-t-xl border-0 md:h-11/12 md:rounded",
                    "open-slide-bottom close-slide-bottom",
                    "pt-4 shadow overflow-y-auto"
                )}
            >
                <DialogHeader>
                    <DialogTitle className="flex justify-start">
                        <h2 className="text-sm font-semibold text-accent-500">
                            Advanced Filters
                        </h2>
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                    <FlightFilters
                        flights={flights}
                        selectedFilters={selectedFilters}
                        setSelectedFilters={setSelectedFilters}
                        setOpen={setOpen}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

// "use client";
// import React, { useState, useMemo, useCallback } from "react";
// import { FlightTicket } from "./FlightTicket";
// import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//     SunIcon,
//     PlaneIcon,
//     ArrowRightCircleIcon,
//     ArrowLeft,
//     ArrowRight,
//     Sunrise,
//     SunMedium,
//     Sunset,
//     CloudSun,
//     Funnel,
//     SortDesc,
// } from "lucide-react";
// import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
// import useCheckLocal from "@/app/_hooks/useCheckLocal";
// import { useSearchParams } from "next/navigation";
// import FlightFilters from "./FlightFilters";
// import Image from "next/image";

// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import { DialogDescription } from "@radix-ui/react-dialog";
// import { cn } from "../ui/utils";

// const tripTimes = [
//     { id: "before6", label: "Before 6:00", icon: <CloudSun /> },
//     { id: "morning", label: "06:00 - 12:00", icon: <Sunrise /> },
//     { id: "afternoon", label: "12:00 - 18:00", icon: <SunMedium /> },
//     { id: "evening", label: "After 18:00", icon: <Sunset /> },
// ];

// export function FlightResults({ flights = [] }) {
//     const [filterBy, setFilterBy] = useState("all");
//     const [sortBy, setSortBy] = useState("price");
//     const [selectedAirlines, setSelectedAirlines] = useState([]);
//     const [selectedTripTimes, setSelectedTripTimes] = useState([]);

//     // === المنطق الجديد ===
//     const getOutboundSegments = useCallback((flight) => {
//         if (flight.MultiLeg === "true" && flight.onward)
//             return flight.onward.segments;
//         return flight.segments || [];
//     }, []);

//     const getReturnSegments = useCallback((flight) => {
//         if (flight.MultiLeg === "true" && flight.return)
//             return flight.return.segments;
//         return null;
//     }, []);

//     const getTotalDuration = useCallback(
//         (flight) => {
//             const outbound = getOutboundSegments(flight);
//             if (!outbound.length) return 0;
//             const outboundStart = new Date(outbound[0].DepartureTime).getTime();
//             const outboundEnd = new Date(outbound.at(-1).ArrivalTime).getTime();

//             const ret = getReturnSegments(flight);
//             if (ret?.length) {
//                 const retStart = new Date(ret[0].DepartureTime).getTime();
//                 const retEnd = new Date(ret.at(-1).ArrivalTime).getTime();
//                 return outboundEnd - outboundStart + (retEnd - retStart);
//             }
//             return outboundEnd - outboundStart;
//         },
//         [getOutboundSegments, getReturnSegments]
//     );

//     const getStopsCount = useCallback(
//         (flight) => {
//             const outboundStops = Math.max(
//                 0,
//                 getOutboundSegments(flight).length - 1
//             );
//             const returnStops = getReturnSegments(flight)
//                 ? Math.max(0, getReturnSegments(flight).length - 1)
//                 : 0;
//             return Math.max(outboundStops, returnStops);
//         },
//         [getOutboundSegments, getReturnSegments]
//     );

//     // === فلترة + ترتيب ===
//     const filteredAndSortedFlights = useMemo(() => {
//         let filtered = [...flights];

//         // Main filter
//         if (filterBy === "direct") {
//             filtered = filtered.filter((f) => getStopsCount(f) === 0);
//         }

//         // Airline filter
//         if (selectedAirlines.length > 0) {
//             filtered = filtered.filter((f) =>
//                 getOutboundSegments(f).some((s) =>
//                     selectedAirlines.includes(s.Carrier)
//                 )
//             );
//         }

//         // Trip time filter
//         if (selectedTripTimes.length > 0) {
//             filtered = filtered.filter((f) => {
//                 const depHour = new Date(
//                     getOutboundSegments(f)[0].DepartureTime
//                 ).getHours();
//                 return selectedTripTimes.some((id) => {
//                     if (id === "before6") return depHour < 6;
//                     if (id === "evening") return depHour >= 18;
//                     if (id === "morning") return depHour >= 6 && depHour < 12;
//                     if (id === "afternoon")
//                         return depHour >= 12 && depHour < 18;
//                     return false;
//                 });
//             });
//         }

//         // Sorting
//         filtered.sort((a, b) => {
//             switch (sortBy) {
//                 case "price":
//                     return a.TotalPrice - b.TotalPrice;
//                 case "duration":
//                     return getTotalDuration(a) - getTotalDuration(b);
//                 default:
//                     return 0;
//             }
//         });

//         return filtered;
//     }, [
//         flights,
//         sortBy,
//         filterBy,
//         selectedAirlines,
//         selectedTripTimes,
//         getStopsCount,
//         getTotalDuration,
//         getOutboundSegments,
//     ]);

//     const { cheapestIndex, fastestIndex } = React.useMemo(() => {
//         if (
//             !filteredAndSortedFlights ||
//             filteredAndSortedFlights.length === 0
//         ) {
//             return { cheapestIndex: -1, fastestIndex: -1 };
//         }

//         let cheapestIdx = 0;
//         let fastestIdx = 0;
//         let cheapestPrice = filteredAndSortedFlights[0].TotalPrice ?? Infinity;
//         let fastestDur = getDurationMs(filteredAndSortedFlights[0]);

//         for (let i = 1; i < filteredAndSortedFlights.length; i++) {
//             const f = filteredAndSortedFlights[i];
//             const price = f.TotalPrice ?? Infinity;
//             const dur = getDurationMs(f);

//             if (price < cheapestPrice) {
//                 cheapestPrice = price;
//                 cheapestIdx = i;
//             }
//             if (dur < fastestDur) {
//                 fastestDur = dur;
//                 fastestIdx = i;
//             }
//         }

//         return { cheapestIndex: cheapestIdx, fastestIndex: fastestIdx };
//     }, [filteredAndSortedFlights]);

//     return (
//         <div className="mx-auto space-y-2">
//             {/* Tabs / Filters */}
//             <FlightTabs
//                 filterBy={filterBy}
//                 setFilterBy={setFilterBy}
//                 airlines={Array.from(
//                     new Set(
//                         flights.flatMap((f) =>
//                             getOutboundSegments(f).map((s) => s.Carrier)
//                         )
//                     )
//                 )}
//                 selectedAirlines={selectedAirlines}
//                 setSelectedAirlines={setSelectedAirlines}
//                 tripTimes={tripTimes}
//                 selectedTripTimes={selectedTripTimes}
//                 setSelectedTripTimes={setSelectedTripTimes}
//             />

//             {/* Tickets list */}
//             <FlightTicketsList
//                 filteredAndSortedFlights={filteredAndSortedFlights}
//                 filterBy={filterBy}
//                 cheapestIndex={cheapestIndex}
//                 fastestIndex={fastestIndex}
//             />

//             {/* Floating sort (Cheapest / Fastest) */}
//             <FlowingSortFilter
//                 flights={filteredAndSortedFlights}
//                 setSortBy={setSortBy}
//                 sortBy={sortBy}
//             />
//         </div>
//     );
// }

// export function FlightTabs({
//     filterBy,
//     setFilterBy,
//     airlines,
//     selectedAirlines,
//     setSelectedAirlines,
//     tripTimes,
//     selectedTripTimes,
//     setSelectedTripTimes,
// }) {
//     function handleValueChange(val) {
//         // normal tab switching
//         setFilterBy(val);
//     }

//     function clearSubFiltersFor(tab) {
//         if (tab === "airline" && setSelectedAirlines) setSelectedAirlines([]);
//         if (tab === "triptime" && setSelectedTripTimes)
//             setSelectedTripTimes([]);
//     }

//     const makePreemptiveHandler = (value) => (e) => {
//         if (filterBy === value) {
//             // toggle off
//             e.preventDefault();
//             setFilterBy(""); // empty string = no active tab
//             clearSubFiltersFor(value);
//         }
//     };

//     return (
//         <div>
//             <Tabs
//                 // empty string = nothing selected, avoids Radix fallback
//                 value={filterBy || ""}
//                 onValueChange={handleValueChange}
//                 className="w-full shadow border-2 rounded-full mt-3"
//             >
//                 <TabsList className="grid grid-cols-3 w-full ">
//                     <TabsTrigger
//                         value="triptime"
//                         onPointerDown={makePreemptiveHandler("triptime")}
//                         className="data-[state=active]:bg-accent-100 data-[state=active]:text-accent-500 rounded-full"
//                     >
//                         <SunIcon className="size-5" />
//                         <span className="text-sm">Trip time</span>
//                     </TabsTrigger>

//                     <TabsTrigger
//                         value="airline"
//                         onPointerDown={makePreemptiveHandler("airline")}
//                         className="data-[state=active]:bg-accent-100 data-[state=active]:text-accent-500 rounded-full"
//                     >
//                         <PlaneIcon className="size-5" />
//                         <span className="text-sm">Airlines</span>
//                     </TabsTrigger>

//                     <TabsTrigger
//                         value="direct"
//                         onPointerDown={makePreemptiveHandler("direct")}
//                         className="data-[state=active]:bg-accent-100 data-[state=active]:text-accent-500 rounded-full"
//                     >
//                         <ArrowRightCircleIcon className="size-5" />
//                         <span className="text-sm">Direct</span>
//                     </TabsTrigger>
//                 </TabsList>
//             </Tabs>

//             {/* Sub Tabs - Airlines */}
//             {filterBy === "airline" && (
//                 <div className="flex gap-4 mt-3 overflow-x-scroll">
//                     {airlines.map((code) => (
//                         <button
//                             key={code}
//                             onClick={() =>
//                                 setSelectedAirlines((prev) =>
//                                     prev.includes(code)
//                                         ? prev.filter((a) => a !== code)
//                                         : [...prev, code]
//                                 )
//                             }
//                             className={`px-3 pt-2 pb-1 rounded-xl border text-sm flex items-center gap-2 flex-col min-w-20 ${
//                                 selectedAirlines.includes(code) &&
//                                 "bg-accent-100"
//                             }`}
//                         >
//                             <Image
//                                 src={`https://images.kiwi.com/airlines/64x64/${code}.png`}
//                                 alt={code}
//                                 className="w-5 h-5"
//                                 width={30}
//                                 height={30}
//                             />
//                             <span className="text-xs">{code}</span>
//                         </button>
//                     ))}
//                 </div>
//             )}

//             {/* Sub Tabs - Trip Times */}
//             {filterBy === "triptime" && (
//                 <div className="flex gap-2 mt-3 overflow-x-auto">
//                     {tripTimes.map((t) => (
//                         <button
//                             key={t.id}
//                             onClick={() =>
//                                 setSelectedTripTimes((prev) =>
//                                     prev.includes(t.id)
//                                         ? prev.filter((x) => x !== t.id)
//                                         : [...prev, t.id]
//                                 )
//                             }
//                             className={`px-2 py-1 rounded-xl border text-xs flex flex-col items-center gap-2 ${
//                                 selectedTripTimes.includes(t.id) &&
//                                 "bg-accent-100 "
//                             }`}
//                         >
//                             <span>{t.icon}</span>
//                             <span className="text-[12px] whitespace-nowrap font-semibold">
//                                 {t.label}
//                             </span>
//                         </button>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// function DisplayedCities() {
//     const { isRTL } = useCheckLocal();
//     const params = useSearchParams();
//     const { departure: departureObj, destination: destinationObj } = JSON.parse(
//         params.get("cities")
//     );
//     const { type } = JSON.parse(params.get("searchObject"));
//     return (
//         <div>
//             <h1 className="text-lg font-semibold capitalize flex items-center gap-2">
//                 {departureObj.city}

//                 {type === "O" ? (
//                     isRTL ? (
//                         <ArrowLeft className="size-5" />
//                     ) : (
//                         <ArrowRight className="size-5" />
//                     )
//                 ) : (
//                     <ArrowsRightLeftIcon className="size-5" />
//                 )}
//                 {destinationObj.city}
//             </h1>{" "}
//         </div>
//     );
// }

// function TicketsCount({ filteredAndSortedFlights }) {
//     return (
//         <div className="flex items-center justify-between gap-2 px-2 my-3">
//             <DisplayedCities />
//             <p className="text-xs capitalize flex items-center gap-2  text-accent-500">
//                 {filteredAndSortedFlights
//                     ? String(filteredAndSortedFlights?.length).padStart(2, 0)
//                     : 0}
//                 <span>flights found</span>
//             </p>
//         </div>
//     );
// }

// export function FlightTicketsList({
//     filteredAndSortedFlights,
//     filterBy,
//     cheapestIndex,
//     fastestIndex,
// }) {
//     return (
//         <>
//             {/* Tickets Count */}
//             <TicketsCount filteredAndSortedFlights={filteredAndSortedFlights} />
//             {/* Display Tickets List */}
//             {!filteredAndSortedFlights ||
//             filteredAndSortedFlights.length === 0 ? (
//                 <NoFlightTickets />
//             ) : (
//                 filteredAndSortedFlights.map((flight, index) => (
//                     <FlightTicket
//                         key={`${filterBy}-flight-${index}`}
//                         ticket={flight}
//                         onSelect={() => handleSelectFlight(index)}
//                         isCheapest={index === cheapestIndex}
//                         isFastest={index === fastestIndex}
//                     />
//                 ))
//             )}
//         </>
//     );
// }

// export function NoFlightTickets() {
//     return (
//         <Card>
//             <CardContent className="flex items-center justify-center py-12">
//                 <div className="text-center">
//                     <div className="text-lg font-medium text-muted-foreground mb-2">
//                         No flights found
//                     </div>
//                     <p className="text-sm text-muted-foreground">
//                         Try adjusting your filters or search criteria
//                     </p>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// }

// function FlowingSortFilter({ flights, setSortBy, sortBy }) {
//     return (
//         <section className="fixed bottom-3 left-50 translate-x-[-50%] bg-accent-50 shadow text-accent-500 px-3 py-2 rounded-full font-semibold flex items-center space-x-2">
//             <FlowingSortDialog
//                 flights={flights}
//                 setSortBy={setSortBy}
//                 sortBy={sortBy}
//             />
//             <span>|</span>
//             <FlowingFilterDialog />
//         </section>
//     );
// }

// function FlowingSortDialog({ flights, setSortBy, sortBy }) {
//     const [open, setOpen] = useState(false);

//     // === Helpers ===
//     function getAllSegments(flight) {
//         if (!flight) return [];

//         // MultiLeg
//         if (flight.MultiLeg === "true" && Array.isArray(flight.legs)) {
//             return flight.legs.flatMap((leg) => leg.segments || []);
//         }

//         // OneWay / Return
//         const onward = flight?.onward?.segments || flight?.segments || [];
//         const ret = flight?.return?.segments || [];
//         return [...onward, ...ret];
//     }

//     const getDuration = useCallback((flight) => {
//         const segs = getAllSegments(flight);
//         if (!segs || segs.length === 0) return 0;

//         const first = segs[0];
//         const last = segs[segs.length - 1];
//         if (!first?.DepartureTime || !last?.ArrivalTime) return 0;

//         const dep = new Date(first.DepartureTime).getTime();
//         const arr = new Date(last.ArrivalTime).getTime();
//         return arr - dep;
//     }, []);

//     function formatDuration(ms) {
//         if (!ms || ms <= 0) return "0h 0m";
//         const minutes = Math.floor(ms / 60000);
//         const h = Math.floor(minutes / 60);
//         const m = minutes % 60;
//         return `${h}h ${m}m`;
//     }

//     // === Find Cheapest & Fastest ===
//     const cheapest = useMemo(() => {
//         if (!flights || flights.length === 0) return null;
//         return flights.reduce((min, f) =>
//             f.TotalPrice < min.TotalPrice ? f : min
//         );
//     }, [flights]);

//     const fastest = useMemo(() => {
//         if (!flights || flights.length === 0) return null;
//         return flights.reduce((min, f) =>
//             getDuration(f) < getDuration(min) ? f : min
//         );
//     }, [flights, getDuration]);

//     const handleSort = (type) => {
//         setSortBy(type);
//         setOpen(false);
//     };

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger className="flex-1" asChild>
//                 <div className="flex items-center gap-2 cursor-pointer">
//                     <SortDesc className="size-5" />
//                     <span>Sort</span>
//                 </div>
//             </DialogTrigger>

//             <DialogContent
//                 className={cn(
//                     "max-w-none w-full h-[28vh] top-200 rounded-t-xl border-0 md:h-11/12 md:rounded",
//                     "open-slide-bottom close-slide-bottom",
//                     "pt-4 shadow"
//                 )}
//             >
//                 <DialogHeader>
//                     <DialogTitle className="flex justify-start">
//                         <h2 className="text-sm font-semibold text-accent-500">
//                             Sort By
//                         </h2>
//                     </DialogTitle>

//                     <DialogDescription className="space-y-4 mt-4">
//                         {/* Cheapest */}
//                         {cheapest && (
//                             <button
//                                 onClick={() => handleSort("price")}
//                                 className={`w-full flex justify-between items-center px-4 py-3 border rounded-xl uppercase
//                                     ${
//                                         sortBy === "price"
//                                             ? "bg-green-500 text-white"
//                                             : "bg-transparent text-green-500"
//                                     }`}
//                             >
//                                 <div className="text-left">
//                                     <p className="font-semibold">Cheapest</p>
//                                     <p className="text-xs ">
//                                         {formatDuration(getDuration(cheapest))}
//                                     </p>
//                                 </div>
//                                 <div className="font-bold">
//                                     ${cheapest.TotalPrice}
//                                 </div>
//                             </button>
//                         )}

//                         {/* Fastest */}
//                         {fastest && (
//                             <button
//                                 onClick={() => handleSort("duration")}
//                                 className={`w-full flex justify-between items-center px-4 py-3 border rounded-xl uppercase
//                                     ${
//                                         sortBy === "duration"
//                                             ? "bg-accent-400 text-white"
//                                             : "bg-transparent text-accent-500"
//                                     }`}
//                             >
//                                 <div className="text-left">
//                                     <p className="font-semibold">Fastest</p>
//                                     <p className="text-xs ">
//                                         {formatDuration(getDuration(fastest))}
//                                     </p>
//                                 </div>
//                                 <div className="font-bold">
//                                     ${fastest.TotalPrice}
//                                 </div>
//                             </button>
//                         )}
//                     </DialogDescription>
//                 </DialogHeader>
//             </DialogContent>
//         </Dialog>
//     );
// }

// function getAllSegments(flight) {
//     if (!flight) return [];
//     if (flight.MultiLeg === "true" && Array.isArray(flight.legs)) {
//         return flight.legs.flatMap((leg) => leg.segments || []);
//     }
//     if (flight.MultiLeg === "true" && flight.onward && flight.return) {
//         return [
//             ...(flight.onward?.segments || []),
//             ...(flight.return?.segments || []),
//         ];
//     }
//     return flight.segments || [];
// }

// function getDurationMs(flight) {
//     const segs = getAllSegments(flight);
//     if (!segs.length) return Infinity; // لو ما فيش segments نخليها Infinity علشان ماتختارش كـ أسرع
//     const first = segs[0];
//     const last = segs[segs.length - 1];
//     if (!first?.DepartureTime || !last?.ArrivalTime) return Infinity;
//     return (
//         new Date(last.ArrivalTime).getTime() -
//         new Date(first.DepartureTime).getTime()
//     );
// }

// function FlowingFilterDialog() {
//     return (
//         <div className="flex items-center gap-2">
//             <Funnel className="size-4" />
//             <span>Filter</span>
//         </div>
//     );
// }
