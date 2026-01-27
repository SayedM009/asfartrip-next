"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal } from "lucide-react";
import {
    STAR_RATINGS,
    generatePriceRanges,
    getPropertyTypes,
} from "../../constants/filterOptions";

/**
 * Mobile filters dialog (full-screen)
 * @param {Object} props
 * @param {Array} props.hotels - All hotels for generating dynamic options
 * @param {Object} props.filters - Current filter state
 * @param {Function} props.onPriceRangeChange - Price range change callback
 * @param {Function} props.onToggleStarRating - Star rating toggle callback
 * @param {Function} props.onTogglePropertyType - Property type toggle callback
 * @param {Function} props.onReset - Reset filters callback
 * @param {number} props.activeCount - Number of active filters
 */
export default function FiltersMobile({
    hotels = [],
    filters,
    onPriceRangeChange,
    onToggleStarRating,
    onTogglePropertyType,
    onReset,
    activeCount = 0,
}) {
    const t = useTranslations("Hotels.results");

    // Generate dynamic options from hotels
    const priceRanges = generatePriceRanges(hotels);
    const propertyTypes = getPropertyTypes(hotels);

    // Get min/max prices for slider
    const prices = hotels.map((h) => h.HotelPrice?.MinPrice || 0);
    const minPrice = Math.min(...prices, 0);
    const maxPrice = Math.max(...prices, 5000);

    // Local slider value
    const [sliderValue, setSliderValue] = useState([minPrice, maxPrice]);

    useEffect(() => {
        setSliderValue([
            filters.priceRange?.min || minPrice,
            filters.priceRange?.max === Infinity
                ? maxPrice
                : filters.priceRange?.max || maxPrice,
        ]);
    }, [filters.priceRange, minPrice, maxPrice]);

    const handleSliderChange = (value) => {
        setSliderValue(value);
    };

    const handleApply = () => {
        onPriceRangeChange?.(
            sliderValue[0],
            sliderValue[1] >= maxPrice ? Infinity : sliderValue[1],
        );
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 flex-1 font-bold"
                >
                    <SlidersHorizontal className="size-4" />
                    {t("filters")}
                    {activeCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-accent-500 text-white text-xs rounded-full size-5 flex items-center justify-center">
                            {activeCount}
                        </span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent
                className="max-w-none w-full h-full max-h-none rounded-none p-0 gap-0 flex flex-col"
                showCloseButton={false}
            >
                {/* Header */}
                <DialogHeader className="p-4 border-b sticky top-0 bg-background z-10">
                    <div className="flex items-center justify-between">
                        <DialogTitle>{t("filters")}</DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onReset}
                            className="text-accent-500"
                        >
                            {t("reset_filters")}
                        </Button>
                        <DialogClose asChild>
                            <Button variant="ghost" size="sm">
                                {t("cancel")}
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Price Range Section */}
                    <div>
                        <h3 className="font-semibold mb-4">
                            {t("price_range")}
                        </h3>
                        <div className="px-2 mb-4">
                            <Slider
                                value={sliderValue}
                                min={minPrice}
                                max={maxPrice}
                                step={10}
                                onValueChange={handleSliderChange}
                                className="w-full"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground mt-2">
                                <span>{sliderValue[0]} AED</span>
                                <span>
                                    {sliderValue[1] >= maxPrice
                                        ? `${maxPrice}+`
                                        : sliderValue[1]}{" "}
                                    AED
                                </span>
                            </div>
                        </div>
                        {/* Preset ranges */}
                        <div className="flex flex-wrap gap-2">
                            {priceRanges.map((range) => (
                                <Button
                                    key={range.label}
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setSliderValue([
                                            range.min,
                                            range.max === Infinity
                                                ? maxPrice
                                                : range.max,
                                        ])
                                    }
                                    className="text-xs"
                                >
                                    {range.label} AED
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Star Rating Section */}
                    <div>
                        <h3 className="font-semibold mb-4">
                            {t("star_rating")}
                        </h3>
                        <div className="space-y-3">
                            {STAR_RATINGS.map((rating) => (
                                <label
                                    key={rating}
                                    className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                                >
                                    <Checkbox
                                        checked={filters.starRatings?.includes(
                                            rating,
                                        )}
                                        onCheckedChange={() =>
                                            onToggleStarRating?.(rating)
                                        }
                                    />
                                    <span className="text-sm">
                                        {rating} {"★".repeat(rating)}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Property Type Section */}
                    {propertyTypes.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-4">
                                {t("property_type")}
                            </h3>
                            <div className="space-y-3">
                                {propertyTypes.map((type) => (
                                    <label
                                        key={type}
                                        className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                                    >
                                        <Checkbox
                                            checked={filters.propertyTypes?.includes(
                                                type,
                                            )}
                                            onCheckedChange={() =>
                                                onTogglePropertyType?.(type)
                                            }
                                        />
                                        <span className="text-sm">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer with Apply button */}
                <div className="p-4 border-t bottom-0 bg-background">
                    <DialogClose asChild>
                        <Button
                            onClick={handleApply}
                            className="w-full bg-accent-500 hover:bg-accent-600 text-white"
                        >
                            {t("apply_filters")}
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}
