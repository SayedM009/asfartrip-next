"use client";
import { useState, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "use-intl";

export default function FlightFilters({
    flights,
    selectedFilters,
    setSelectedFilters,
    setOpen,
}) {
    const [showAllAirlines, setShowAllAirlines] = useState(false);
    const [showAllAirports, setShowAllAirports] = useState(false);
    const t = useTranslations("Flight");

    // === Helper functions ===
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

    const getStops = useCallback(
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

    const getTotalDuration = useCallback(
        (flight) => {
            const outbound = getOutboundSegments(flight);
            if (!outbound.length) return 0;

            const outboundStart = new Date(outbound[0].DepartureTime).getTime();
            const outboundEnd = new Date(outbound.at(-1).ArrivalTime).getTime();
            const outboundDuration = outboundEnd - outboundStart;

            const ret = getReturnSegments(flight);
            if (ret?.length) {
                const retStart = new Date(ret[0].DepartureTime).getTime();
                const retEnd = new Date(ret.at(-1).ArrivalTime).getTime();
                const returnDuration = retEnd - retStart;

                // المهم: استخدم Math.max زي ما في FlightResults
                return Math.max(outboundDuration, returnDuration);
            }

            return outboundDuration;
        },
        [getOutboundSegments, getReturnSegments]
    );
    const getFlightDurationHours = useCallback(
        (flight) => {
            const durationMs = getTotalDuration(flight);
            return durationMs / (1000 * 60 * 60); // Convert ms to hours
        },
        [getTotalDuration]
    );

    // === Price range calculation ===
    const priceRange = useMemo(() => {
        if (!flights || flights.length === 0) return { min: 0, max: 2000 };
        const prices = flights.map((f) => f.TotalPrice || 0);
        return {
            min: Math.floor(Math.min(...prices)),
            max: Math.ceil(Math.max(...prices)),
        };
    }, [flights]);

    // === Duration range calculation ===
    const durationRange = useMemo(() => {
        if (!flights || flights.length === 0) return { min: 0, max: 48 };
        const durations = flights.map((f) => getFlightDurationHours(f));
        return {
            min: Math.floor(Math.min(...durations)),
            max: Math.ceil(Math.max(...durations)),
        };
    }, [flights, getFlightDurationHours]);

    // === Stops counts ===
    const stopsCount = useMemo(() => {
        let nonStop = 0,
            oneStop = 0,
            twoStops = 0,
            moreThanTwo = 0;
        flights.forEach((f) => {
            const stops = getStops(f);
            if (stops === 0) nonStop++;
            else if (stops === 1) oneStop++;
            else if (stops === 2) twoStops++;
            else if (stops > 2) moreThanTwo++;
        });
        return { nonStop, oneStop, twoStops, moreThanTwo };
    }, [flights, getStops]);

    // === Fare type ===
    const fareTypeCount = useMemo(() => {
        let refundable = 0,
            nonRefundable = 0;
        flights.forEach((f) => {
            if (f.Refundable === "true") refundable++;
            else nonRefundable++;
        });
        return { refundable, nonRefundable };
    }, [flights]);

    // === Airlines ===
    const airlines = useMemo(() => {
        const map = {};
        flights.forEach((f) => {
            const segments = getOutboundSegments(f);
            const returnSegments = getReturnSegments(f);
            const allSegments = [...segments, ...(returnSegments || [])];

            allSegments.forEach((s) => {
                if (s.Carrier) {
                    map[s.Carrier] = (map[s.Carrier] || 0) + 1;
                }
            });
        });
        return Object.entries(map).sort((a, b) => b[1] - a[1]); // Sort by frequency
    }, [flights, getOutboundSegments, getReturnSegments]);

    // === Stopover Airports ===
    const airports = useMemo(() => {
        const map = {};
        flights.forEach((f) => {
            const segments = getOutboundSegments(f);
            const returnSegments = getReturnSegments(f);
            const allSegments = [...segments, ...(returnSegments || [])];

            // Get intermediate airports (not first departure or last arrival)
            for (let i = 1; i < allSegments.length; i++) {
                const airport = allSegments[i].Origin;
                if (airport) {
                    map[airport] = (map[airport] || 0) + 1;
                }
            }
        });
        return Object.entries(map).sort((a, b) => b[1] - a[1]); // Sort by frequency
    }, [flights, getOutboundSegments, getReturnSegments]);

    // Helper function to toggle filter
    function toggleFilter(key, value) {
        setSelectedFilters((prev) => {
            const arr = prev[key] || [];
            return {
                ...prev,
                [key]: arr.includes(value)
                    ? arr.filter((x) => x !== value)
                    : [...arr, value],
            };
        });
    }

    // Helper function to update range filters
    function updateRangeFilter(key, value) {
        setSelectedFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    const getDefaultFilters = useCallback(
        () => ({
            stops: [],
            fare: [],
            airlines: [],
            priceRange: [priceRange.min, priceRange.max],
            duration: [durationRange.min, durationRange.max],
            airports: [],
            stopoverDuration: [0, 24], // غيرها من 48 إلى 24 زي ما عندك في الـ Slider
        }),
        [priceRange, durationRange]
    );

    return (
        <Card className="sm:p-4 space-y-1 border-0 shadow-none sm:shadow dark:shadow-gray-600">
            <div className="flex items-center justify-between">
                <h2 className="text-sm">
                    {" "}
                    {t("filters.showing_result", { count: flights.length })}
                </h2>
                <Button
                    variant="ghost"
                    onClick={() => {
                        setSelectedFilters(getDefaultFilters());
                        setOpen?.(false);
                    }}
                    className="text-xs text-accent-500"
                >
                    {t("filters.clear_all")}
                </Button>
            </div>

            {/* Stops */}
            <Section title={t(`filters.number_of_stop`)}>
                {stopsCount.nonStop > 0 && (
                    <FilterCheckbox
                        label={`${t("filters.non_stop")} (${
                            stopsCount.nonStop
                        })`}
                        checked={selectedFilters.stops.includes(0)}
                        onChange={() => toggleFilter("stops", 0)}
                    />
                )}
                {stopsCount.oneStop > 0 && (
                    <FilterCheckbox
                        label={`1 ${t("stop")} (${stopsCount.oneStop})`}
                        checked={selectedFilters.stops.includes(1)}
                        onChange={() => toggleFilter("stops", 1)}
                    />
                )}
                {stopsCount.twoStops > 0 && (
                    <FilterCheckbox
                        label={`2 ${t("stop")} (${stopsCount.twoStops})`}
                        checked={selectedFilters.stops.includes(2)}
                        onChange={() => toggleFilter("stops", 2)}
                    />
                )}
                {stopsCount.moreThanTwo > 0 && (
                    <FilterCheckbox
                        label={`3+ ${t("stop")} (${stopsCount.moreThanTwo})`}
                        checked={selectedFilters.stops.includes(3)}
                        onChange={() => toggleFilter("stops", 3)}
                    />
                )}
            </Section>

            {/* Fare Type */}
            {(fareTypeCount.refundable > 0 ||
                fareTypeCount.nonRefundable > 0) && (
                <Section title={t(`filters.type_fare`)}>
                    {fareTypeCount.refundable > 0 && (
                        <FilterCheckbox
                            label={`${t(`filters.refundable`)} (${
                                fareTypeCount.refundable
                            })`}
                            checked={selectedFilters.fare.includes(
                                "refundable"
                            )}
                            onChange={() => toggleFilter("fare", "refundable")}
                        />
                    )}
                    {fareTypeCount.nonRefundable > 0 && (
                        <FilterCheckbox
                            label={`${t(`filters.non_Refundable`)} (${
                                fareTypeCount.nonRefundable
                            })`}
                            checked={selectedFilters.fare.includes(
                                "nonRefundable"
                            )}
                            onChange={() =>
                                toggleFilter("fare", "nonRefundable")
                            }
                        />
                    )}
                </Section>
            )}

            {/* Airlines */}
            {airlines.length > 0 && (
                <Section title={`${t("filters.air_lines")}`}>
                    {(showAllAirlines ? airlines : airlines.slice(0, 5)).map(
                        ([code, count]) => (
                            <FilterCheckbox
                                key={code}
                                label={
                                    <span className="flex items-center gap-2">
                                        <Image
                                            src={`https://images.kiwi.com/airlines/64x64/${code}.png`}
                                            alt={code}
                                            width={20}
                                            height={20}
                                            className="rounded"
                                        />
                                        <span>
                                            {code} ({count})
                                        </span>
                                    </span>
                                }
                                checked={selectedFilters.airlines.includes(
                                    code
                                )}
                                onChange={() => toggleFilter("airlines", code)}
                            />
                        )
                    )}
                    {airlines.length > 5 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAllAirlines(!showAllAirlines)}
                            className="p-0 h-auto text-accent-500"
                        >
                            {showAllAirlines ? (
                                <>
                                    {t("filters.show_less")}{" "}
                                    <ChevronUp className="size-4 ml-1" />
                                </>
                            ) : (
                                <>
                                    {t("filters.show_more", {
                                        count: airlines.length - 5,
                                    })}{" "}
                                    <ChevronDown className="size-4 ml-1" />
                                </>
                            )}
                        </Button>
                    )}
                </Section>
            )}

            {/* Price Range */}
            <Section title={`${t("filters.price_range")}`}>
                <div className="px-2">
                    <Slider
                        min={priceRange.min}
                        max={priceRange.max}
                        step={50}
                        value={selectedFilters.priceRange}
                        onValueChange={(val) =>
                            updateRangeFilter("priceRange", val)
                        }
                        className="w-full duration-slider"
                    />
                    <div className="flex justify-between text-xs  mt-2 text-accent-500  font-semibold">
                        <span>{priceRange.min}</span>
                        <span>{priceRange.max}</span>
                    </div>
                </div>
            </Section>

            {/* Duration */}
            <Section title={`${t("filters.duration")} `}>
                <div className="px-2">
                    <Slider
                        min={durationRange.min}
                        max={durationRange.max}
                        step={1}
                        value={selectedFilters.duration}
                        onValueChange={(val) =>
                            updateRangeFilter("duration", val)
                        }
                        className="w-full duration-slider"
                    />
                    <div className="flex justify-between text-xs text-accent-500 mt-2 font-semibold">
                        <span>{durationRange.min}h</span>
                        <span>{durationRange.max}h</span>
                    </div>
                </div>
            </Section>

            {/* Stopover Duration */}
            <Section title={`${t("filters.stopover_duration")} `}>
                <div className="px-2">
                    <Slider
                        min={0}
                        max={24}
                        step={1}
                        value={selectedFilters.stopoverDuration}
                        onValueChange={(val) =>
                            updateRangeFilter("stopoverDuration", val)
                        }
                        className="w-full duration-slider"
                    />
                    <div className="flex justify-between text-xs text-accent-500 mt-2 font-semibold">
                        <span>{selectedFilters.stopoverDuration[0]}h</span>
                        <span>{selectedFilters.stopoverDuration[1]}h</span>
                    </div>
                </div>
            </Section>

            {/* Stopover Airports */}
            {airports.length > 0 && (
                <Section title={`${t("filters.stopover_airports")}`}>
                    {(showAllAirports ? airports : airports.slice(0, 5)).map(
                        ([code, count]) => (
                            <FilterCheckbox
                                key={code}
                                label={`${code} (${count})`}
                                checked={selectedFilters.airports.includes(
                                    code
                                )}
                                onChange={() => toggleFilter("airports", code)}
                            />
                        )
                    )}
                    {airports.length > 5 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAllAirports(!showAllAirports)}
                            className="p-0 h-auto text-accent-500"
                        >
                            {showAllAirports ? (
                                <>
                                    {t("filters.show_less")}{" "}
                                    <ChevronUp className="size-4 ml-1" />
                                </>
                            ) : (
                                <>
                                    {t("filters.show_more", {
                                        count: airlines.length - 5,
                                    })}{" "}
                                    <ChevronDown className="size-4 ml-1" />
                                </>
                            )}
                        </Button>
                    )}
                </Section>
            )}

            {/* Clear All Filters Button */}
            <div className="pt-4 border-t">
                <Button
                    variant="outline"
                    onClick={() => {
                        setSelectedFilters(getDefaultFilters());
                        setOpen?.(false);
                    }}
                    className="w-full"
                >
                    {t("filters.clear_all")}
                </Button>
            </div>
        </Card>
    );
}

function Section({ title, children }) {
    return (
        <div>
            <h3 className="font-semibold text-sm mb-3 ">{title}</h3>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function FilterCheckbox({ label, checked, onChange }) {
    return (
        <label className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded justify-between">
            <Checkbox
                checked={checked}
                onCheckedChange={onChange}
                className="data-[state=checked]:bg-accent-500 data-[state=checked]:border-accent-500 border-accent-500"
            />
            <span className="flex-1">{label}</span>
        </label>
    );
}
