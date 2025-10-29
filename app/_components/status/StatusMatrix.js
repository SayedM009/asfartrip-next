"use client";

import { motion } from "framer-motion";
import StatusHeroAI from "./StatusHeroAI";
import FlightSummaryNeoFull from "./FlightSummaryNeoFull";

export default function StatusMatrix({ state, booking }) {
    return (
        <div className="relative min-h-screen bg-[#050b15] text-white overflow-hidden">
            {/* Moving light beam */}
            <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(232,107,30,0.15),transparent_70%)] blur-2xl"
                animate={{ opacity: [0.2, 0.4, 0.2], y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
            />

            {/* Hero Section */}
            <StatusHeroAI
                state={state}
                title={
                    state === "success"
                        ? "Flight Confirmed!"
                        : state === "failed"
                        ? "Transaction Failed"
                        : "Processing Booking"
                }
                subtitle={
                    state === "success"
                        ? "All systems green. E-ticket issued successfully."
                        : "Our system is validating your data with airline & gateway."
                }
            />

            {/* Divider line */}
            <motion.div
                className="h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent w-3/4 mx-auto mb-12 opacity-40"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2 }}
            />

            {/* Summary section */}
            <div className="max-w-5xl mx-auto px-6 pb-20">
                <FlightSummaryNeoFull data={booking} />
            </div>
        </div>
    );
}
