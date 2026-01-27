"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
    STAR_RATINGS,
    generatePriceRanges,
    getPropertyTypes,
} from "../../constants/filterOptions";
import StarRating from "../atoms/StarRating";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";

/**
 * Desktop filters sidebar
 * @param {Object} props
 * @param {Array} props.hotels - All hotels (for generating dynamic options)
 * @param {Object} props.filters - Current filter state
 * @param {Function} props.onPriceRangeChange - Callback for price range change
 * @param {Function} props.onToggleStarRating - Callback for star rating toggle
 * @param {Function} props.onTogglePropertyType - Callback for property type toggle
 * @param {Function} props.onReset - Callback to reset all filters
 */
export default function FiltersDesktop({
    hotels = [],
    filters,
    onPriceRangeChange,
    onToggleStarRating,
    onTogglePropertyType,
    onReset,
}) {
    const t = useTranslations("Hotels.results");
    const { currentCurrency } = useCurrency();

    // Generate dynamic options from hotels
    const priceRanges = generatePriceRanges(hotels);
    const propertyTypes = getPropertyTypes(hotels);

    // Collapsible sections
    const [openSections, setOpenSections] = useState({
        price: true,
        stars: true,
        propertyType: true,
    });

    const toggleSection = (section) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    // Get min/max prices for slider
    const prices = hotels.map((h) => h.HotelPrice?.MinPrice || 0);
    const minPrice = Math.min(...prices, 0);
    const maxPrice = Math.max(...prices, 5000);

    // Slider value
    const [sliderValue, setSliderValue] = useState([
        filters.priceRange?.min || minPrice,
        filters.priceRange?.max === Infinity
            ? maxPrice
            : filters.priceRange?.max || maxPrice,
    ]);

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

    const handleSliderCommit = (value) => {
        onPriceRangeChange?.(
            value[0],
            value[1] >= maxPrice ? Infinity : value[1],
        );
    };

    const handlePresetClick = (range) => {
        onPriceRangeChange?.(range.min, range.max);
    };

    return (
        <Card className="sticky top-30 border-0 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{t("filters")}</CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onReset}
                        className="text-xs text-muted-foreground"
                    >
                        {t("clear_filters")}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Price Range Section */}
                <div className="border-b pb-4">
                    <button
                        onClick={() => toggleSection("price")}
                        className="flex items-center justify-between w-full py-2 text-sm font-medium"
                    >
                        {t("price_range")}
                        {openSections.price ? (
                            <ChevronUp className="size-4" />
                        ) : (
                            <ChevronDown className="size-4" />
                        )}
                    </button>

                    {openSections.price && (
                        <div className="mt-3 space-y-4">
                            {/* Slider */}
                            <div className="px-2">
                                <Slider
                                    value={sliderValue}
                                    min={minPrice}
                                    max={maxPrice}
                                    step={10}
                                    onValueChange={handleSliderChange}
                                    onValueCommit={handleSliderCommit}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                    <span>
                                        {sliderValue[0]} {currentCurrency}
                                    </span>
                                    <span>
                                        {sliderValue[1] >= maxPrice
                                            ? `${maxPrice}+`
                                            : sliderValue[1]}{" "}
                                        {currentCurrency}
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
                                        onClick={() => handlePresetClick(range)}
                                        className={`text-xs ${
                                            filters.priceRange?.min ===
                                                range.min &&
                                            filters.priceRange?.max ===
                                                range.max
                                                ? "bg-accent-50 border-accent-500"
                                                : ""
                                        }`}
                                    >
                                        {range.label} {currentCurrency}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Star Rating Section */}
                <div className="border-b pb-4">
                    <button
                        onClick={() => toggleSection("stars")}
                        className="flex items-center justify-between w-full py-2 text-sm font-medium"
                    >
                        {t("star_rating")}
                        {openSections.stars ? (
                            <ChevronUp className="size-4" />
                        ) : (
                            <ChevronDown className="size-4" />
                        )}
                    </button>

                    {openSections.stars && (
                        <div className="mt-3 space-y-2">
                            {STAR_RATINGS.map((rating) => (
                                <label
                                    key={rating}
                                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 rounded "
                                >
                                    <Checkbox
                                        checked={filters.starRatings?.includes(
                                            rating,
                                        )}
                                        onCheckedChange={() =>
                                            onToggleStarRating?.(rating)
                                        }
                                    />
                                    <span className="text-sm flex items-center gap-1">
                                        {rating}{" "}
                                        <StarRating rating={rating} size="sm" />
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Property Type Section */}
                {propertyTypes.length > 0 && (
                    <div>
                        <button
                            onClick={() => toggleSection("propertyType")}
                            className="flex items-center justify-between w-full py-2 text-sm font-medium"
                        >
                            {t("property_type")}
                            {openSections.propertyType ? (
                                <ChevronUp className="size-4" />
                            ) : (
                                <ChevronDown className="size-4" />
                            )}
                        </button>

                        {openSections.propertyType && (
                            <div className="mt-3 space-y-2">
                                {propertyTypes.map((type) => (
                                    <label
                                        key={type}
                                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 rounded"
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
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
