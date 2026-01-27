"use client";

import SortDialog from "../molecules/SortDialog";
import FiltersMobile from "../molecules/FiltersMobile";

/**
 * Sticky bottom toolbar for mobile with Sort + Filter buttons
 * @param {Object} props
 * @param {Array} props.hotels - All hotels
 * @param {Object} props.filters - Current filter state
 * @param {string} props.sortBy - Current sort value
 * @param {Function} props.onSortChange - Sort change callback
 * @param {Function} props.onPriceRangeChange - Price range change callback
 * @param {Function} props.onToggleStarRating - Star rating toggle callback
 * @param {Function} props.onTogglePropertyType - Property type toggle callback
 * @param {Function} props.onReset - Reset filters callback
 * @param {number} props.activeFiltersCount - Number of active filters
 */
export default function MobileBottomToolbar({
    hotels = [],
    filters,
    sortBy,
    onSortChange,
    onPriceRangeChange,
    onToggleStarRating,
    onTogglePropertyType,
    onReset,
    activeFiltersCount = 0,
}) {
    return (
        <div className="bg-background mt-3 flex gap-3 md:hidden">
            <SortDialog value={sortBy} onChange={onSortChange} />
            <FiltersMobile
                hotels={hotels}
                filters={filters}
                onPriceRangeChange={onPriceRangeChange}
                onToggleStarRating={onToggleStarRating}
                onTogglePropertyType={onTogglePropertyType}
                onReset={onReset}
                activeCount={activeFiltersCount}
            />
        </div>
    );
}
