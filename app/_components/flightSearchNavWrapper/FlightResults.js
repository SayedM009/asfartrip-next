"use client";
import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { useSearchParams } from "next/navigation";
import FlightFilters from "./FlightFilters";
import Image from "next/image";

export function FlightResults({ flights = [] }) {
    const [filterBy, setFilterBy] = useState("all");
    const [sortBy, setSortBy] = useState("price");

    // Sub filters
    const [selectedAirlines, setSelectedAirlines] = useState([]);
    const [selectedTripTimes, setSelectedTripTimes] = useState([]);

    // Unique airlines from flights
    const airlines = Array.from(
        new Set(flights.flatMap((f) => f.segments.map((s) => s.Carrier)))
    );

    // Trip time ranges
    const tripTimes = [
        {
            id: "before6",
            label: "Before 6:00",
            icon: <CloudSun />,
            start: 0,
            end: 6,
        },
        {
            id: "morning",
            label: "06:00 - 12:00",
            icon: <Sunrise />,
            start: 6,
            end: 12,
        },
        {
            id: "afternoon",
            label: "12:00 - 18:00",
            icon: <SunMedium />,
            start: 12,
            end: 18,
        },
        {
            id: "evening",
            label: "After 18:00",
            icon: <Sunset />,
            start: 18,
            end: 24,
        },
    ];

    // State
    // const [sortBy, setSortBy] = useState("price");
    // const [filterBy, setFilterBy] = useState("all");

    console.log(flights);
    // Logic
    // const filteredAndSortedFlights = React.useMemo(() => {
    //     let filtered = [...flights];

    //     // Apply filters
    //     if (filterBy === "direct") {
    //         filtered = filtered.filter(
    //             (flight) => flight.segments.length === 1
    //         );
    //     } else if (filterBy === "oneStop") {
    //         filtered = filtered.filter(
    //             (flight) => flight.segments.length === 2
    //         );
    //     } else if (filterBy === "multipleStops") {
    //         filtered = filtered.filter((flight) => flight.segments.length > 2);
    //     }

    //     // Apply sorting
    //     filtered.sort((a, b) => {
    //         switch (sortBy) {
    //             case "price":
    //                 return a.TotalPrice - b.TotalPrice;
    //             case "duration":
    //                 // Calculate total duration for sorting
    //                 const aDuration =
    //                     new Date(
    //                         a.segments[a.segments.length - 1].ArrivalTime
    //                     ).getTime() -
    //                     new Date(a.segments[0].DepartureTime).getTime();
    //                 const bDuration =
    //                     new Date(
    //                         b.segments[b.segments.length - 1].ArrivalTime
    //                     ).getTime() -
    //                     new Date(b.segments[0].DepartureTime).getTime();
    //                 return aDuration - bDuration;
    //             case "departure":
    //                 return (
    //                     new Date(a.segments[0].DepartureTime).getTime() -
    //                     new Date(b.segments[0].DepartureTime).getTime()
    //                 );
    //             default:
    //                 return 0;
    //         }
    //     });

    //     return filtered;
    // }, [flights, sortBy, filterBy]);

    const filteredAndSortedFlights = useMemo(() => {
        let filtered = [...flights];

        // Main filter
        if (filterBy === "direct") {
            filtered = filtered.filter((f) => f.segments.length === 1);
        }

        // Airline filter
        if (selectedAirlines.length > 0) {
            filtered = filtered.filter((f) =>
                f.segments.some((s) => selectedAirlines.includes(s.Carrier))
            );
        }

        // Trip time filter
        if (selectedTripTimes.length > 0) {
            filtered = filtered.filter((f) => {
                const depHour = new Date(
                    f.segments[0].DepartureTime
                ).getHours();
                return selectedTripTimes.some((id) => {
                    const range = tripTimes.find((t) => t.id === id);
                    if (!range) return false;
                    if (range.id === "before6") return depHour < 6;
                    if (range.id === "evening") return depHour >= 18;
                    return depHour >= range.start && depHour < range.end;
                });
            });
        }

        // Sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "price":
                    return a.TotalPrice - b.TotalPrice;
                case "duration":
                    const aDuration =
                        new Date(a.segments.at(-1).ArrivalTime) -
                        new Date(a.segments[0].DepartureTime);
                    const bDuration =
                        new Date(b.segments.at(-1).ArrivalTime) -
                        new Date(b.segments[0].DepartureTime);
                    return aDuration - bDuration;
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
        tripTimes,
    ]);
    const getFlightTypeStats = () => {
        const direct = flights.filter((f) => f.segments.length === 1).length;
        const oneStop = flights.filter((f) => f.segments.length === 2).length;
        const multipleStops = flights.filter(
            (f) => f.segments.length > 2
        ).length;
        return { direct, oneStop, multipleStops };
    };

    const stats = getFlightTypeStats();

    // Appearnce
    return (
        <div className=" mx-auto  space-y-6">
            {/* Sort on Mobile */}
            <FlightTabs
                filterBy={filterBy}
                setFilterBy={setFilterBy}
                filteredAndSortedFlights={filteredAndSortedFlights}
                airlines={airlines}
                selectedAirlines={selectedAirlines}
                setSelectedAirlines={setSelectedAirlines}
                tripTimes={tripTimes}
                selectedTripTimes={selectedTripTimes}
                setSelectedTripTimes={setSelectedTripTimes}
            />

            <div>
                {/* Filter the Flight Tickets */}
                {/* <FlightFilters /> */}
                {/* Listing Flight Tickets */}
                <FlightTicketsList
                    filteredAndSortedFlights={filteredAndSortedFlights}
                    filterBy={filterBy}
                />
            </div>
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
        // normal tab switching
        setFilterBy(val);
    }

    function clearSubFiltersFor(tab) {
        if (tab === "airline" && setSelectedAirlines) setSelectedAirlines([]);
        if (tab === "triptime" && setSelectedTripTimes)
            setSelectedTripTimes([]);
    }

    const makePreemptiveHandler = (value) => (e) => {
        if (filterBy === value) {
            // toggle off
            e.preventDefault();
            setFilterBy(""); // empty string = no active tab
            clearSubFiltersFor(value);
        }
    };

    return (
        <div>
            <Tabs
                // empty string = nothing selected, avoids Radix fallback
                value={filterBy || ""}
                onValueChange={handleValueChange}
                className="w-full"
            >
                <TabsList className="grid grid-cols-3 w-full mt-3">
                    <TabsTrigger
                        value="triptime"
                        onPointerDown={makePreemptiveHandler("triptime")}
                        className="data-[state=active]:bg-accent-100 data-[state=active]:text-primary"
                    >
                        <SunIcon className="size-5" />
                        <span className="text-sm">Trip time</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="airline"
                        onPointerDown={makePreemptiveHandler("airline")}
                        className="data-[state=active]:bg-accent-100 data-[state=active]:text-primary"
                    >
                        <PlaneIcon className="size-5" />
                        <span className="text-sm">Airlines</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="direct"
                        onPointerDown={makePreemptiveHandler("direct")}
                        className="data-[state=active]:bg-accent-100 data-[state=active]:text-primary"
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
            </h1>{" "}
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

export function FlightTicketsList({ filteredAndSortedFlights, filterBy }) {
    return (
        <>
            {/* Tickets Count */}
            <TicketsCount filteredAndSortedFlights={filteredAndSortedFlights} />
            {/* Display Tickets List */}
            {!filteredAndSortedFlights ||
            filteredAndSortedFlights.length === 0 ? (
                <NoFlightTickets />
            ) : (
                filteredAndSortedFlights.map((flight, index) => (
                    <FlightTicket
                        key={`${filterBy}-flight-${index}`}
                        ticket={flight}
                        onSelect={() => handleSelectFlight(index)}
                    />
                ))
            )}
        </>
    );
}

export function NoFlightTickets() {
    return (
        <Card>
            <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="text-lg font-medium text-muted-foreground mb-2">
                        No flights found
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Try adjusting your filters or search criteria
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
