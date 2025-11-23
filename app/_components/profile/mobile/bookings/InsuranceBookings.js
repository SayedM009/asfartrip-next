"use client";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
// Stores
import { useDashboardBookingsStore } from "@/app/_store/dashboardBookingStore";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";
// Components
import Tabs from "../Tabs";
import { Button } from "@/components/ui/button";
import TravelInsuranceIcon from "@/app/_components/SVG/TravelInsuranceIcon";
import ChevronBasedOnLanguage from "@/app/_components/ui/ChevronBasedOnLanguage";
// Helper functions
import { formatDisplayDate } from "@/app/_helpers/formatDisplayDate";
import { useAuthStore } from "@/app/_modules/auth";

export default function InsuranceBookings() {
    const p = useTranslations("Profile");
    const { formatPrice } = useCurrency();
    const { user } = useAuthStore();
    const { fetchBookings, insuranceBookings, loading } =
        useDashboardBookingsStore();

    const [activeTab, setActiveTab] = useState("upcoming");

    useEffect(() => {
        if (!user.id || !user.usertype) return;
        fetchBookings(user.id, user.usertype, activeTab);
    }, [activeTab, fetchBookings, user.id, user.usertype]);

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
                                <BookingCardSkeleton key={i} />
                            ))}
                        </motion.div>
                    ) : insuranceBookings.length > 0 ? (
                        <motion.div
                            key="bookings"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="grid gap-3 mt-3"
                        >
                            {insuranceBookings.map((b, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.01 }}
                                    className="rounded-2xl bg-white dark:bg-[#1c1c1e] border border-gray-100 dark:border-neutral-800 overflow-hidden shadow-sm"
                                >
                                    {console.log(insuranceBookings)}
                                    {/* Header Row */}
                                    <div
                                        className={`flex items-center justify-between px-4 py-2 text-xs font-semibold ${
                                            b.booking_status === "CREATED"
                                                ? "bg-green-50 text-green-700"
                                                : b.booking_status ===
                                                      "CANCELLED" ||
                                                  b.booking_status === null
                                                ? "bg-red-50 text-red-600"
                                                : "bg-yellow-50 text-yellow-700"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="uppercase">
                                                {p(
                                                    b.booking_status === null
                                                        ? "FAILURE"
                                                        : b.booking_status
                                                )}
                                            </span>
                                        </div>

                                        <span>
                                            {formatDisplayDate(b.voucher_date, {
                                                withYear: true,
                                                pattern: "EEEE d MMMM yyyy ",
                                            })}
                                        </span>
                                    </div>

                                    {/* Main Content */}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold">
                                                {p("policy_number")} :{" "}
                                                {b.policy_id ||
                                                    b.policy_number ||
                                                    "—"}
                                            </p>
                                            <span className="text-sm font-bold">
                                                {formatPrice(
                                                    b.TotalPrice || b.premium
                                                )}
                                            </span>
                                        </div>

                                        {/* INSURANCE DETAILS */}
                                        <div className="mt-2">
                                            <div className="text-md text-gray-700 dark:text-gray-100 flex items-center gap-2 font-semibold capitalize">
                                                {b.customer_name || "—"}{" "}
                                                <ChevronBasedOnLanguage icon="arrow" />
                                                {b.request?.destination ||
                                                    b.Destination ||
                                                    "—"}
                                            </div>

                                            {/* <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                                {p("travel_date")}:{" "}
                                                {formatDisplayDate(
                                                    b?.request?.depart_date,
                                                    {
                                                        withYear: true,
                                                        pattern:
                                                            "EEEE d MMMM yyyy",
                                                    }
                                                )}{" "}
                                                <ChevronBasedOnLanguage icon="arrow" />
                                                {formatDisplayDate(
                                                    b?.request?.return_date,
                                                    {
                                                        withYear: true,
                                                        pattern:
                                                            "EEEE d MMMM yyyy",
                                                    }
                                                )}
                                            </div> */}

                                            <div className="text-xs text-gray-400 mt-1">
                                                Adults: {b.request?.ADT || 0},
                                                Children: {b.request?.CHD || 0},{" "}
                                                Infants: {b.request?.INF || 0}
                                            </div>

                                            <div className="text-xs text-gray-400 mt-1">
                                                Scheme ID: {b.scheme_id || "—"}{" "}
                                                | Quote ID: {b.quote_id || "—"}
                                            </div>

                                            {b.insurance_quote && (
                                                <div className="text-xs text-gray-400 mt-1">
                                                    Plan:{" "}
                                                    {JSON.parse(
                                                        b.insurance_quote
                                                    )?.quotes?.[b.scheme_id]
                                                        ?.name ||
                                                        "Standard Cover"}
                                                </div>
                                            )}
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
                            <TravelInsuranceIcon />
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
                <Link href="/insurance">
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
        <motion.div className="rounded-2xl bg-white dark:bg-[#1c1c1e] border border-gray-100 dark:border-neutral-800 p-4 flex flex-col gap-2 animate-pulse shadow-sm">
            <div className="w-3/4 h-4 bg-gray-200 dark:bg-neutral-700 rounded" />
            <div className="w-1/2 h-3 bg-gray-200 dark:bg-neutral-700 rounded" />
            <div className="w-full h-20 bg-gray-100 dark:bg-neutral-800 rounded-xl" />
        </motion.div>
    );
}
