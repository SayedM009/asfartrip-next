"use client";

import { motion } from "framer-motion";
import { PlaneTakeoff, PlaneLanding, Clock4, Wallet } from "lucide-react";

export default function FlightSummaryNeo({ data }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl p-8 shadow-[0_0_60px_-10px_rgba(0,0,0,0.6)]"
        >
            {/* Animated gradient border */}
            <motion.div
                className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.08),transparent_80%)]"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            />

            <div className="relative z-10">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <PlaneTakeoff className="w-5 h-5 text-accent" />
                    Flight Summary
                </h2>

                <div className="space-y-6">
                    {data?.segments?.map((seg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="p-5 rounded-2xl bg-gradient-to-br from-[#05203c]/40 to-transparent border border-white/10"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="text-lg font-medium">
                                        {seg.OriginCity} → {seg.DestinationCity}
                                    </h3>
                                    <p className="text-white/50 text-sm">
                                        {seg.Carrier} {seg.FlightNumber}
                                    </p>
                                </div>
                                <div className="text-right text-white/70 text-sm">
                                    <Clock4 className="inline w-4 h-4 mr-1" />
                                    {seg.Duration}
                                </div>
                            </div>
                            <div className="mt-2 flex gap-4 text-white/60 text-sm">
                                <div className="flex items-center gap-1">
                                    <PlaneTakeoff className="w-4 h-4" />{" "}
                                    {seg.OriginAirport}
                                </div>
                                <div className="flex items-center gap-1">
                                    <PlaneLanding className="w-4 h-4" />{" "}
                                    {seg.DestinationAirport}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <div className="bg-green-500/20 border border-green-400/30 px-5 py-3 rounded-2xl text-green-300 font-semibold flex items-center gap-2">
                        <Wallet className="w-4 h-4" /> Total: {data?.TotalPrice}{" "}
                        {data?.SITECurrencyType}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
