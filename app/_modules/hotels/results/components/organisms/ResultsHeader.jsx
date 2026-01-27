"use client";

import { LayoutList, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import SortSelect from "../molecules/SortSelect";
import ActiveFilterBadges from "../molecules/ActiveFilterBadges";
import CountText from "../molecules/CountText";

/**
 * Results header with count, sort, and filter badges
 * @param {Object} props
 * @param {number} props.totalCount - Total hotels count
 * @param {number} props.filteredCount - Filtered hotels count
 * @param {string} props.sortBy - Current sort value
 * @param {Function} props.onSortChange - Callback when sort changes
 * @param {Object} props.filters - Current filter state
 * @param {Function} props.onRemoveFilter - Callback to remove a filter
 * @param {Function} props.onResetFilters - Callback to reset all filters
 * @param {string} props.viewMode - Current view mode (list/grid)
 * @param {Function} props.onViewModeChange - Callback when view mode changes
 */
export default function ResultsHeader({
    totalCount = 0,
    filteredCount = 0,
    sortBy,
    onSortChange,
    filters,
    onRemoveFilter,
    onResetFilters,
    viewMode = "list",
    onViewModeChange,
}) {
    const t = useTranslations("Hotels.results");

    return (
        <div className="mb-4 space-y-3">
            {/* Top row: Count, Sort, View Toggle */}
            <div className="flex items-center justify-between gap-4">
                {/* Results count */}
                <CountText
                    totalCount={totalCount}
                    filteredCount={filteredCount}
                />

                {/* Right side: Sort + View toggle */}
                <div className="flex items-center gap-2">
                    {/* Sort dropdown */}
                    <SortSelect value={sortBy} onChange={onSortChange} />

                    {/* View mode toggle (List/Grid) */}
                    <div className="hidden md:flex items-center border rounded-lg overflow-hidden">
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onViewModeChange?.("list")}
                            className="rounded-none"
                        >
                            <LayoutList className="size-4" />
                        </Button>
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onViewModeChange?.("grid")}
                            className="rounded-none"
                        >
                            <LayoutGrid className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Active filter badges */}
            <ActiveFilterBadges
                filters={filters}
                onRemove={onRemoveFilter}
                onReset={onResetFilters}
            />
        </div>
    );
}
