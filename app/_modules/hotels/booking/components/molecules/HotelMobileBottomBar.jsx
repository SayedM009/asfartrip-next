"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronUp, Loader2 } from "lucide-react";
import useHotelBookingStore from "../../store/hotelBookingStore";
import HotelSummaryDialog from "../organisms/HotelSummaryDialog";

/**
 * Mobile fixed bottom bar — tap to open summary, proceed button
 */
export default function HotelMobileBottomBar({ handleProceedToPayment, loading }) {
    const [showDialog, setShowDialog] = useState(false);
    const t = useTranslations("Hotels.booking");
    const getTotalPrice = useHotelBookingStore((state) => state.getTotalPrice);
    const getCurrency = useHotelBookingStore((state) => state.getCurrency);

    const price = getTotalPrice();
    const currency = getCurrency();

    return (
        <>
            {/* Bottom Bar — mobile only */}
            <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white dark:bg-gray-900 border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
                {/* Tap to open summary */}
                <button
                    onClick={() => setShowDialog(true)}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm cursor-pointer"
                >
                    <span className="font-semibold">
                        {currency} {price?.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-primary-600 text-xs">
                        {t("view_details")}
                        <ChevronUp className="w-3.5 h-3.5" />
                    </span>
                </button>

                {/* Proceed Button */}
                <div className="px-4 pb-4">
                    <button
                        onClick={handleProceedToPayment}
                        disabled={loading}
                        className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:brightness-110 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        ) : (
                            t("proceed_to_payment")
                        )}
                    </button>
                </div>
            </div>

            {/* Summary Dialog */}
            <HotelSummaryDialog
                isOpen={showDialog}
                onClose={() => setShowDialog(false)}
            />
        </>
    );
}
