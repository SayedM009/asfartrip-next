import { motion } from "framer-motion";

export default function HotelBookingCardSkeleton() {
    return (
        <motion.div className="rounded-2xl bg-white dark:bg-[#1c1c1e] border border-gray-100 dark:border-neutral-800 p-4 flex flex-col gap-2 animate-pulse shadow-sm">
            <div className="w-3/4 h-4 bg-gray-200 dark:bg-neutral-700 rounded" />
            <div className="w-1/2 h-3 bg-gray-200 dark:bg-neutral-700 rounded" />
            <div className="w-full h-20 bg-gray-100 dark:bg-neutral-800 rounded-xl" />
        </motion.div>
    );
}
