import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

/**
 * Step Status component - displays progress steps
 * @param {Object} props
 * @param {Array} props.steps - Array of step objects with label and status
 */
export default function StepStatus({ steps }) {
    const getStepStyle = (stepStatus) => {
        switch (stepStatus) {
            case "success":
                return "border-emerald-500 bg-emerald-100/70 text-emerald-700";
            case "error":
                return "border-rose-600 bg-rose-100/70 text-rose-700";
            case "loading":
                return "border-amber-400 bg-amber-100/70 text-amber-700 animate-pulse";
            default: // pending
                return "border-gray-200 dark:border-gray-600 bg-white/40 dark:bg-gray-900/40 text-gray-500 dark:text-gray-300";
        }
    };

    return (
        <div className="mt-3 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[12px]">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`rounded-lg px-3 py-2 border transition-all duration-300 ${getStepStyle(
                            step.status
                        )}`}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span>{step.label}</span>
                            {step.status === "loading" && (
                                <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                            )}
                            {step.status === "success" && (
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            )}
                            {step.status === "error" && (
                                <XCircle className="w-3 h-3 text-rose-500" />
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
