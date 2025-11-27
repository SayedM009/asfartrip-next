import { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * AI Orb component - status-reactive visual indicator
 * @param {Object} props
 * @param {string} props.status - Current status (loading, success, partial-success, error)
 */
export default function AIOrb({ status }) {
    const palette = useMemo(() => {
        if (status === "success" || status === "partial-success")
            return "from-emerald-500 to-teal-400";
        if (status === "error") return "from-rose-600 to-red-400";
        return "from-orange-400 to-amber-200";
    }, [status]);

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="relative mx-auto"
        >
            <div className="absolute -inset-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.16),transparent_60%)] blur-3xl" />
            <div
                className={`w-28 h-28 rounded-full bg-gradient-to-br ${palette} shadow-lg border-2 border-gray-100 dark:border-gray-700`}
            />
            <motion.div
                className="absolute inset-0 rounded-full border border-white/30"
                animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.2, 0.6] }}
                transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </motion.div>
    );
}
