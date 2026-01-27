"use client";

import { Card } from "@/components/ui/card";

/**
 * Skeleton loader for HotelCard
 */
export default function HotelCardSkeleton() {
    return (
        <Card className="overflow-hidden border-0 shadow-none md:shadow-sm animate-pulse py-0">
            <div className="flex flex-row">
                {/* Image Skeleton */}
                <div className="w-[120px] sm:w-[180px] md:w-[220px] h-[220px] sm:h-[180px] md:h-[200px] flex-shrink-0 bg-gray-200 dark:bg-gray-800" />

                {/* Content Skeleton */}
                <div className="flex-1 p-3 md:p-4 flex flex-col justify-between">
                    {/* Top section */}
                    <div>
                        {/* Star rating */}
                        <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="size-3 rounded bg-gray-200 dark:bg-gray-800"
                                />
                            ))}
                        </div>

                        {/* Hotel name */}
                        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />

                        {/* Address */}
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2" />

                        {/* TripAdvisor rating */}
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-10 bg-gray-200 dark:bg-gray-800 rounded" />
                            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
                        </div>
                    </div>

                    {/* Bottom section - Price */}
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col items-end gap-1">
                            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
