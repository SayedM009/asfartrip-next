"use client";

import FlowingSortDialog from "./FlowingSortDialog";
import FlowingFilterDialog from "./FlowingFilterDialog";

export default function FloatingSortFilter({
    flights,
    setSortBy,
    sortBy,
    originalFlights,
    selectedFilters,
    setSelectedFilters,
}) {
    return (
        <section
            className="
            md:hidden 
            fixed bottom-3 left-50 translate-x-[-50%]
            bg-accent-100 shadow text-accent-500
            px-3 py-2 rounded-xl font-semibold
            flex items-center space-x-2 whitespace-nowrap"
        >
            <FlowingSortDialog
                flights={flights}
                setSortBy={setSortBy}
                sortBy={sortBy}
            />

            <span>|</span>

            <FlowingFilterDialog
                flights={originalFlights}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
            />
        </section>
    );
}
