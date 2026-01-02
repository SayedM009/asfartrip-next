"use client";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

import Image from "next/image";
import useLoyaltyStore from "@/app/_modules/loyalty/store/loyaltyStore";
import { useAuthStore } from "@/app/_modules/auth";
import { useDashboardBookingsStore } from "../../store/dashboardBookingStore";

function Status() {
    const p = useTranslations("Profile");
    const l = useTranslations("Loyalty");
    // user may be null until session syncs from LoyaltyInitializer
    const { user } = useAuthStore();
    const { balance, tier } = useLoyaltyStore();
    const { fetchBookings, totalCompleted, loading } =
        useDashboardBookingsStore();

    const id = user?.id;
    const usertype = user?.usertype;

    useEffect(() => {
        if (!id || !usertype) return;
        fetchBookings(id, usertype, "completed");
    }, [id, usertype, fetchBookings]);

    return (
        <div className="grid grid-cols-3 gap-3 relative">
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="skeleton"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="contents"
                    >
                        {[...Array(3)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="stats"
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0 }}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: { staggerChildren: 0.15 },
                            },
                        }}
                        className="contents"
                    >
                        <StatMotion>
                            <StatsCard
                                icon={
                                    <Image
                                        src="/icons/schedule.png"
                                        alt="Bookings"
                                        width={25}
                                        height={25}
                                        className="shadow-lg"
                                    />
                                }
                                label={p("bookings")}
                                value={totalCompleted}
                            />
                        </StatMotion>
                        <StatMotion>
                            <StatsCard
                                icon={
                                    <Image
                                        src="/icons/star.png"
                                        alt="Points"
                                        width={25}
                                        height={25}
                                        className="shadow-lg"
                                    />
                                }
                                label={p("points")}
                                value={balance}
                            />
                        </StatMotion>
                        <StatMotion>
                            <StatsCard
                                icon={
                                    <Image
                                        src="/icons/trophy.png"
                                        alt="Tier"
                                        width={25}
                                        height={25}
                                        className="shadow-lg"
                                    />
                                }
                                label={p("tier")}
                                value={l(tier?.tier_name) || "-"}
                            />
                        </StatMotion>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Status;

/* --- Helpers --- */
const StatMotion = ({ children }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
        }}
    >
        {children}
    </motion.div>
);

function StatsCard({ icon, label, value }) {
    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            className="rounded-2xl bg-white dark:bg-[#1c1c1e] border border-gray-100 dark:border-neutral-800 flex flex-col items-center justify-center py-4 shadow-[0_4px_25px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.3)]"
        >
            <div className="mb-2">{icon}</div>
            <p className="text-[17px] font-semibold">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {label}
            </p>
        </motion.div>
    );
}

function SkeletonCard() {
    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            className="rounded-2xl bg-white dark:bg-[#1c1c1e] border border-gray-100 dark:border-neutral-800 flex flex-col items-center justify-center py-4 shadow-[0_4px_25px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.3)] animate-pulse"
        >
            <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-700 rounded-lg mb-2" />
            <div className="w-10 h-5 bg-gray-200 dark:bg-neutral-700 rounded mb-1" />
            <div className="w-14 h-3 bg-gray-200 dark:bg-neutral-700 rounded" />
        </motion.div>
    );
}
