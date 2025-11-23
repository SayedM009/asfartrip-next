// app/_modules/flights/results/filters/components/StopsFilter.jsx

"use client";

import FilterCheckbox from "../atoms/FilterCheckbox";
import FilterSection from "./FilterSection";

export default function StopsFilter({
    t,
    stopsCount,
    selectedFilters,
    toggleFilter,
}) {
    return (
        <FilterSection title={t("filters.number_of_stop")}>
            {stopsCount.nonStop > 0 && (
                <FilterCheckbox
                    label={`${t("filters.non_stop")} (${stopsCount.nonStop})`}
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
        </FilterSection>
    );
}
