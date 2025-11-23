"use client";

import FilterSection from "./FilterSection";
import { Slider } from "@/components/ui/slider";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";

export default function PriceRangeFilter({
    t,
    priceRange,
    selectedFilters,
    updateRangeFilter,
    convertPrice,
}) {
    const { formatPrice, exchangeRate } = useCurrency();

    return (
        <FilterSection
            title={
                <div className="flex justify-between items-center">
                    <span>{t("filters.price_range")}</span>
                    <span className="text-xs text-muted-foreground font-normal">
                        {formatPrice(
                            selectedFilters.priceRange[0] / exchangeRate,
                            undefined,
                            12
                        )}{" "}
                        -{" "}
                        {formatPrice(
                            selectedFilters.priceRange[1] / exchangeRate,
                            undefined,
                            12
                        )}
                    </span>
                </div>
            }
        >
            <div className="px-2">
                <Slider
                    min={convertPrice(priceRange.min)}
                    max={convertPrice(priceRange.max)}
                    step={50}
                    value={selectedFilters.priceRange}
                    onValueChange={(val) =>
                        updateRangeFilter("priceRange", val)
                    }
                    className="w-full duration-slider [&_[data-slot=slider-range]]:bg-accent-500 [&_[data-slot=slider-thumb]]:border-accent-500 [&_[data-slot=slider-thumb]]:focus-visible:ring-accent-500 [&_[data-slot=slider-thumb]]:hover:ring-accent-500"
                />

                <div className="flex justify-between text-xs mt-2 text-muted-foreground font-medium">
                    <span>{formatPrice(priceRange.min, undefined, 12)}</span>
                    <span>{formatPrice(priceRange.max, undefined, 12)}</span>
                </div>
            </div>
        </FilterSection>
    );
}
