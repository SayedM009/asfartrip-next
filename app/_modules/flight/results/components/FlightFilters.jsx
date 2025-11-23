"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "use-intl";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";

// Logic Layer
import { useFlightFilterLogic } from "../hooks/useFlightFilterLogic";

// UI Components
import DurationFilter from "./molecule/DurationFilter";
import StopoverDurationFilter from "./molecule/StopoverDurationFilter";
import StopoverAirportsFilter from "./molecule/StopoverAirportsFilter";
import AirlinesFilter from "./molecule/AirlinesFilter";
import FareTypeFilter from "./organism/FareTypeFilter";
import PriceRangeFilter from "./molecule/PriceRangeFilter";
import StopsFilter from "./molecule/StopsFilter";

export default function FlightFilters({
    flights,
    selectedFilters,
    setSelectedFilters,
    setOpen,
}) {
    const t = useTranslations("Flight");
    const { formatPrice, convertPrice } = useCurrency();

    // =============================
    // Logic Layer
    // =============================
    const {
        showAllAirlines,
        setShowAllAirlines,
        showAllAirports,
        setShowAllAirports,
        airportsWithNames,
        priceRange,
        durationRange,
        stopsCount,
        fareTypeCount,
        airlines,
        airports,
    } = useFlightFilterLogic(flights);

    // =============================
    // State Helpers
    // =============================
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

    function updateRangeFilter(key, value) {
        setSelectedFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    function getDefaultFilters() {
        return {
            stops: [],
            fare: [],
            airlines: [],
            priceRange: [priceRange.min, priceRange.max],
            duration: [durationRange.min, durationRange.max],
            airports: [],
            stopoverDuration: [0, 24],
        };
    }

    const defaults = getDefaultFilters();

    function areValuesDifferent(a, b) {
        return Math.abs(Number(a) - Number(b)) > 0.1;
    }

    function isRangeActive(selected, defaults) {
        if (!selected || !defaults) return false;
        // If selected min is significantly greater than default min
        // OR selected max is significantly less than default max
        // then it's active.
        return (
            selected[0] > defaults[0] + 0.1 || selected[1] < defaults[1] - 0.1
        );
    }

    const hasActiveFilters =
        selectedFilters.stops.length > 0 ||
        selectedFilters.fare.length > 0 ||
        selectedFilters.airlines.length > 0 ||
        selectedFilters.airports.length > 0 ||
        isRangeActive(selectedFilters.priceRange, defaults.priceRange) ||
        isRangeActive(selectedFilters.duration, defaults.duration) ||
        isRangeActive(
            selectedFilters.stopoverDuration,
            defaults.stopoverDuration
        );

    return (
        <Card className="sm:p-4 space-y-1 border-0 shadow-none sm:shadow dark:shadow-gray-600">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-sm">
                    {t("filters.showing_result", { count: flights.length })}
                </h2>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setSelectedFilters(getDefaultFilters());
                            setOpen?.(false);
                        }}
                        className="text-xs text-accent-500 hover:text-accent-600 hover:bg-accent-50"
                    >
                        {t("filters.clear_all")}
                    </Button>
                )}
            </div>

            {/* Stops */}
            <StopsFilter
                t={t}
                stopsCount={stopsCount}
                selectedFilters={selectedFilters}
                toggleFilter={toggleFilter}
            />

            {/* Fare type */}
            <FareTypeFilter
                t={t}
                fareTypeCount={fareTypeCount}
                selectedFilters={selectedFilters}
                toggleFilter={toggleFilter}
            />

            {/* Airlines */}
            <AirlinesFilter
                t={t}
                airlines={airlines}
                selectedFilters={selectedFilters}
                toggleFilter={toggleFilter}
                showAllAirlines={showAllAirlines}
                setShowAllAirlines={setShowAllAirlines}
            />

            {/* Price range */}
            <PriceRangeFilter
                t={t}
                priceRange={priceRange}
                selectedFilters={selectedFilters}
                updateRangeFilter={updateRangeFilter}
                formatPrice={formatPrice}
                convertPrice={convertPrice}
            />

            {/* Duration */}
            <DurationFilter
                t={t}
                durationRange={durationRange}
                selectedFilters={selectedFilters}
                updateRangeFilter={updateRangeFilter}
            />

            {/* Stopover Duration */}
            <StopoverDurationFilter
                t={t}
                selectedFilters={selectedFilters}
                updateRangeFilter={updateRangeFilter}
            />

            {/* Stopover Airports */}
            <StopoverAirportsFilter
                t={t}
                airports={airports}
                airportsWithNames={airportsWithNames}
                selectedFilters={selectedFilters}
                toggleFilter={toggleFilter}
                showAllAirports={showAllAirports}
                setShowAllAirports={setShowAllAirports}
            />

            {/* Reset button - mobile */}
            {hasActiveFilters && (
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
            )}
        </Card>
    );
}
