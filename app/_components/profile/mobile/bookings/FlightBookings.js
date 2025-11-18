"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardBookingsStore } from "@/app/_store/dashboardBookingStore";
import { Button } from "@/components/ui/button";
import { formatDisplayDate } from "@/app/_helpers/formatDisplayDate";
import { useTranslations } from "next-intl";

import Tabs from "../Tabs";
import ChevronBasedOnLanguage from "../../../ui/ChevronBasedOnLanguage";
import AirplaneStairs from "../../../SVG/AirplaneStairs";
import useAuthStore from "@/app/_store/authStore";
import { useCurrencyStore } from "@/app/_store/useCurrencyStore";

export default function FlightBookings() {
    const p = useTranslations("Profile");
    const { formatPrice } = useCurrencyStore();
    const {
        user: { id, usertype },
    } = useAuthStore();
    const { fetchBookings, flightBookings, loading } =
        useDashboardBookingsStore();

    const [activeTab, setActiveTab] = useState("upcoming");

    // 1. user_id and user_type needed
    useEffect(() => {
        // if (!id || !usertype) return null;
        fetchBookings(id, usertype, activeTab);
    }, [activeTab, fetchBookings, id, usertype]);

    return (
        <div className="flex flex-col h-[calc(100vh-50px)]">
            {" "}
            <div className="flex-1 overflow-y-auto space-y-4 pb-24">
                {" "}
                <Tabs
                    tabs={[
                        { label: "Upcoming", value: "upcoming" },
                        { label: "Completed", value: "completed" },
                        { label: "Cancelled", value: "cancelled" },
                    ]}
                    active={activeTab}
                    onChange={setActiveTab}
                />
                {/* 📦 Content */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="skeleton"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid gap-3 mt-3"
                        >
                            {[...Array(3)].map((_, i) => (
                                <BookingCardSkeleton key={i} />
                            ))}
                        </motion.div>
                    ) : flightBookings.length > 0 ? (
                        <motion.div
                            key="bookings"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="grid gap-3 mt-3"
                        >
                            {flightBookings.map((b, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.01 }}
                                    className="rounded-2xl bg-white dark:bg-[#1c1c1e] border border-gray-100 dark:border-neutral-800 overflow-hidden shadow-sm"
                                >
                                    {/* Header Row */}
                                    <div
                                        className={`flex items-center justify-between px-4 py-2 text-xs font-semibold ${
                                            b.ticket_status === "CREATED"
                                                ? "bg-green-50 text-green-700"
                                                : b.ticket_status ===
                                                  "CANCELLED"
                                                ? "bg-red-50 text-red-600"
                                                : "bg-yellow-50 text-yellow-700"
                                        }`}
                                    >
                                        <span className=" uppercase">
                                            {p(b.ticket_status)}
                                        </span>
                                        <span>
                                            {formatDisplayDate(
                                                b.voucher_date || b.travel_date,
                                                {
                                                    withYear: true,
                                                    pattern:
                                                        "EEEE d MMMM  yyyy",
                                                }
                                            )}
                                        </span>
                                    </div>

                                    {/* Main Content */}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold">
                                                {b.pnr_no || "—"}
                                            </p>
                                            <span className="text-sm font-bold">
                                                {formatPrice(b.amount)}
                                            </span>
                                        </div>

                                        <div className="text-md text-gray-700 mt-2 flex items-center gap-2 font-semibold dark:text-gray-50">
                                            {b.details.fromCityName}
                                            <ChevronBasedOnLanguage icon="arrow" />
                                            {b.details.toCityName}
                                        </div>

                                        <div className="text-xs text-gray-400 mt-1">
                                            {p("travel_date")}:{" "}
                                            {formatDisplayDate(b.travel_date, {
                                                withYear: true,
                                                pattern: "EEEE d MMMM yyyy",
                                            }) || ""}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20 text-center gap-2"
                        >
                            <AirplaneStairs />
                            <h2 className="text-lg text-gray-500 font-bold">
                                {p("no_bookings", { tab: p(activeTab) })}
                            </h2>
                            <p className="text-sm text-gray-400 font-semibold">
                                {activeTab === "upcoming" &&
                                    p("no_upcoming_bookings")}
                                {activeTab === "completed" &&
                                    p("no_completed_bookings")}
                                {activeTab === "cancelled" &&
                                    p("no_cancelled_bookings")}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {/* ➕ Book Now Button */}
            <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-[#1c1c1e] p-4 border-t border-gray-100 dark:border-neutral-800">
                <Link href="/flights">
                    <Button className="w-full bg-accent-500 hover:bg-[#cf5f1a] text-white text-sm py-5 rounded-full shadow-md">
                        {p("new_booking")}
                    </Button>
                </Link>
            </div>
        </div>
    );
}

function BookingCardSkeleton() {
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
