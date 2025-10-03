"use client";
import React, { useState, useMemo, useCallback } from "react";
import { FlightTicket } from "./FlightTicket";
import { Card, CardContent } from "@/components/ui/card";

import {
    ArrowLeft,
    ArrowRight,
    Sunrise,
    SunMedium,
    Sunset,
    CloudSun,
    Calendar,
} from "lucide-react";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { useSearchParams } from "next/navigation";
import FlightFilters from "./FlightFilters";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { UserIcon } from "@heroicons/react/24/outline";
import { formatDisplayDate } from "@/app/_helpers/formatDisplayDate";
import { useRouter } from "@/i18n/navigation";
import FlightTabs from "./FlightTabs";
import FloatingSortFilter from "./FloatingSortFilter";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

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
        stopoverDuration: [0, 48],
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

    const getStopoverDurationHours = useCallback(
        (flight) => {
            const segments = getOutboundSegments(flight);
            const returnSegments = getReturnSegments(flight);
            const allSegments = [...segments, ...(returnSegments || [])];

            let stopoverMs = 0;

            for (let i = 1; i < allSegments.length; i++) {
                const prevArrival = new Date(
                    allSegments[i - 1].ArrivalTime
                ).getTime();
                const currDeparture = new Date(
                    allSegments[i].DepartureTime
                ).getTime();
                stopoverMs += Math.max(0, currDeparture - prevArrival);
            }

            return stopoverMs / (1000 * 60 * 60); // تحويل من ms إلى ساعات
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

        // Stopover Duration filter
        if (selectedFilters.stopoverDuration) {
            const [minStopover, maxStopover] = selectedFilters.stopoverDuration;
            filtered = filtered.filter((f) => {
                const stopoverHours = getStopoverDurationHours(f);
                return (
                    stopoverHours >= minStopover && stopoverHours <= maxStopover
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
        getStopoverDurationHours,
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
                <div className="hidden md:block col-span-3">
                    <FlightFilters
                        flights={flights}
                        selectedFilters={selectedFilters}
                        setSelectedFilters={setSelectedFilters}
                    />
                </div>

                {/* Tickets list */}
                <div className="col-span-12 md:col-span-9">
                    <div className="grid gap-3">
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
            <FloatingSortFilter
                flights={filteredAndSortedFlights}
                setSortBy={setSortBy}
                sortBy={sortBy}
                originalFlights={flights}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
            />
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
        <div className="flex items-center justify-between gap-2 px-2 my-0">
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
    const t = useTranslations("Flight");
    const searchParams = useSearchParams();
    const router = useRouter();
    if (!JSON.parse(searchParams.get("searchObject"))) return null;
    const {
        depart_date,
        return_date,
        ADT,
        CHD,
        INF,
        class: tripClass,
    } = JSON.parse(searchParams.get("searchObject")) || {};
    const { departure, destination } =
        JSON.parse(searchParams.get("cities")) || {};

    const totalPassengers = ADT + CHD + INF;
    return (
        <Card className="shadow-none border-0 bg-transparent capitalize">
            <CardContent className="flex items-center justify-center py-12 flex-col">
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
                    <h1 className="text-xl   mb-2 mt-7 text-gray-950 font-semibold capitalize ">
                        {t("operations.no_tickets_title")}
                    </h1>
                    <p className="text-md text-muted-foreground mb-2 capitalize">
                        {t("operations.no_tickets_sub_title")}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2 justify-center capitalize">
                        <Calendar className="size-5" />
                        {t(`operations.no_tickets_one_way`, {
                            departure: departure.city,
                            destination: destination.city,
                        })}
                    </p>
                    {return_date && (
                        <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2 justify-center">
                            <Calendar className="size-5" />
                            {t(`operations.no_tickets_round_trip`, {
                                destination: destination.city,
                                departure: departure.city,
                            })}
                        </p>
                    )}
                    <p className="text-sm text-muted-foreground mb-20 flex items-center gap-2 justify-center">
                        <UserIcon className="size-5 capitalize" />
                        {totalPassengers}{" "}
                        {totalPassengers > 1 && t(`passengers.passengers`)}{" "}
                        {t(`ticket_class.${tripClass}`)}
                    </p>
                    <Button
                        className="btn-primary sm:w-80"
                        onClick={() => router.refresh()}
                    >
                        {t("operations.refrech")}
                    </Button>
                </div>
            </CardContent>
        </Card>
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
