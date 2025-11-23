// app/_modules/flights/results/filters/components/DurationFilter.jsx

"use client";

import FilterSection from "./FilterSection";
import { Slider } from "@/components/ui/slider";

export default function DurationFilter({
    t,
    durationRange,
    selectedFilters,
    updateRangeFilter,
}) {
    return (
        <FilterSection
            title={
                <div className="flex justify-between items-center">
                    <span>{t("filters.duration")}</span>
                    <span className="text-xs text-muted-foreground font-normal">
                        {selectedFilters.duration[0]}h -{" "}
                        {selectedFilters.duration[1]}h
                    </span>
                </div>
            }
        >
            <div className="px-2">
                <Slider
                    min={durationRange.min}
                    max={durationRange.max}
                    step={1}
                    value={selectedFilters.duration}
                    onValueChange={(val) => updateRangeFilter("duration", val)}
                    className="w-full duration-slider [&_[data-slot=slider-range]]:bg-accent-500 [&_[data-slot=slider-thumb]]:border-accent-500 [&_[data-slot=slider-thumb]]:focus-visible:ring-accent-500 [&_[data-slot=slider-thumb]]:hover:ring-accent-500"
                />

                <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
                    <span>{durationRange.min}h</span>
                    <span>{durationRange.max}h</span>
                </div>
            </div>
        </FilterSection>
    );
}
