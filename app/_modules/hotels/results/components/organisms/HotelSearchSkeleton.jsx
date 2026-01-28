"use client";

import HotelCardSkeleton from "../molecules/HotelCardSkeleton";
import MobileResultsHeader from "./MobileResultsHeader";

/**
 * Full page skeleton for hotel search loading state
 * Shows mobile header + skeleton cards
 */
export default function HotelSearchSkeleton() {
    return (
        <div className="flex gap-6">
            {/* Desktop Filters Sidebar Skeleton */}
            <aside className="hidden lg:block w-[280px] flex-shrink-0">
                <div className="sticky top-24 space-y-6 animate-pulse">
                    {/* Filter header */}
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-24" />

                    {/* Price range */}
                    <div className="p-4 border rounded-lg space-y-3">
                        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-28" />
                        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded" />
                    </div>

                    {/* Star rating */}
                    <div className="p-4 border rounded-lg space-y-3">
                        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-32" />
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="h-8 w-12 bg-gray-200 dark:bg-gray-800 rounded"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Property type */}
                    <div className="p-4 border rounded-lg space-y-3">
                        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-28" />
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-full"
                            />
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
                {/* Mobile header */}
                <div className="md:hidden sticky top-0 z-2 bg-background pt-2 pb-3">
                    <MobileResultsHeader />
                </div>

                {/* Results header skeleton */}
                <div className="hidden md:flex justify-between items-center mb-4 animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-48" />
                    <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-48" />
                </div>

                {/* Mobile Sort & Filter */}
                <div className="md:hidden flex justify-between items-center mb-4 animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48" />
                </div>

                {/* Mobile count skeleton */}
                <div className="md:hidden my-3 animate-pulse">
                    <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-32" />
                </div>

                {/* Skeleton cards */}
                <div className="space-y-4 pb-20 md:pb-0">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <HotelCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
