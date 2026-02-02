"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton for room card
 */
export default function RoomCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="flex flex-col md:flex-row animate-pulse">
                {/* Image */}
                <div className="w-full md:w-48 h-40 bg-gray-200 dark:bg-gray-800" />

                {/* Content */}
                <div className="flex-1 p-4 space-y-3">
                    <Skeleton className="h-5 w-48" />
                    <div className="flex gap-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-32 rounded-full" />
                    </div>
                    <div className="flex justify-between pt-4 border-t">
                        <div>
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-4 w-32 mt-1" />
                        </div>
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </div>
        </Card>
    );
}
