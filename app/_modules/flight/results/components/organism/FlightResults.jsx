"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";

import FlightTicketsList from "./FlightTicketsList";
import NoFlightTickets from "./NoFlightTickets";

import {
    getStopsCount,
    getStopoverDurationHours,
    getFlightDurationHours,
    getTotalDuration,
    getDurationMs,
    hasStopoverAirport,
} from "../../utils/flightDurations";

import { getOutboundSegments } from "../../utils/flightSegmentation";
import { CloudMoonIcon, Sun, Sunrise, Sunset } from "lucide-react";

import FlightTabs from "./FlightTabs";
import FlightFilters from "./FlightFilters";
import FloatingSortFilter from "./FloatingSortFilter";
import DesktopSortBar from "../molecule/DesktopSortBar";

const FlightResults = ({ flights = [], searchParams, isDirect }) => {
    const f = useTranslations("Flight");
    const [filterBy, setFilterBy] = useState(isDirect ? "direct" : "all");
    const [sortBy, setSortBy] = useState("price");
    const [selectedAirlines, setSelectedAirlines] = useState([]);
    const [selectedTripTimes, setSelectedTripTimes] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({
        stops: [],
        fare: [],
        airlines: [],
        priceRange: [0, 200000],
        duration: [0, 200],
        airports: [],
        stopoverDuration: [0, 72],
    });

    const tripTimes = [
        {
            id: "before6",
            label: f("before"),
            icon: <CloudMoonIcon />,
        },
        { id: "morning", label: "06:00 - 12:00", icon: <Sunrise /> },
        { id: "afternoon", label: "12:00 - 18:00", icon: <Sun /> },
        { id: "evening", label: f("after"), icon: <Sunset /> },
    ];

    // ======================
    // FILTER + SORT PIPELINE
    // ======================
    const filteredAndSortedFlights = useMemo(() => {
        let filtered = [...flights];

        // Main filter (direct)
        if (filterBy === "direct") {
            filtered = filtered.filter((f) => getStopsCount(f) === 0);
        }

        // Airline filter (tabs)
        if (selectedAirlines.length > 0) {
            filtered = filtered.filter((f) =>
                getOutboundSegments(f).some((s) =>
                    selectedAirlines.includes(s.Carrier)
                )
            );
        }

        // Trip time filter (tabs)
        if (selectedTripTimes.length > 0) {
            filtered = filtered.filter((f) => {
                const outboundSegments = getOutboundSegments(f);
                if (!outboundSegments.length) return false;

                const depHour = new Date(
                    outboundSegments[0].DepartureTime
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

        // Airlines filter (advanced)
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
                case "earliest":
                    const depA = new Date(
                        getOutboundSegments(a)[0].DepartureTime
                    ).getTime();
                    const depB = new Date(
                        getOutboundSegments(b)[0].DepartureTime
                    ).getTime();
                    return depA - depB;
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
    ]);

    const { formatPrice } = useCurrency();

    // Cheapest / Fastest / Earliest indexes
    const { cheapestIndex, fastestIndex, earliestIndex } = useMemo(() => {
        if (
            !filteredAndSortedFlights ||
            filteredAndSortedFlights.length === 0
        ) {
            return { cheapestIndex: -1, fastestIndex: -1, earliestIndex: -1 };
        }

        let cheapestIdx = 0;
        let fastestIdx = 0;
        let earliestIdx = 0;

        let cheapestPrice = filteredAndSortedFlights[0].TotalPrice ?? Infinity;
        let fastestDur = getDurationMs(filteredAndSortedFlights[0]);
        let earliestTime = new Date(
            getOutboundSegments(filteredAndSortedFlights[0])[0].DepartureTime
        ).getTime();

        for (let i = 1; i < filteredAndSortedFlights.length; i++) {
            const f = filteredAndSortedFlights[i];
            const price = f.TotalPrice ?? Infinity;
            const dur = getDurationMs(f);
            const depTime = new Date(
                getOutboundSegments(f)[0].DepartureTime
            ).getTime();

            if (price < cheapestPrice) {
                cheapestPrice = price;
                cheapestIdx = i;
            }
            if (dur < fastestDur) {
                fastestDur = dur;
                fastestIdx = i;
            }
            if (depTime < earliestTime) {
                earliestTime = depTime;
                earliestIdx = i;
            }
        }

        return {
            cheapestIndex: cheapestIdx,
            fastestIndex: fastestIdx,
            earliestIndex: earliestIdx,
        };
    }, [filteredAndSortedFlights]);

    const cheapestPriceFormatted =
        cheapestIndex !== -1
            ? formatPrice(filteredAndSortedFlights[cheapestIndex]?.TotalPrice)
            : null;

    const fastestDurationObj =
        fastestIndex !== -1
            ? (() => {
                  const f = filteredAndSortedFlights[fastestIndex];
                  const h = getFlightDurationHours(f);
                  const hours = Math.floor(h);
                  const mins = Math.round((h - hours) * 60);
                  return { h: hours, m: mins };
              })()
            : null;

    const earliestTimeFormatted =
        earliestIndex !== -1
            ? (() => {
                  const f = filteredAndSortedFlights[earliestIndex];
                  const date = new Date(
                      getOutboundSegments(f)[0].DepartureTime
                  );
                  return date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                  });
              })()
            : null;

    // Pagination (Infinite Scroll)
    const [visibleCount, setVisibleCount] = useState(5);
    const loadMoreRef = useRef(null);

    // Reset visible count when filters or sorting change
    useEffect(() => {
        setVisibleCount(5);
    }, [filteredAndSortedFlights]);

    const visibleFlights = useMemo(() => {
        return filteredAndSortedFlights.slice(0, visibleCount);
    }, [filteredAndSortedFlights, visibleCount]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount((prev) =>
                        Math.min(prev + 5, filteredAndSortedFlights.length)
                    );
                }
            },
            { rootMargin: "200px" }
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [filteredAndSortedFlights.length, visibleCount]);

    function resetFilters() {
        setFilterBy("all");
        setSortBy("price");
        setSelectedAirlines([]);
        setSelectedTripTimes([]);
        setSelectedFilters({
            stops: [],
            fare: [],
            airlines: [],
            priceRange: [0, 200000],
            duration: [0, 200],
            airports: [],
            stopoverDuration: [0, 24],
        });
    }

    // لو مفيش رحلات أصلًا من الـ API
    if (!flights || flights.length === 0) {
        return <NoFlightTickets />;
    }

    return (
        <div className="mx-auto space-y-2">
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
                <div className="hidden md:block col-span-3">
                    <FlightFilters
                        flights={flights}
                        selectedFilters={selectedFilters}
                        setSelectedFilters={setSelectedFilters}
                    />
                </div>

                <div className="col-span-12 md:col-span-9">
                    <DesktopSortBar
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        cheapestPrice={cheapestPriceFormatted}
                        fastestDuration={fastestDurationObj}
                        earliestTime={earliestTimeFormatted}
                    />
                    <div className="grid gap-3">
                        <FlightTicketsList
                            filteredAndSortedFlights={visibleFlights}
                            searchObject={searchParams}
                            cheapestIndex={cheapestIndex}
                            fastestIndex={fastestIndex}
                            filterBy={filterBy}
                            resetFilters={resetFilters}
                        />
                        {visibleCount < filteredAndSortedFlights.length && (
                            <div
                                ref={loadMoreRef}
                                className="h-20 w-full flex justify-center items-center opacity-50"
                            >
                                <span className="loading loading-dots loading-md text-primary"></span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
};

export default FlightResults;
