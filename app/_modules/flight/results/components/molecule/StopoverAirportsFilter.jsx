// app/_modules/flights/results/filters/components/StopoverAirportsFilter.jsx

"use client";

import FilterSection from "./FilterSection";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import FilterCheckbox from "../atoms/FilterCheckbox";

export default function StopoverAirportsFilter({
    t,
    airports,
    airportsWithNames,
    selectedFilters,
    toggleFilter,
    showAllAirports,
    setShowAllAirports,
}) {
    if (!airports.length) return null;

    const displayed = showAllAirports
        ? airportsWithNames
        : airportsWithNames.slice(0, 5);

    return (
        <FilterSection title={t("filters.stopover_airports")}>
            {displayed.map(({ code, name, count }) => (
                <FilterCheckbox
                    key={code}
                    label={`${name} — ${count}`}
                    checked={selectedFilters.airports.includes(code)}
                    onChange={() => toggleFilter("airports", code)}
                />
            ))}

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
                                count: airports.length - 5,
                            })}{" "}
                            <ChevronDown className="size-4 ml-1" />
                        </>
                    )}
                </Button>
            )}
        </FilterSection>
    );
}
