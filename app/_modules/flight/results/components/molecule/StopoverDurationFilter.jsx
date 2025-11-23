// app/_modules/flights/results/filters/components/StopoverDurationFilter.jsx

"use client";

import { Slider } from "@/components/ui/slider";
import FilterSection from "./FilterSection";

export default function StopoverDurationFilter({
    t,
    selectedFilters,
    updateRangeFilter,
}) {
    return (
        <FilterSection
            title={
                <div className="flex justify-between items-center">
                    <span>{t("filters.stopover_duration")}</span>
                    <span className="text-xs text-muted-foreground font-normal">
                        {selectedFilters.stopoverDuration[0]}h -{" "}
                        {selectedFilters.stopoverDuration[1]}h
                    </span>
                </div>
            }
        >
            <div className="px-2">
                <Slider
                    min={0}
                    max={24}
                    step={1}
                    value={selectedFilters.stopoverDuration}
                    onValueChange={(v) =>
                        updateRangeFilter("stopoverDuration", v)
                    }
                    className="[&_[data-slot=slider-range]]:bg-accent-500 [&_[data-slot=slider-thumb]]:border-accent-500 [&_[data-slot=slider-thumb]]:focus-visible:ring-accent-500 [&_[data-slot=slider-thumb]]:hover:ring-accent-500"
                />

                <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
                    <span>0h</span>
                    <span>24h</span>
                </div>
            </div>
        </FilterSection>
    );
}
