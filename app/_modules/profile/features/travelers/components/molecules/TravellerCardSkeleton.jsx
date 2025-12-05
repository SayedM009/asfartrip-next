import { motion } from "framer-motion";
export default function TravellerCardSkeleton() {
    return (
        <motion.div
            className="rounded-2xl bg-white dark:bg-[#1c1c1e] border border-gray-100 dark:border-neutral-800 
                       overflow-hidden shadow-sm animate-pulse"
        >
            {/* Header Skeleton */}
            <div className="h-9 bg-gray-200 dark:bg-neutral-700" />

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="w-32 h-5 bg-gray-200 dark:bg-neutral-700 rounded" />
                    <div className="flex gap-3">
                        <div className="w-5 h-5 bg-gray-200 dark:bg-neutral-700 rounded" />
                        <div className="w-5 h-5 bg-gray-200 dark:bg-neutral-700 rounded" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="w-full h-4 bg-gray-200 dark:bg-neutral-700 rounded" />
                    <div className="w-3/4 h-4 bg-gray-200 dark:bg-neutral-700 rounded" />
                </div>
            </div>
        </motion.div>
    );
}
