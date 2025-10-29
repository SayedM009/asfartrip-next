"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, Loader2, Plane } from "lucide-react";

export default function StatusHero({ state, title, subtitle }) {
    const config = {
        success: {
            icon: (
                <CheckCircle2 className="w-16 h-16 text-emerald-500 drop-shadow-lg" />
            ),
            gradient:
                "from-emerald-500/10 via-emerald-400/5 to-transparent border-emerald-300/40",
            glow: "shadow-[0_0_25px_-5px_rgba(16,185,129,0.4)]",
        },
        failed: {
            icon: (
                <XCircle className="w-16 h-16 text-rose-500 drop-shadow-lg" />
            ),
            gradient:
                "from-rose-500/10 via-rose-400/5 to-transparent border-rose-300/40",
            glow: "shadow-[0_0_25px_-5px_rgba(244,63,94,0.4)]",
        },
        pending: {
            icon: <Clock className="w-16 h-16 text-amber-500 drop-shadow-lg" />,
            gradient:
                "from-amber-500/10 via-amber-400/5 to-transparent border-amber-300/40",
            glow: "shadow-[0_0_25px_-5px_rgba(245,158,11,0.4)]",
        },
        processing: {
            icon: (
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin drop-shadow-lg" />
            ),
            gradient:
                "from-blue-500/10 via-blue-400/5 to-transparent border-blue-300/40",
            glow: "shadow-[0_0_25px_-5px_rgba(59,130,246,0.4)]",
        },
    };

    const current = config[state] || config.processing;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`relative rounded-3xl border backdrop-blur-xl overflow-hidden p-10 mb-10 
            bg-gradient-to-br ${current.gradient} ${current.glow}`}
        >
            {/* ✈️ Floating plane */}
            <motion.div
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute top-6 right-10 text-accent-500/30"
            >
                <Plane className="w-12 h-12" />
            </motion.div>

            {/* 🌟 Content */}
            <div className="flex flex-col items-center space-y-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                >
                    {current.icon}
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight"
                >
                    {title}
                </motion.h1>

                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed"
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>
        </motion.section>
    );
}
