import { motion } from "framer-motion";

export default function BookingCardSkeleton() {
    return (
        <motion.div
            className="rounded-2xl bg-white dark:bg-[#1c1c1e] border border-gray-100 dark:border-neutral-800 
                       p-4 flex flex-col justify-between animate-pulse shadow-sm min-h-[110px]"
        >
            {/* Header (Status + PNR) */}
            <div className="flex items-center justify-between mb-2">
                <div className="w-20 h-5 bg-gray-200 dark:bg-neutral-700 rounded-full" />{" "}
                {/* status */}
                <div className="w-28 h-3 bg-gray-200 dark:bg-neutral-700 rounded" />{" "}
                {/* pnr */}
            </div>

            {/* Cities Row */}
            <div className="flex items-center justify-between mt-1">
                <div className="w-24 h-4 bg-gray-200 dark:bg-neutral-700 rounded" />{" "}
                {/* from -> to */}
            </div>

            {/* Footer (price + dates) */}
            <div className="flex items-end justify-between mt-3">
                <div className="w-14 h-5 bg-gray-200 dark:bg-neutral-700 rounded" />{" "}
                {/* price */}
                <div className="flex flex-col gap-1 text-right">
                    <div className="w-28 h-3 bg-gray-200 dark:bg-neutral-700 rounded" />
                    <div className="w-24 h-3 bg-gray-200 dark:bg-neutral-700 rounded" />
                </div>
            </div>
        </motion.div>
    );
}
