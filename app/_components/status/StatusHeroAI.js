"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";

export default function StatusHeroAI({
    state = "processing",
    title,
    subtitle,
}) {
    const palette = {
        success: "from-emerald-400 via-cyan-300 to-sky-400",
        failed: "from-rose-500 via-orange-400 to-amber-300",
        pending: "from-amber-400 via-yellow-300 to-lime-300",
        processing: "from-sky-400 via-blue-400 to-indigo-500",
    }[state];

    const Icon = {
        success: <CheckCircle2 className="size-10 text-emerald-400" />,
        failed: <XCircle className="size-10 text-rose-400" />,
        pending: <Clock className="size-10 text-amber-400" />,
        processing: <Loader2 className="size-10 text-blue-400 animate-spin" />,
    }[state] || <Loader2 className="size-10 text-blue-400 animate-spin" />;

    return (
        <section className="relative flex flex-col items-center justify-center text-center pt-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.02] to-transparent blur-3xl"
            />

            {/* Orb glow */}
            <motion.div
                className={`w-56 h-56 rounded-full bg-gradient-to-br ${palette} blur-3xl absolute`}
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.2, 0.4] }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Main content */}
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 flex"
            >
                <div className="flex justify-center">{Icon}</div>
                <div>
                    <h1 className="text-4xl font-semibold tracking-tight mb-3 ">
                        {title || "Processing your request..."}
                    </h1>
                    <p className="text-black/60 dark:text-white/60 max-w-lg mx-auto">
                        {subtitle ||
                            "Our AI systems are validating your transaction in real time."}
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
