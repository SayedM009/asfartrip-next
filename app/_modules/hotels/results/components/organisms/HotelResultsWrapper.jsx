"use client";

import { useState } from "react";
import { useHotelResults } from "../../hooks/useHotelResults";
import HotelsList from "./HotelsList";
import ResultsHeader from "./ResultsHeader";
import FiltersDesktop from "./FiltersDesktop";
import MobileBottomToolbar from "./MobileBottomToolbar";
import NoFilterResults from "../molecules/NoFilterResults";
import TimeoutPopup from "@/app/_components/ui/TimeoutPopup";
import MobileResultsHeader from "./MobileResultsHeader";
import CountText from "../molecules/CountText";

/**
 * Wrapper component for hotel results with state management, filters, and timeout
 * @param {Object} props
 * @param {Array} props.hotels - Initial hotels from server
 * @param {Object} props.searchParams - Search parameters
 * @param {Object} props.searchPayload - Search Payload
 */
export default function HotelResultsWrapper({
    hotels: initialHotels = [],
    searchParams = {},
    searchPayload = {},
}) {
    const [viewMode, setViewMode] = useState("list");

    const {
        hotels: displayedHotels,
        totalHotels,
        filteredCount,
        nights,
        loadMore,
        hasMore,
        fetchHotelDetails,
        hotelDetails,
        isLoadingDetails,
        // Filter state
        filters,
        setPriceRange,
        toggleStarRating,
        togglePropertyType,
        removeFilter,
        resetFilters,
        activeFiltersCount,
        // Sort state
        sortBy,
        setSortBy,
        rooms,
    } = useHotelResults(initialHotels, searchPayload);

    const isLoading =
        typeof isLoadingDetails === "function"
            ? false
            : Object.values(isLoadingDetails || {}).some((v) => v);

    // Check if filters resulted in no matches
    const hasFiltersApplied = activeFiltersCount > 0;
    const showNoFilterResults =
        hasFiltersApplied && displayedHotels.length === 0 && totalHotels > 0;

    return (
        <>
            <div className="flex gap-6">
                {/* Desktop Filters Sidebar */}
                <aside className="hidden lg:block w-[280px] flex-shrink-0">
                    <FiltersDesktop
                        hotels={initialHotels}
                        filters={filters}
                        onPriceRangeChange={setPriceRange}
                        onToggleStarRating={toggleStarRating}
                        onTogglePropertyType={togglePropertyType}
                        onReset={resetFilters}
                    />
                </aside>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                    {/* Desktop Results Header */}
                    <div className="hidden md:block">
                        <ResultsHeader
                            totalCount={totalHotels}
                            filteredCount={filteredCount}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            filters={filters}
                            onRemoveFilter={removeFilter}
                            onResetFilters={resetFilters}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                        />
                    </div>

                    {/* Mobile Results Header & Mobile Bottom Toolbar*/}
                    <div
                        className={`md:hidden sticky top-0 z-2 bg-background  pt-2 pb-3`}
                    >
                        <MobileResultsHeader />

                        <MobileBottomToolbar
                            hotels={initialHotels}
                            filters={filters}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            onPriceRangeChange={setPriceRange}
                            onToggleStarRating={toggleStarRating}
                            onTogglePropertyType={togglePropertyType}
                            onReset={resetFilters}
                            activeFiltersCount={activeFiltersCount}
                        />
                    </div>

                    {/* Mobile: Simple count */}
                    <div className="md:hidden my-3">
                        <CountText
                            totalCount={totalHotels}
                            filteredCount={filteredCount}
                        />
                    </div>

                    {/* Hotels list or empty state */}
                    <div className="pb-20 md:pb-0">
                        {showNoFilterResults ? (
                            <NoFilterResults onReset={resetFilters} />
                        ) : (
                            <HotelsList
                                hotels={displayedHotels}
                                nights={nights}
                                rooms={rooms}
                                onLoadMore={loadMore}
                                hasMore={hasMore}
                                isLoading={isLoading}
                                fetchDetails={fetchHotelDetails}
                                hotelDetails={hotelDetails}
                                viewMode={viewMode}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Session timeout popup (15 minutes) */}
            <TimeoutPopup timeoutMinutes={15} refreshCurrentPage={true} />
        </>
    );
}
