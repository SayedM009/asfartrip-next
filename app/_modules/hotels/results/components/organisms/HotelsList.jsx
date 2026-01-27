"use client";

import { useEffect, useRef } from "react";
import HotelCard from "../molecules/HotelCard";
import HotelCardSkeleton from "../molecules/HotelCardSkeleton";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

/**
 * Hotels list component with infinite scroll
 * @param {Object} props
 * @param {Array} props.hotels - Array of hotels to display
 * @param {number} props.nights - Number of nights for price calculation
 * @param {Function} props.onLoadMore - Callback when more hotels should be loaded
 * @param {boolean} props.hasMore - Whether there are more hotels to load
 * @param {boolean} props.isLoading - Loading state
 * @param {Function} props.fetchDetails - Callback to fetch hotel details
 * @param {Object} props.hotelDetails - Object with hotel details keyed by hotel ID
 * @param {string} props.viewMode - View mode: 'list' or 'grid'
 */
export default function HotelsList({
    hotels = [],
    nights = 1,
    rooms = 1,
    onLoadMore,
    hasMore = false,
    isLoading = false,
    fetchDetails,
    hotelDetails = {},
    viewMode = "list",
}) {
    const { ref, inView } = useInfiniteScroll();
    const hasCalledLoadMore = useRef(false);

    // Trigger load more when scroll sentinel is in view
    useEffect(() => {
        if (inView && hasMore && !isLoading && !hasCalledLoadMore.current) {
            hasCalledLoadMore.current = true;
            onLoadMore?.();
        }
    }, [inView, hasMore, isLoading, onLoadMore]);

    // Reset the flag when loading completes
    useEffect(() => {
        if (!isLoading) {
            hasCalledLoadMore.current = false;
        }
    }, [isLoading]);

    // Fetch details when hotel card is visible
    const handleCardVisible = (hotelId) => {
        if (fetchDetails && !hotelDetails[hotelId]) {
            fetchDetails(hotelId);
        }
    };

    if (hotels.length === 0 && !isLoading) {
        return null;
    }

    const containerClass =
        viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
            : "flex flex-col gap-3 md:gap-4";

    return (
        <div className={containerClass}>
            {/* Hotel cards */}
            {hotels.map((hotel) => {
                const hotelId = hotel.HotelInfo?.Id;
                return (
                    <div
                        key={hotelId}
                        onMouseEnter={() => handleCardVisible(hotelId)}
                    >
                        <HotelCard
                            hotel={hotel}
                            nights={nights}
                            rooms={rooms}
                            details={hotelDetails[hotelId]}
                        />
                    </div>
                );
            })}

            {/* Loading skeletons */}
            {isLoading && (
                <>
                    <HotelCardSkeleton />
                    <HotelCardSkeleton />
                    <HotelCardSkeleton />
                </>
            )}

            {/* Infinite scroll sentinel */}
            {hasMore && (
                <div
                    ref={ref}
                    className="h-10 flex items-center justify-center"
                >
                    {/* Invisible sentinel for intersection observer */}
                </div>
            )}
        </div>
    );
}
