import { motion } from "framer-motion";

export default function StatusBadge({ status }) {
    const styles = {
        success: "bg-green-500/10 text-green-700 border-green-400/30",
        pending: "bg-amber-500/20 text-amber-400 border-amber-400/30",
        failed: "bg-red-500/20 text-red-400 border-red-400/30",
    };

    const labels = {
        success: "CONFIRMED",
        pending: "PENDING",
        failed: "FAILED",
    };

    return (
        <motion.span
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`px-3 py-1 rounded-full border text-sm font-bold ${styles[status]} w-fit`}
        >
            {labels[status]}
        </motion.span>
    );
}
