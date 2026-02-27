"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import useHotelBookingStore from "../../store/hotelBookingStore";
import HotelInfoCard from "../molecules/HotelInfoCard";
import RoomInfoCard from "../molecules/RoomInfoCard";
import StayDatesCard from "../molecules/StayDatesCard";

/**
 * Mobile popup dialog showing booking summary (same as sidebar cards)
 */
export default function HotelSummaryDialog({ isOpen, onClose }) {
    const t = useTranslations("Hotels.booking");
    const hotelInfo = useHotelBookingStore((state) => state.hotelInfo);
    const roomInfo = useHotelBookingStore((state) => state.roomInfo);
    const searchParams = useHotelBookingStore((state) => state.searchParams);
    const getTotalPrice = useHotelBookingStore((state) => state.getTotalPrice);
    const getCurrency = useHotelBookingStore((state) => state.getCurrency);

    const price = getTotalPrice();
    const currency = getCurrency();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white dark:bg-gray-900 shadow-xl"
                    >
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                        </div>

                        {/* Close */}
                        <div className="flex items-center justify-between px-4 pb-2">
                            <h3 className="font-semibold text-lg">{t("booking_summary")}</h3>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-4 pb-6 space-y-4 divide-y divide-border/50">
                            <div className="pt-2">
                                <HotelInfoCard hotelInfo={hotelInfo} />
                            </div>
                            <div className="pt-4">
                                <RoomInfoCard roomInfo={roomInfo} />
                            </div>
                            <div className="pt-4">
                                <StayDatesCard searchParams={searchParams} />
                            </div>
                            <div className="pt-4 flex items-center justify-between text-lg font-bold">
                                <span>{t("total")}</span>
                                <span className="text-primary-600">
                                    {currency} {price?.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
