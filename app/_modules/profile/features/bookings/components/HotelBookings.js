"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Tabs from "@/app/_modules/profile/components/molecules/ProfileTabs";
import HotelCard from "@/app/_components/SVG/HotelCard"; // لو عندك أيقونة فندق، أو بدلها بـ Image
import { useTranslations } from "next-intl";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";
import HotelBookingCard from "./molecules/HotelBookingCard";
import HotelBookingCardSkeleton from "./molecules/HotelBookingCardSkeleton";
import { useDashboardBookingsStore } from "@/app/_store/dashboardBookingStore";

export default function HotelBookings() {
    const p = useTranslations("Profile");
    const { formatPrice } = useCurrency();
    const { fetchBookings, hotelBookings, loading } =
        useDashboardBookingsStore();

    const [activeTab, setActiveTab] = useState("upcoming");

    useEffect(() => {
        fetchBookings(52, 2, activeTab);
    }, [activeTab, fetchBookings]);

    return (
        <div className="flex flex-col h-[calc(100vh-50px)]">
            {/* Scrollable Section */}
            <div className="flex-1 overflow-y-auto space-y-4 pb-24">
                {/* 🧭 Tabs */}
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
                                <HotelBookingCardSkeleton key={i} />
                            ))}
                        </motion.div>
                    ) : hotelBookings.length > 0 ? (
                        <motion.div
                            key="bookings"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="grid gap-3 mt-3"
                        >
                            {hotelBookings.map((b, idx) => (
                                <HotelBookingCard key={idx} booking={b} />
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
                            <HotelCard />
                            <h2 className="text-lg text-gray-500 font-semibold">
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
                <Link href="/hotels">
                    <Button className="w-full bg-accent-500 hover:bg-[#cf5f1a] text-white text-sm py-5 rounded-full shadow-md">
                        {p("new_booking")}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
