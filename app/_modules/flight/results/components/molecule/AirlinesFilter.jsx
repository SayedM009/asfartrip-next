// app/_modules/flights/results/filters/components/AirlinesFilter.jsx

"use client";

import FilterSection from "./FilterSection";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import FilterCheckbox from "../atoms/FilterCheckbox";

export default function AirlinesFilter({
    t,
    airlines,
    selectedFilters,
    toggleFilter,
    showAllAirlines,
    setShowAllAirlines,
}) {
    if (!airlines.length) return null;

    const displayed = showAllAirlines ? airlines : airlines.slice(0, 5);

    return (
        <FilterSection title={t("filters.air_lines")}>
            {displayed.map(([code, count]) => (
                <FilterCheckbox
                    key={code}
                    label={
                        <span className="flex items-center gap-2">
                            <Image
                                src={`/airline_logo/${code}.png`}
                                alt={code}
                                width={20}
                                height={20}
                                loading="lazy"
                                className="rounded"
                                onError={(e) => {
                                    e.currentTarget.src = `https://images.kiwi.com/airlines/64x64/${code}.png`;
                                }}
                            />
                            <span>
                                {t(`airlines.${code}`) || code} ({count})
                            </span>
                        </span>
                    }
                    checked={selectedFilters.airlines.includes(code)}
                    onChange={() => toggleFilter("airlines", code)}
                />
            ))}

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
        </FilterSection>
    );
}
