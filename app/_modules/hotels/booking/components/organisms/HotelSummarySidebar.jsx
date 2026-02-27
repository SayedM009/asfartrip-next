"use client";

import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import useHotelBookingStore from "../../store/hotelBookingStore";
import HotelInfoCard from "../molecules/HotelInfoCard";
import RoomInfoCard from "../molecules/RoomInfoCard";
import StayDatesCard from "../molecules/StayDatesCard";

/**
 * Desktop sidebar with hotel info, room info, dates, price + proceed button
 */
export default function HotelSummarySidebar({ onProceedToPayment, loading }) {
    const t = useTranslations("Hotels.booking");
    const hotelInfo = useHotelBookingStore((state) => state.hotelInfo);
    const roomInfo = useHotelBookingStore((state) => state.roomInfo);
    const searchParams = useHotelBookingStore((state) => state.searchParams);
    const getTotalPrice = useHotelBookingStore((state) => state.getTotalPrice);
    const getCurrency = useHotelBookingStore((state) => state.getCurrency);

    const price = getTotalPrice();
    const currency = getCurrency();

    return (
        <div className="sticky top-24 space-y-0 rounded-2xl border border-border bg-white dark:bg-gray-800/50 overflow-hidden">
            {/* Hotel Info Card */}
            <div className="p-4 border-b border-border/50">
                <HotelInfoCard hotelInfo={hotelInfo} />
            </div>

            {/* Room Info Card */}
            <div className="p-4 border-b border-border/50">
                <RoomInfoCard roomInfo={roomInfo} />
            </div>

            {/* Stay Dates Card */}
            <div className="p-4 border-b border-border/50">
                <StayDatesCard searchParams={searchParams} />
            </div>

            {/* Price Summary */}
            <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-lg font-bold">
                    <span>{t("total")}</span>
                    <span className="text-primary-600">
                        {currency} {price?.toLocaleString()}
                    </span>
                </div>

                {searchParams?.roomsConfig?.length > 0 && (
                    <p className="text-xs text-muted-foreground text-center">
                        {searchParams.roomsConfig.length}{" "}
                        {searchParams.roomsConfig.length === 1 ? t("room") : t("rooms")}
                    </p>
                )}

                {/* Proceed Button — only on step 2 */}
                {onProceedToPayment && (
                    <button
                        onClick={onProceedToPayment}
                        disabled={loading}
                        className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-accent-600 to-accent-500 hover:brightness-110 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        ) : (
                            t("proceed_to_payment")
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
