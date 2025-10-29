"use client";

import { motion } from "framer-motion";
import {
    PlaneTakeoff,
    User,
    Calendar,
    Clock4,
    Wallet,
    Luggage,
    MapPin,
} from "lucide-react";

export default function SummaryCard({
    module,
    orderId,
    bookingRef,
    bookingData,
}) {
    const booking = bookingData?.BookingData || {};
    const response = booking.response || {};
    const segments = response.segments || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-lg p-8 mb-10 backdrop-blur-xl"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <PlaneTakeoff className="w-5 h-5 text-accent-500" />
                    {module} Booking Details
                </h2>
                <span className="text-sm text-gray-500">
                    Ref: {bookingRef || "N/A"}
                </span>
            </div>

            {/* 🧾 Flight Segments */}
            <div className="space-y-6">
                {segments.map((seg, i) => (
                    <div
                        key={i}
                        className="rounded-2xl border border-gray-100 dark:border-gray-800 p-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/60 dark:to-gray-900/40"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                {seg.Origin} → {seg.Destination}
                            </div>
                            <div className="text-sm text-gray-500">
                                {seg.FlightNumber}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-accent-500" />
                                {new Date(
                                    seg.DepartureTime
                                ).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock4 className="w-4 h-4 text-accent-500" />
                                {seg.Duration}
                            </div>
                            <div className="flex items-center gap-1">
                                <Luggage className="w-4 h-4 text-accent-500" />
                                {seg.Baggage || "Check-in baggage included"}
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-accent-500" />
                                {seg.CabinClass}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 💵 Price */}
            <div className="mt-8 flex flex-wrap justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="space-y-1">
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">{orderId}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total Price</p>
                    <p className="text-2xl font-semibold text-accent-600">
                        {response.TotalPrice} {response.SITECurrencyType}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
