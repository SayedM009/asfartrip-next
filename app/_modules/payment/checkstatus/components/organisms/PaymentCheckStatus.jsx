"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import useBookingStore from "@/app/_modules/flight/booking/store/bookingStore";
import { usePaymentCheck } from "../../hooks/usePaymentCheck";
import AIOrb from "../atoms/AIOrb";
import StepStatus from "../molecules/StepStatus";

/**
 * Main Payment Check Status Component
 * @param {Object} props
 * @param {Object} props.params - Route params
 * @param {string} props.params.booking_ref - Booking reference
 * @param {Object} props.searchParams - URL search params
 * @param {string} props.searchParams.gateway - Payment gateway (telr, ziina, etc.)
 * @param {string} props.searchParams.order_ref - Telr order reference
 */
export default function PaymentCheckStatus({ params, searchParams }) {
    const { booking_ref } = params;
    const gateway = searchParams?.gateway?.toUpperCase() || "ZIINA";

    let order_ref = searchParams?.order_ref || null;

    if (typeof window !== "undefined") {
        order_ref =
            sessionStorage.getItem(`telr_order_ref_${booking_ref}`) ||
            order_ref;
    }

    const t = useTranslations("PaymentPage");

    const router = useRouter();

    const {
        gateway: { ifrurl },
        searchURL,
        sameBookingURL,
    } = useBookingStore();

    const { status, statusMessage, steps, checkPaymentStatus, retry } =
        usePaymentCheck({ booking_ref, gateway, order_ref });

    // Prevent double execution in React Strict Mode
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        checkPaymentStatus();
    }, [checkPaymentStatus]);

    return (
        <div className="relative overflow-hidden min-h-screen">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24" />

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-2">
                <motion.div
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-xl rounded-3xl bg-white/20 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200 dark:border-gray-600 px-6 py-8 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_50px_rgba(10,10,10,0.70)]"
                >
                    <div className="flex flex-col sm:items-center gap-6">
                        <AIOrb status={status} />

                        <AnimatePresence mode="wait">
                            {status === "loading" && (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.45 }}
                                    className="text-center"
                                >
                                    <div className="flex items-start justify-center gap-1 sm:gap-2">
                                        <Loader2 className="size-5 animate-spin text-amber-500" />
                                        <span className="tracking-wide text-sm text-gray-700 dark:text-gray-200">
                                            {statusMessage}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-300">
                                        {t("aiAgentCoordinating")}
                                    </p>
                                </motion.div>
                            )}

                            {(status === "success" ||
                                status === "partial-success") && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.45 }}
                                    className="text-center"
                                >
                                    <div className="flex items-start justify-center gap-1 sm:gap-2 text-emerald-700">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                        <span className="tracking-wide font-medium">
                                            {statusMessage}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
                                        {status === "partial-success"
                                            ? t("paymentDeductedProcessing")
                                            : t("finalizingItinerary")}
                                    </p>
                                </motion.div>
                            )}

                            {status === "error" && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.45 }}
                                    className="text-center"
                                >
                                    <div className="flex items-start justify-center gap-1 sm:gap-2 text-rose-700">
                                        <XCircle className="w-6 h-6 text-rose-600" />
                                        <span className="tracking-wide font-medium">
                                            {statusMessage}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-3 w-full max-w-xs mx-auto mt-5">
                                        {gateway !== "TELR" && (
                                            <button
                                                onClick={() =>
                                                    (window.location.href =
                                                        ifrurl)
                                                }
                                                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium text-sm cursor-pointer transition-all duration-200 hover:brightness-110 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                                            >
                                                {t("retryPayment")}
                                            </button>
                                        )}

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() =>
                                                    router.push(sameBookingURL)
                                                }
                                                className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold text-sm cursor-pointer transition-all duration-200 hover:brightness-110 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                                            >
                                                {t("sameBooking")}
                                            </button>

                                            <button
                                                onClick={() =>
                                                    router.push(searchURL)
                                                }
                                                className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-400 to-emerald-600 text-white font-medium text-sm cursor-pointer transition-all duration-200 hover:brightness-110 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                                            >
                                                {t("newSearch")}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <StepStatus steps={steps} />
                    </div>
                </motion.div>

                <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                    {t("poweredByAi")}
                </div>
            </div>
        </div>
    );
}
