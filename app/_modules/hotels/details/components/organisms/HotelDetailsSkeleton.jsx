"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for hotel details page
 */
export default function HotelDetailsSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            {/* Gallery Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[400px]">
                <div className="md:col-span-2 md:row-span-2 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                <div className="hidden md:block bg-gray-200 dark:bg-gray-800 rounded-lg" />
                <div className="hidden md:block bg-gray-200 dark:bg-gray-800 rounded-lg" />
                <div className="hidden md:block bg-gray-200 dark:bg-gray-800 rounded-lg" />
                <div className="hidden md:block bg-gray-200 dark:bg-gray-800 rounded-lg" />
            </div>

            {/* Hotel Info Skeleton */}
            <div className="space-y-3">
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-5 w-5" />
                    ))}
                </div>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
            </div>

            {/* Content Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Description */}
                    <div className="space-y-3">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>

                    {/* Rooms */}
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-40" />
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="flex gap-4 p-4 border rounded-lg"
                            >
                                <Skeleton className="h-32 w-40 rounded" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-48" />
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="hidden lg:block">
                    <div className="sticky top-24 p-6 border rounded-lg space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
