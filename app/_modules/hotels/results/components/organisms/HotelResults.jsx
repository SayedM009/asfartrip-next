"use client";

import useHotelSearch from "../../hooks/useHotelSearch";
import HotelResultsWrapper from "./HotelResultsWrapper";
import HotelSearchSkeleton from "./HotelSearchSkeleton";
import NoHotelsFound from "../molecules/NoHotelsFound";
import MobileResultsHeader from "./MobileResultsHeader";

/**
 * Client-side hotel results component
 * Handles loading states and displays appropriate content
 */
export default function HotelResults() {
    const { hotels, searchPayload, loading, error, searchParams } =
        useHotelSearch();

    // Loading state - show skeleton
    if (loading) {
        return <HotelSearchSkeleton />;
    }

    // Error state
    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-red-500">Error</h1>
                    <p className="text-muted-foreground mt-2">
                        {error.message}
                    </p>
                </div>
            </div>
        );
    }

    // No hotels found
    if (!hotels || hotels.length === 0) {
        return (
            <>
                {/* Mobile: Show search header for modifying search */}
                <div className="md:hidden mb-4">
                    <MobileResultsHeader />
                </div>
                <NoHotelsFound />
            </>
        );
    }

    // Success - show results
    return (
        <HotelResultsWrapper
            hotels={hotels}
            searchParams={searchParams}
            searchPayload={searchPayload}
        />
    );
}
