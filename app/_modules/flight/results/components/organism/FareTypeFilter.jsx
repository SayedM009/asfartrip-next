// app/_modules/flights/results/filters/components/FareTypeFilter.jsx

"use client";

import FilterCheckbox from "../atoms/FilterCheckbox";
import FilterSection from "../molecule/FilterSection";

export default function FareTypeFilter({
    t,
    fareTypeCount,
    selectedFilters,
    toggleFilter,
}) {
    if (!fareTypeCount.refundable && !fareTypeCount.nonRefundable) return null;

    return (
        <FilterSection title={t("filters.type_fare")}>
            {fareTypeCount.refundable > 0 && (
                <FilterCheckbox
                    label={`${t("filters.refundable")} (${
                        fareTypeCount.refundable
                    })`}
                    checked={selectedFilters.fare.includes("refundable")}
                    onChange={() => toggleFilter("fare", "refundable")}
                />
            )}

            {fareTypeCount.nonRefundable > 0 && (
                <FilterCheckbox
                    label={`${t("filters.non_Refundable")} (${
                        fareTypeCount.nonRefundable
                    })`}
                    checked={selectedFilters.fare.includes("nonRefundable")}
                    onChange={() => toggleFilter("fare", "nonRefundable")}
                />
            )}
        </FilterSection>
    );
}
